import { LinkField } from "../../types/types";
import { APP_ROUTES } from "../appRoutes";

export const nationalCallUp: LinkField[] = [
  {
    field: "series",
    to: APP_ROUTES.NATIONAL_MATCH_SERIES_SUMMARY,
  },
  {
    field: "player",
    to: APP_ROUTES.PLAYER_SUMMARY,
  },
  {
    field: "team",
    to: APP_ROUTES.TEAM_SUMMARY,
  },
];
