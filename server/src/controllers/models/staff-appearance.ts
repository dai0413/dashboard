import { staffAppearance as createConfig } from "@dai0413/myorg-shared/models-config";
import { StaffAppearanceModel as Model } from "../../models/staff-appearance.js";
import { createController } from "../factories/createController.js";

const config = createConfig(Model);
const {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
  uploadItem,
  updateItems,
} = createController(config);

export {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
  uploadItem,
  updateItems,
};
