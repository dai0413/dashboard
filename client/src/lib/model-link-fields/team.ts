import { LinkField } from "../../types/types";
import { APP_ROUTES } from "../appRoutes";

export const team: LinkField[] = [
  {
    field: "team",
    to: APP_ROUTES.TEAM_SUMMARY,
  },
];
