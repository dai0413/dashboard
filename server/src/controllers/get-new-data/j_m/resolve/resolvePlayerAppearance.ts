import {
  Form,
  Scraped,
} from "@dai0413/myorg-shared/types/j_m/player-appearance";
import { PlayerRegistrationModel } from "../../../../models/player-registration.js";
import { Types } from "mongoose";

export const resolvePlayerAppearance = async (
  data: { home: Scraped[]; away: Scraped[] },
  season: { home: string[]; away: string[] },
  team: { home?: string; away?: string },
): Promise<{ home: Partial<Form>[]; away: Partial<Form>[] }> => {
  const resolvePlayer = async (
    data: Scraped[],
    seasons: string[],
    teamId?: string,
  ): Promise<Partial<Form>[]> => {
    const seasonObjectIds = seasons.map((s) => new Types.ObjectId(s));
    const teamObjectId = new Types.ObjectId(teamId);

    // 同大会で登録中の選手（背番号一致または選手名一致で一件のみ合致）を探す
    const newData: Partial<Form>[] = await Promise.all(
      data.map(async (d) => {
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

        const player: Form["player"] = playerId
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

  const home = await resolvePlayer(data.home, season.home, team.home);
  const away = await resolvePlayer(data.away, season.away, team.away);

  return { home, away };
};
