import { LinkField } from "../../types/types";
import { APP_ROUTES } from "../appRoutes";

export const refereeAppearance: LinkField[] = [
  {
    field: "match",
    to: APP_ROUTES.MATCH_SUMMARY,
  },
  {
    field: "referee",
    to: APP_ROUTES.REFEREE_SUMMARY,
  },
];
