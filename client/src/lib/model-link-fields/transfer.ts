import { LinkField } from "../../types/types";
import { APP_ROUTES } from "../appRoutes";

export const transfer: LinkField[] = [
  {
    field: "player",
    to: APP_ROUTES.PLAYER_SUMMARY,
  },
  {
    field: "from_team",
    to: APP_ROUTES.TEAM_SUMMARY,
  },
  {
    field: "to_team",
    to: APP_ROUTES.TEAM_SUMMARY,
  },
];
