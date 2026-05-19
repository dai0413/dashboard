import { TransferModel as Model } from "../../models/transfer.js";
import { transfer as createConfig } from "@dai0413/myorg-shared/models-config";
import { createController } from "../factories/createController.js";
import { transfer } from "../helpers/crud/query/customMatchStage/transfer.js";

const config = createConfig(Model, transfer);
const {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
  updateItems,
} = createController(config);

export {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
  updateItems,
};
