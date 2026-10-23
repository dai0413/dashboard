import { PipelineStage, Types } from "mongoose";

const ACTIVE_TRANSFER_FORMS = [
  "完全",
  "期限付き",
  "育成型期限付き",
  "期限付き延長",
  "育成型期限付き延長",
  "復帰",
  "更新",
] as const;

type CustomPipeLine = {
  seasonEnd: Date;
  seasonStart: Date;
  citizenshipIds: string[];
  targetCountryIds: string[];
};

export const customPipeline = ({
  seasonEnd,
  seasonStart,
  citizenshipIds,
  targetCountryIds,
}: CustomPipeLine): PipelineStage[] => [
  // 1. 対象期間内に加入している可能性のある Transfer 履歴を取得
  {
    $match: {
      form: {
        $in: ACTIVE_TRANSFER_FORMS,
      },
      isCancelled: {
        $ne: true,
      },
      from_date: {
        $lt: seasonEnd,
      },
    },
  },

  // 2. 加入先チームへの退団レコードを検索
  {
    $lookup: {
      from: "transfers",
      let: {
        playerId: "$player",
        teamId: "$to_team",
        joinedAt: "$from_date",
      },
      pipeline: [
        {
          $match: {
            isCancelled: {
              $ne: true,
            },
            $expr: {
              $and: [
                // 同じ選手
                {
                  $eq: ["$player", "$$playerId"],
                },
                // 加入先チームと退団レコードの所属チームが一致
                {
                  $eq: ["$from_team", "$$teamId"],
                },
                // 加入日より後のレコード
                {
                  $gt: ["$from_date", "$$joinedAt"],
                },
              ],
            },
          },
        },

        // 加入日から最も近い退団レコードを取得
        {
          $sort: {
            from_date: 1,
            doa: 1,
            _id: 1,
          },
        },
        {
          $limit: 1,
        },

        // 退団日だけを取得
        {
          $project: {
            _id: 0,
            from_date: 1,
          },
        },
      ],
      as: "departure",
    },
  },

  // 3. 退団日を取り出す
  {
    $set: {
      leftAt: {
        $ifNull: [
          {
            $arrayElemAt: ["$departure.from_date", 0],
          },
          null,
        ],
      },
    },
  },

  // 4. 対象期間と所属期間が重なる Transfer だけを取得
  {
    $match: {
      // 加入先チームが存在するレコード
      to_team: {
        $exists: true,
        $ne: null,
      },

      // 対象期間の終了前に加入
      from_date: {
        $lt: seasonEnd,
      },
      $or: [
        // 退団レコードが存在しない
        {
          leftAt: null,
        },
        // 対象期間の開始時点ではまだ退団していない
        {
          leftAt: {
            $gt: seasonStart,
          },
        },
      ],
    },
  },

  // 4. Player を参照
  {
    $lookup: {
      from: "players",
      localField: "player",
      foreignField: "_id",
      as: "player",
    },
  },
  {
    $unwind: "$player",
  },

  // 5. 国籍で絞り込む
  {
    $match: {
      "player.citizenship": {
        $in: citizenshipIds.map((id) => new Types.ObjectId(id)),
      },
    },
  },

  // 6. Team を参照
  {
    $lookup: {
      from: "teams",
      localField: "to_team",
      foreignField: "_id",
      as: "team",
    },
  },
  {
    $unwind: "$team",
  },

  // 7. 対象国で絞り込む
  {
    $match: {
      "team.country": {
        $in: targetCountryIds.map((id) => new Types.ObjectId(id)),
      },
    },
  },

  // 8. 選手ごとに1件に集約
  {
    $sort: {
      player: 1,
      from_date: -1,
      doa: -1,
      _id: -1,
    },
  },
  {
    $group: {
      _id: "$player",
      doc: {
        $first: "$$ROOT",
      },
    },
  },
  {
    $replaceRoot: {
      newRoot: "$doc",
    },
  },
  // 8-1. 次の Transfer を取得
  {
    $lookup: {
      from: "transfers",
      let: {
        playerId: "$player._id",
        currentToTeam: "$to_team",
        currentFromDate: "$from_date",
        currentTransferId: "$_id",
      },
      pipeline: [
        {
          $match: {
            form: {
              $in: ACTIVE_TRANSFER_FORMS,
            },
            isCancelled: {
              $ne: true,
            },
            $expr: {
              $and: [
                // 同じ選手
                {
                  $eq: ["$player", "$$playerId"],
                },
                // 現在の Transfer の to_team が次の Transfer の from_team
                {
                  $eq: ["$from_team", "$$currentToTeam"],
                },
                // 現在の Transfer より後の日付
                {
                  $or: [
                    {
                      $gt: ["$from_date", "$$currentFromDate"],
                    },
                    {
                      $and: [
                        {
                          $eq: ["$from_date", "$$currentFromDate"],
                        },
                        {
                          $gt: ["$_id", "$$currentTransferId"],
                        },
                      ],
                    },
                  ],
                },
                // 対象シーズンの期間内
                {
                  $gte: ["$from_date", seasonStart],
                },
                {
                  $lt: ["$from_date", seasonEnd],
                },
              ],
            },
          },
        },
        {
          $sort: {
            from_date: 1,
            doa: 1,
            _id: 1,
          },
        },
        {
          $limit: 1,
        },
      ],
      as: "nextTransfer",
    },
  },
  // 8-2. 配列から単一オブジェクトへ変換
  {
    $set: {
      nextTransfer: {
        $ifNull: [
          {
            $arrayElemAt: ["$nextTransfer", 0],
          },
          null,
        ],
      },
    },
  },
  // 9. TeamCompetitionSeason を取得
  {
    $lookup: {
      from: "teamcompetitionseasons",
      let: {
        teamId: "$to_team",
      },
      pipeline: [
        // 9-1. 同じチームのデータを取得
        {
          $match: {
            $expr: {
              $eq: ["$team", "$$teamId"],
            },
          },
        },

        // 9-2. Season を参照
        {
          $lookup: {
            from: "seasons",
            localField: "season",
            foreignField: "_id",
            as: "season",
          },
        },
        {
          $unwind: "$season",
        },

        // 9-3. 検索対象期間内の Season に絞り込む
        {
          $match: {
            "season.start_date": {
              $gte: seasonStart,
              $lt: seasonEnd,
            },
          },
        },

        // 9-4. 最新の Season を優先
        {
          $sort: {
            "season.start_date": -1,
            _id: -1,
          },
        },
        {
          $limit: 1,
        },
      ],
      as: "teamCompetitionSeason",
    },
  },
  // 9-5. 配列から単一オブジェクトへ変換
  {
    $unwind: {
      path: "$teamCompetitionSeason",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: "countries",
      localField: "team.country",
      foreignField: "_id",
      as: "country",
    },
  },
  {
    $unwind: {
      path: "$country",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $project: {
      _id: 0,
      country: 1,
      player: 1,
      teamCompetitionSeason: 1,

      transfer: {
        _id: "$_id",
        from_team: "$from_team",
        from_team_name: "$from_team_name",
        to_team: "$to_team",
        to_team_name: "$to_team_name",
        player: "$player",
        position: "$position",
        form: "$form",
        from_date: "$from_date",
        doa: "$doa",
        URL: "$URL",
        isCancelled: "$isCancelled",
        createdAt: "$createdAt",
        updatedAt: "$updatedAt",
        __v: "$__v",
      },

      nextTransfer: {
        $cond: [
          { $ne: ["$nextTransfer", null] },
          {
            _id: "$nextTransfer._id",
            from_team: "$nextTransfer.from_team",
            from_team_name: "$nextTransfer.from_team_name",
            to_team: "$nextTransfer.to_team",
            to_team_name: "$nextTransfer.to_team_name",
            player: "$nextTransfer.player",
            position: "$nextTransfer.position",
            form: "$nextTransfer.form",
            from_date: "$nextTransfer.from_date",
            doa: "$nextTransfer.doa",
            URL: "$nextTransfer.URL",
            isCancelled: "$nextTransfer.isCancelled",
            createdAt: "$nextTransfer.createdAt",
            updatedAt: "$nextTransfer.updatedAt",
            __v: "$nextTransfer.__v",
          },
          null,
        ],
      },
    },
  },
];
