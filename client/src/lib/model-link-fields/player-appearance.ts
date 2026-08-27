import { LinkField } from "../../types/types";
import { APP_ROUTES } from "../appRoutes";

export const playerAppearance: LinkField[] = [
  {
    field: "player",
    to: APP_ROUTES.PLAYER_SUMMARY,
  },
  {
    field: "team",
    to: APP_ROUTES.TEAM_SUMMARY,
  },
  {
    field: "match",
    to: APP_ROUTES.MATCH_SUMMARY,
  },
];
