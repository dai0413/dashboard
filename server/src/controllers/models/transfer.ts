import { TransferModel as Model } from "../../models/transfer.js";
import { transfer as createConfig } from "@dai0413/myorg-shared/models-config";
import { createController } from "../factories/createController.js";
import { transfer as customTransfer } from "../../utils/customMatchStage/transfer.js";

const config = createConfig(Model, customTransfer);
const { getAllItems, createItem, getItem, updateItem, deleteItem } =
  createController(config);

export { getAllItems, createItem, getItem, updateItem, deleteItem };
