import { LinkField } from "../../types/types";
import { APP_ROUTES } from "../appRoutes";

export const teamCompetitionSeason: LinkField[] = [
  {
    field: "competition",
    to: APP_ROUTES.COMPETITION_SUMMARY,
  },
  {
    field: "team",
    to: APP_ROUTES.TEAM_SUMMARY,
  },
];
