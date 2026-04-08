import { Select } from "@dai0413/myorg-shared";
import {
  ResolveInput,
  ResolveOutput,
} from "@dai0413/myorg-shared/types/resolver/playerAppearance";
import { Types } from "mongoose";
import { PlayerRegistrationModel } from "../../../models/player-registration.js";

type ResolveData = ResolveInput<{
  player: Select.MODEL;
}> & {
  season?: string[];
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

        const teamObjectId = new Types.ObjectId(d.team?.id);

        if (!teamObjectId) return { ...d, player: undefined, team: undefined };

        const matchPlayers = await PlayerRegistrationModel.find({
          $or: [
            {
              season: { $in: seasonObjectIds },
              team: teamObjectId,
              registration_type: "register",
              number: d.number,
            },
            {
              season: { $in: seasonObjectIds },
              team: teamObjectId,
              registration_type: "register",
              name: d.player_name,
            },
          ],
        })
          .select("player")
          .lean();

        const playerIds = [
          ...new Set(matchPlayers.map((p) => p.player.toString())),
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
