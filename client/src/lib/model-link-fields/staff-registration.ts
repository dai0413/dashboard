import { LinkField } from "../../types/types";
import { APP_ROUTES } from "../appRoutes";

export const staffRegistration: LinkField[] = [
  {
    field: "staff",
    to: APP_ROUTES.STAFF_SUMMARY,
  },
  {
    field: "team",
    to: APP_ROUTES.TEAM_SUMMARY,
  },
];
