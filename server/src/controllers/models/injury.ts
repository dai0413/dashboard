import { injury as createConfig } from "@dai0413/myorg-shared/models-config";
import { InjuryModel as Model } from "../../models/injury.js";
import { createController } from "../factories/createController.js";

const config = createConfig(Model);
const { getAllItems, createItem, getItem, updateItem, deleteItem } =
  createController(config);

export { getAllItems, createItem, getItem, updateItem, deleteItem };
