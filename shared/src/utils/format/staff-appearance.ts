import z from "zod";
import {
  StaffAppearanceResponseSchema,
  StaffAppearancePopulatedSchema,
} from "@dai0413/myorg-shared";

const staffAppearance = (
  staffAppearance: z.infer<typeof StaffAppearancePopulatedSchema>,
): z.infer<typeof StaffAppearanceResponseSchema> => {
  const { staff, staff_name, ...rest } = staffAppearance;

  const staff_obj = staff ?? { name: staff_name as string };

  return {
    ...rest,
    staff: staff_obj,
  };
};

export { staffAppearance };
