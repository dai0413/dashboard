import { playerRegistration as createConfig } from "@dai0413/myorg-shared/models-config";
import { createController } from "../factories/createController.js";
import { PlayerRegistrationModel as Model } from "../../models/player-registration.js";

const config = createConfig(Model);
const { getAllItems, createItem, getItem, updateItem, deleteItem } =
  createController(config);

export { getAllItems, createItem, getItem, updateItem, deleteItem };
