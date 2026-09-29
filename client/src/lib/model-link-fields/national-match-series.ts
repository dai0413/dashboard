import { LinkField } from "../../types/types";
import { APP_ROUTES } from "../appRoutes";

export const nationalMatchSeries: LinkField[] = [
  {
    field: "name",
    to: APP_ROUTES.NATIONAL_MATCH_SERIES_SUMMARY,
  },
  {
    field: "team",
    to: APP_ROUTES.TEAM_SUMMARY,
  },
];
