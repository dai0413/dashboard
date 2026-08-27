import { LinkField } from "../../types/types";
import { APP_ROUTES } from "../appRoutes";

export const competition: LinkField[] = [
  {
    field: "name",
    to: APP_ROUTES.COMPETITION_SUMMARY,
  },
  {
    field: "country",
    to: APP_ROUTES.NATIONAL_SUMMARY,
  },
];
