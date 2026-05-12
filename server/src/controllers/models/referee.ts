import { referee as createConfig } from "@dai0413/myorg-shared/models-config";
import { createController } from "../factories/createController.js";
import { RefereeModel as Model } from "../../models/referee.js";

const config = createConfig(Model);
const { getAllItems, createItem, getItem, updateItem, deleteItem, uploadItem } =
  createController(config);

export { getAllItems, createItem, getItem, updateItem, deleteItem, uploadItem };
