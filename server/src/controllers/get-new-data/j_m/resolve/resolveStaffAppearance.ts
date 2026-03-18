import {
  Form,
  Scraped,
} from "@dai0413/myorg-shared/types/j_m/staff-appearance";
import { StaffRegistrationModel } from "../../../../models/staff-registration.js";
import { Types } from "mongoose";

export const resolveStaffAppearance = async (
  data: { home: Scraped[]; away: Scraped[] },
  season: { home: string[]; away: string[] },
  team: { home?: string; away?: string },
): Promise<{ home: Partial<Form>[]; away: Partial<Form>[] }> => {
  const resolveStaff = async (
    data: Scraped[],
    seasons: string[],
    teamId?: string,
  ): Promise<Partial<Form>[]> => {
    const seasonObjectIds = seasons.map((s) => new Types.ObjectId(s));
    const teamObjectId = new Types.ObjectId(teamId);

    // 同大会で登録中の選手（背番号一致または選手名一致で一件のみ合致）を探す
    const newData: Partial<Form>[] = await Promise.all(
      data.map(async (d) => {
        if (!teamObjectId) return { ...d, staff: undefined, team: undefined };

        const matchStaffs = await StaffRegistrationModel.find({
          $or: [
            {
              season: { $in: seasonObjectIds },
              team: teamObjectId,
              registration_type: "register",
              name: d.staff_name,
            },
          ],
        })
          .select("staff")
          .lean();

        const staffIds = [
          ...new Set(matchStaffs.map((p) => p.staff.toString())),
        ];

        const staffId =
          staffIds.length === 1 ? staffIds[0].toString() : undefined;

        const staff = staffId
          ? { id: staffId, label: d.staff_name || "" }
          : undefined;

        return {
          ...d,
          staff,
          staff_name: staff ? undefined : d.staff_name,
        };
      }),
    );

    return newData;
  };

  const home = await resolveStaff(data.home, season.home, team.home);
  const away = await resolveStaff(data.away, season.away, team.away);

  return { home, away };
};
