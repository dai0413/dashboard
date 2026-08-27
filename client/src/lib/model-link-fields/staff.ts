import { LinkField } from "../../types/types";
import { APP_ROUTES } from "../appRoutes";

export const staff: LinkField[] = [
  {
    field: "name",
    to: APP_ROUTES.STAFF_SUMMARY,
  },
  {
    field: "player",
    to: APP_ROUTES.PLAYER_SUMMARY,
  },
];
