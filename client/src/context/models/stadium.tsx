import { ModelType } from "../../types/models";
import { API_ROUTES } from "../../lib/apiRoutes";
import { createModelContext } from "../../utils/createModelContext";

const ContextModelString = ModelType.STADIUM;
const backendRoute = API_ROUTES.STADIUM;

const { useMetaCrud: useStadium, MetaCrudProvider: StadiumProvider } =
  createModelContext(ContextModelString, backendRoute);

export { useStadium, StadiumProvider };
