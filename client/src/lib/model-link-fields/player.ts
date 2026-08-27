import { LinkField } from "../../types/types";
import { APP_ROUTES } from "../appRoutes";

export const player: LinkField[] = [
  {
    field: "name",
    to: APP_ROUTES.PLAYER_SUMMARY,
  },
];
