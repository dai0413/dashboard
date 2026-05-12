import { playerRegistrationHistory as createConfig } from "@dai0413/myorg-shared/models-config";
import { crudFactory } from "../factories/crudFactory.js";
import { PlayerRegistrationHistoryModel as Model } from "../../models/player-registration-history.js";
import { uploadItem } from "./services/uploadItem/player-registration-history.js";

const config = createConfig(Model);
const { getAllItems, createItem, getItem, updateItem, deleteItem } =
  crudFactory(config);

export { getAllItems, createItem, getItem, updateItem, deleteItem, uploadItem };
