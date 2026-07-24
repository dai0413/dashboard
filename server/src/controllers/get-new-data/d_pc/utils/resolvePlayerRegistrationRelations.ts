import { generateNormalizedEnName } from "@dai0413/myorg-shared";
import {
  Form,
  Scraped,
} from "@dai0413/myorg-shared/types/get-new-data/models/player-registration-history";
import { PlayerModel } from "../../../../models/player.js";
import { TeamModel } from "../../../../models/team.js";
import { SeasonModel } from "../../../../models/season.js";
import { CompetitionModel } from "../../../../models/competition.js";
import { PlayerRegistrationHistoryModel } from "../../../../models/player-registration-history.js";

export const resolvePlayerRegistrationRelations = async (
  data: Scraped[],
): Promise<Partial<Form>[]> => {
  const competitionCache = new Map<string, Promise<{ _id: any } | null>>();
  const seasonCache = new Map<string, Promise<{ _id: any } | null>>();
  const playerIdsCache = new Map<string, Promise<any[]>>();

  const newData = await Promise.all(
    data.map(async (d) => {
      const normalized = d.team?.team?.normalize("NFKC");

      let team = undefined;

      const teams = await TeamModel.find({
        $or: [{ team: d.team?.team }, { normalized_name: normalized }],
      })
        .select("_id")
        .lean<{ _id: any }[]>();

      if (teams.length === 1) {
        team = teams[0];
      }

      let competitionName = d.competition?.name;

      if (
        d.date &&
        d.date >= new Date("2026/01/01") &&
        d.date < new Date("2026/07/01")
      ) {
        if (competitionName === "Ｊ１リーグ") {
          competitionName = "Ｊ１百年構想リーグ";
        } else if (competitionName === "Ｊ２リーグ") {
          competitionName = "Ｊ２・Ｊ３百年構想リーグ";
        } else if (competitionName === "Ｊ３リーグ") {
          competitionName = "Ｊ２・Ｊ３百年構想リーグ";
        }
      }

      if (competitionName && !competitionCache.has(competitionName)) {
        competitionCache.set(
          competitionName,
          CompetitionModel.findOne({ name: competitionName })
            .select("_id")
            .lean<{ _id: any } | null>()
            .exec(),
        );
      }
      const competition = competitionName
        ? await competitionCache.get(competitionName)
        : undefined;

      const seasonKey = competition?._id?.toString();
      if (seasonKey && !seasonCache.has(seasonKey)) {
        seasonCache.set(
          seasonKey,
          SeasonModel.findOne({
            competition: competition?._id,
            current: true,
          })
            .select("_id")
            .lean<{ _id: any } | null>()
            .exec(),
        );
      }
      const season = seasonKey ? await seasonCache.get(seasonKey) : undefined;

      let playerIds: string[] = [];

      if (season && team) {
        const key = `${season._id}_${team._id}`;
        if (!playerIdsCache.has(key)) {
          playerIdsCache.set(
            key,
            PlayerRegistrationHistoryModel.distinct("player", {
              season: season._id,
              team: team._id,
              registration_type: "register",
            }).exec(),
          );
        }
        playerIds = await playerIdsCache.get(key)!;
      }

      const playerFindObj: any = {
        name: d.player?.name,
      };

      if (d.player?.en_name) {
        playerFindObj.normalized_en_name = generateNormalizedEnName(
          d.player.en_name,
        );
      }

      if (d.registration_type === "register") {
        playerFindObj.pob = d.player?.pob;
        playerFindObj.dob = d.player?.dob;
      } else {
        playerFindObj._id = { $in: playerIds };
      }

      let player = undefined;
      const players = await PlayerModel.find(playerFindObj)
        .select("_id")
        .lean<{ _id: any }[]>();

      if (players.length === 1) {
        player = players[0];
      }

      const result: Partial<Form> = {
        season: season?._id?.toString() || undefined,
        team: team?._id?.toString() || undefined,
        player: player?._id?.toString() || undefined,
        registration_type: d.registration_type,
        changes: { ...d.changes },
        date: d.date,
      };

      return result;
    }),
  );

  return newData;
};
