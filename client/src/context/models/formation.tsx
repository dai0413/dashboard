import { ModelType } from "../../types/models";

import { API_PATHS } from "@dai0413/myorg-shared";
import { createModelContext } from "../../utils/createModelContext";

const ContextModelString = ModelType.FORMATION;
const backendRoute = API_PATHS.FORMATION;

const { useMetaCrud: useFormation, MetaCrudProvider: FormationProvider } =
  createModelContext(ContextModelString, backendRoute);

export { useFormation, FormationProvider };
