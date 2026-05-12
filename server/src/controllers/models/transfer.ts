import { TransferModel as Model } from "../../models/transfer.js";
import { transfer as createConfig } from "@dai0413/myorg-shared/models-config";
import { crudFactory } from "../factories/crudFactory.js";
import { transfer as customTransfer } from "../../utils/customMatchStage/transfer.js";

const config = createConfig(Model, customTransfer);
const { getAllItems, createItem, getItem, updateItem, deleteItem } =
  crudFactory(config);

export { getAllItems, createItem, getItem, updateItem, deleteItem };
