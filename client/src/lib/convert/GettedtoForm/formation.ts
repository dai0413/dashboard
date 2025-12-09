import { FormationForm, FormationGet } from "../../../types/models/formation";

export const formation = (t: FormationGet): FormationForm => {
  return {
    ...t,
  };
};
