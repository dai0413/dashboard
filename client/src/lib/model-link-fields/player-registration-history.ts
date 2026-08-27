import { LinkField } from "../../types/types";
import { APP_ROUTES } from "../appRoutes";

export const playerRegistrationHistory: LinkField[] = [
  {
    field: "competition",
    to: APP_ROUTES.COMPETITION_SUMMARY,
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
