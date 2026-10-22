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
  // 1. 有効な Transfer 履歴を取得
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

  // 2. 選手ごとに時系列順に並べる
  {
    $setWindowFields: {
      partitionBy: "$player",
      sortBy: {
        from_date: 1,
        doa: 1,
        _id: 1,
      },
      output: {
        nextTransferDate: {
          $shift: {
            output: "$from_date",
            by: 1,
            default: null,
          },
        },
      },
    },
  },

  // 3. 対象期間と所属期間が重なる Transfer を取得
  {
    $match: {
      from_date: {
        $lt: seasonEnd,
      },
      $or: [
        {
          nextTransferDate: null,
        },
        {
          nextTransferDate: {
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
        to_team: "$to_team",
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
    },
  },
];
