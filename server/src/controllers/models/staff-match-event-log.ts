import { staffMatchEventLog as createConfig } from "@dai0413/myorg-shared/models-config";
import { StaffMatchEventLogModel as Model } from "../../models/staff-match-event-log.js";
import { createController } from "../factories/createController.js";

const config = createConfig(Model);
const { getAllItems, createItem, getItem, updateItem, deleteItem, uploadItem } =
  createController(config);

export { getAllItems, createItem, getItem, updateItem, deleteItem, uploadItem };
