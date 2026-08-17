import { Select } from "@dai0413/myorg-shared";
import {
  ResolveInput,
  ResolveOutput,
} from "@dai0413/myorg-shared/types/resolver/playerAppearance";
import { Types } from "mongoose";
import { PlayerRegistrationModel } from "../../../models/player-registration.js";
import { NationalCallUpModel } from "../../../models/national-callup.js";

type ResolveData = ResolveInput<{
  player: Select.MODEL;
}> & {
  season?: string[];
  series?: string;
};

export const playerAppearance = async (
  data: ResolveData[],
): Promise<ResolveOutput[]> => {
  const resolvePlayer = async (
    data: ResolveData[],
  ): Promise<Partial<ResolveOutput>[]> => {
    // 同大会で登録中の選手（背番号一致または選手名一致で一件のみ合致）を探す
    const newData: Partial<ResolveOutput>[] = await Promise.all(
      data.map(async (d) => {
        const seasonObjectIds =
          d.season?.map((s) => new Types.ObjectId(s)) || [];

        if (!d.team?.id) {
          return {
            ...d,
            player: undefined,
            team: undefined,
          };
        }

        const teamObjectId = new Types.ObjectId(d.team.id);

        const registrationFilter = {
          season: { $in: seasonObjectIds },
          team: teamObjectId,
          registration_type: "register",
        };

        let matchPlayers = await PlayerRegistrationModel.find({
          ...registrationFilter,
          name: d.player_name,
        })
          .select(["player"])
          .lean();

        if (matchPlayers.length === 0 && d.number != null) {
          matchPlayers = await PlayerRegistrationModel.find({
            ...registrationFilter,
            number: d.number,
          })
            .select(["player"])
            .lean();
        }

        const callupPlayers: { player: Types.ObjectId }[] =
          await NationalCallUpModel.aggregate([
            {
              $match: {
                series: new Types.ObjectId(d.series),
              },
            },
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
            {
              $match: {
                "player.name": d.player_name,
              },
            },
            {
              $project: {
                player: "$player._id",
              },
            },
          ]);

        const playerIds = [
          ...new Set([
            ...matchPlayers.map((p) => p.player.toString()),
            ...callupPlayers.map((p) => p.player.toString()),
          ]),
        ];

        const playerId =
          playerIds.length === 1 ? playerIds[0].toString() : undefined;

        const player: ResolveOutput["player"] = playerId
          ? { id: playerId, label: d.player_name ?? "" }
          : undefined;

        return {
          ...d,
          player: player,
          player_name: player ? undefined : d.player_name,
        };
      }),
    );

    return newData;
  };

  const resolved = await resolvePlayer(data);

  return resolved;
};
