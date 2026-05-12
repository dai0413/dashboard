import { stadium as createConfig } from "@dai0413/myorg-shared/models-config";
import { createController } from "../factories/createController.js";
import { StadiumModel as Model } from "../../models/stadium.js";

const config = createConfig(Model);
const { getAllItems, createItem, getItem, updateItem, deleteItem } =
  createController(config);

export { getAllItems, createItem, getItem, updateItem, deleteItem };
