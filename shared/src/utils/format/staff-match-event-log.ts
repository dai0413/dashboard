import z from "zod";
import {
  StaffMatchEventLogResponseSchema,
  StaffMatchEventLogPopulatedSchema,
} from "@dai0413/myorg-shared";

const staffMatchEventLog = (
  staffMatchEventLog: z.infer<typeof StaffMatchEventLogPopulatedSchema>,
): z.infer<typeof StaffMatchEventLogResponseSchema> => {
  const { staff, staff_name, ...rest } = staffMatchEventLog;

  const staff_obj = staff ?? { name: staff_name as string };

  return {
    ...rest,
    staff: staff_obj,
  };
};

export { staffMatchEventLog };
