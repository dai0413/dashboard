import { LinkField } from "../../types/types";
import { APP_ROUTES } from "../appRoutes";

export const competitionStage: LinkField[] = [
  {
    field: "competition",
    to: APP_ROUTES.COMPETITION_SUMMARY,
  },
];
