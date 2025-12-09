import { Formation, FormationGet } from "../../../types/models/formation";

export const formation = (t: Formation): FormationGet => ({
  ...t,
});
