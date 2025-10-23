import { ModelType } from "../../types/models";

import { API_ROUTES } from "../../lib/apiRoutes";
import { createModelContext } from "../../utils/createModelContext";

const ContextModelString = ModelType.TRANSFER;
const backendRoute = API_ROUTES.TRANSFER;

const { useMetaCrud: useTransfer, MetaCrudProvider: TransferProvider } =
  createModelContext(ContextModelString, backendRoute);

export { useTransfer, TransferProvider };
