import { ModelType } from "../../types/models";

import { createModelContext } from "../../utils/createModelContext";
import { API_PATHS } from "@myorg/shared";

const ContextModelString = ModelType.INJURY;
const backendRoute = API_PATHS.INJURY;

const { useMetaCrud: useInjury, MetaCrudProvider: InjuryProvider } =
  createModelContext(ContextModelString, backendRoute);

export { useInjury, InjuryProvider };
