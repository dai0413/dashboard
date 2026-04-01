import {
  Label,
  StaffAppearancePopulatedSchema,
  StaffAppearancePopulateLabelSchema,
} from "@dai0413/myorg-shared";
import { Types } from "mongoose";
import { StaffRegistrationModel } from "src/models/staff-registration.js";
import z from "zod";

type ResolveInput = Omit<
  Partial<z.infer<typeof StaffAppearancePopulatedSchema>>,
  "team" | "match"
> & {
  match: Label;
  team?: Label;
  season?: string[];
};
type ResolveOutput = Partial<
  z.infer<typeof StaffAppearancePopulateLabelSchema>
>;

export const staffAppearance = async (
  data: ResolveInput[],
): Promise<Partial<ResolveOutput>[]> => {
  const resolveStaff = async (
    data: ResolveInput[],
  ): Promise<Partial<ResolveOutput>[]> => {
    // 同大会で登録中の選手（背番号一致または選手名一致で一件のみ合致）を探す
    const newData: Partial<ResolveOutput>[] = await Promise.all(
      data.map(async (d) => {
        const seasonObjectIds = d.season?.map((s) => new Types.ObjectId(s));
        const teamObjectId = new Types.ObjectId(d.team?.id);

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

  const resolved = resolveStaff(data);

  return resolved;
};
