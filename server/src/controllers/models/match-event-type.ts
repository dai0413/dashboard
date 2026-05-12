import { matchEventType as createConfig } from "@dai0413/myorg-shared/models-config";
import { MatchEventTypeModel as Model } from "../../models/match-event-type.js";
import { crudFactory } from "../factories/crudFactory.js";

const config = createConfig(Model);
const { getAllItems, createItem, getItem, updateItem, deleteItem } =
  crudFactory(config);

export { getAllItems, createItem, getItem, updateItem, deleteItem };
