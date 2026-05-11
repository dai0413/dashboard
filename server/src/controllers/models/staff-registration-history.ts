import { Response } from "express";
import { DecodedRequest } from "../../types.js";
import { staffRegistrationHistory as createConfig } from "@dai0413/myorg-shared/models-config";
import { crudFactory } from "../../utils/crudFactory.js";
import { StaffRegistrationHistoryModel as Model } from "../../models/staff-registration-history.js";
import { uploadItemHandler } from "../../utils/crud/upload/handler.js";

const config = createConfig(Model);
const { getAllItems, createItem, getItem, updateItem, deleteItem } =
  crudFactory(config);

const uploadItem = async (req: DecodedRequest, res: Response) =>
  uploadItemHandler(config, req, res);

export { getAllItems, createItem, getItem, updateItem, deleteItem, uploadItem };
