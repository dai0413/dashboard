import { LinkField } from "../../types/types";
import { APP_ROUTES } from "../appRoutes";

export const injury: LinkField[] = [
  {
    field: "team",
    to: APP_ROUTES.TEAM_SUMMARY,
  },
  {
    field: "player",
    to: APP_ROUTES.PLAYER_SUMMARY,
  },
];
