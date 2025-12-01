import { ModelType } from "../../types/models";
import { API_PATHS } from ""@dai0413/myorg-shared";
import { createModelContext } from "../../utils/createModelContext";

const ContextModelString = ModelType.STADIUM;
const backendRoute = API_PATHS.STADIUM;

const { useMetaCrud: useStadium, MetaCrudProvider: StadiumProvider } =
  createModelContext(ContextModelString, backendRoute);

export { useStadium, StadiumProvider };
