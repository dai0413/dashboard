import { formation as createConfig } from "@dai0413/myorg-shared/models-config";
import { FormationModel as Model } from "../../models/formation.js";
import { createController } from "../factories/createController.js";

const config = createConfig(Model);
const { getAllItems, createItem, getItem, updateItem, deleteItem } =
  createController(config);

export { getAllItems, createItem, getItem, updateItem, deleteItem };
