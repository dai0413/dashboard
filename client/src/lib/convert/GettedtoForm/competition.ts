import {
  CompetitionForm,
  CompetitionGet,
} from "../../../types/models/competition";

export const competition = (t: CompetitionGet): CompetitionForm => ({
  ...t,
  country: t.country.id,
});
