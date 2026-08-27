import { LinkField } from "../../types/types";
import { APP_ROUTES } from "../appRoutes";

export const stadium: LinkField[] = [
  {
    field: "country",
    to: APP_ROUTES.NATIONAL_SUMMARY,
  },
];
