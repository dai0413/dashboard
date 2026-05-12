import { refereeAppearance as createConfig } from "@dai0413/myorg-shared/models-config";
import { RefereeAppearanceModel as Model } from "../../models/referee-appearance.js";
import { createController } from "../factories/createController.js";

const config = createConfig(Model);
const { getAllItems, createItem, getItem, updateItem, deleteItem, uploadItem } =
  createController(config);

export { getAllItems, createItem, getItem, updateItem, deleteItem, uploadItem };
