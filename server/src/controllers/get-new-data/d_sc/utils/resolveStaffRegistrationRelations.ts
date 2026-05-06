import { generateNormalizedEnName } from "@dai0413/myorg-shared";
import {
  Form,
  Scraped,
} from "@dai0413/myorg-shared/types/get-new-data/models/staff-registration-history";
import { StaffModel } from "../../../../models/staff.js";
import { TeamModel } from "../../../../models/team.js";
import { SeasonModel } from "../../../../models/season.js";
import { CompetitionModel } from "../../../../models/competition.js";
import { StaffRegistrationHistoryModel } from "../../../../models/staff-registration-history.js";

export const resolveStaffRegistrationRelations = async (
  data: Scraped[],
): Promise<Partial<Form>[]> => {
  const competitionCache = new Map<string, Promise<{ _id: any } | null>>();
  const seasonCache = new Map<string, Promise<{ _id: any } | null>>();
  const staffIdsCache = new Map<string, Promise<any[]>>();

  const newData = await Promise.all(
    data.map(async (d) => {
      const normalized = d.team?.team?.normalize("NFKC");

      let team = undefined;

      const teams = await TeamModel.find({
        $or: [{ team: d.team?.team }, { team: normalized }],
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
        d.date < new Date("2026/08/01")
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

      let staffIds: string[] = [];

      if (season && team) {
        const key = `${season._id}_${team._id}`;
        if (!staffIdsCache.has(key)) {
          staffIdsCache.set(
            key,
            StaffRegistrationHistoryModel.distinct("staff", {
              season: season._id,
              team: team._id,
              registration_type: "register",
            }).exec(),
          );
        }
        staffIds = await staffIdsCache.get(key)!;
      }

      const staffFindObj: any = {
        name: d.staff?.name,
      };

      if (d.staff?.en_name) {
        staffFindObj.normalized_en_name = generateNormalizedEnName(
          d.staff.en_name,
        );
      }

      if (d.registration_type === "register") {
        staffFindObj.dob = d.staff?.dob;
      } else {
        staffFindObj._id = { $in: staffIds };
      }

      let staff = undefined;
      const staffs = await StaffModel.find(staffFindObj)
        .select("_id")
        .lean<{ _id: any }[]>();

      if (staffs.length === 1) {
        staff = staffs[0];
      }

      const result: Partial<Form> = {
        season: season?._id?.toString() || undefined,
        team: team?._id?.toString() || undefined,
        staff: staff?._id?.toString() || undefined,
        registration_type: d.registration_type,
        changes: { ...d.changes },
        date: d.date,
      };

      return result;
    }),
  );

  return newData;
};
