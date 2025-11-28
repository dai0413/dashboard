import { ModelType } from "../../types/models";

import { API_PATHS } from "@myorg/shared";
import { createModelContext } from "../../utils/createModelContext";

const ContextModelString = ModelType.TRANSFER;
const backendRoute = API_PATHS.TRANSFER;

const { useMetaCrud: useTransfer, MetaCrudProvider: TransferProvider } =
  createModelContext(ContextModelString, backendRoute);

export { useTransfer, TransferProvider };
