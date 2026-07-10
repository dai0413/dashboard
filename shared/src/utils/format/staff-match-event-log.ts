import z from "zod";
import {
  StaffMatchEventLogResponseSchema,
  StaffMatchEventLogPopulatedSchema,
} from "@dai0413/myorg-shared";

const staffMatchEventLog = (
  staffMatchEventLog: z.infer<typeof StaffMatchEventLogPopulatedSchema>,
): z.infer<typeof StaffMatchEventLogResponseSchema> => {
  const { staff, staff_name, ...rest } = staffMatchEventLog;

  const staff_obj = staff
    ? staff
    : staff_name
      ? { name: staff_name }
      : undefined;

  return {
    ...rest,
    staff: staff_obj,
  };
};

export { staffMatchEventLog };
