import { staffRegistrationHistory as createConfig } from "@dai0413/myorg-shared/models-config";
import { StaffRegistrationHistoryModel as Model } from "../../models/staff-registration-history.js";
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
  deleteItems,
} = createController(config);

export {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
  uploadItem,
  updateItems,
  deleteItems,
};
