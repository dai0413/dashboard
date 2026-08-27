import { LinkField } from "../../types/types";
import { APP_ROUTES } from "../appRoutes";

export const match: LinkField[] = [
  {
    field: "competition",
    to: APP_ROUTES.COMPETITION_SUMMARY,
  },
  {
    field: "home_team",
    to: APP_ROUTES.TEAM_SUMMARY,
  },
  {
    field: "away_team",
    to: APP_ROUTES.TEAM_SUMMARY,
  },
  {
    field: "result-string",
    to: APP_ROUTES.MATCH_SUMMARY,
  },
];
