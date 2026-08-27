import { LinkField } from "../../types/types";
import { APP_ROUTES } from "../appRoutes";

export const referee: LinkField[] = [
  {
    field: "name",
    to: APP_ROUTES.REFEREE_SUMMARY,
  },
];
