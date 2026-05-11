import { playerRegistration as createConfig } from "@dai0413/myorg-shared/models-config";
import { crudFactory } from "../../utils/crudFactory.js";
import { PlayerRegistrationModel as Model } from "../../models/player-registration.js";

const config = createConfig(Model);
const { getAllItems, createItem, getItem, updateItem, deleteItem } =
  crudFactory(config);

export { getAllItems, createItem, getItem, updateItem, deleteItem };
