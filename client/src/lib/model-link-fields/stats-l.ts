import { LinkField } from "../../types/types";
import { APP_ROUTES } from "../appRoutes";

export const statsL: LinkField[] = [
  {
    field: "match",
    to: APP_ROUTES.MATCH_SUMMARY,
  },
  {
    field: "team",
    to: APP_ROUTES.TEAM_SUMMARY,
  },
];
