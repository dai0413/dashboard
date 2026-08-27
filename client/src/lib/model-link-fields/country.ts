import { LinkField } from "../../types/types";
import { APP_ROUTES } from "../appRoutes";

export const country: LinkField[] = [
  {
    field: "name",
    to: APP_ROUTES.NATIONAL_SUMMARY,
  },
];
