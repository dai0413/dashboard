import { matchFormat as createConfig } from "@dai0413/myorg-shared/models-config";
import { MatchFormatModel as Model } from "../../models/match-format.js";
import { crudFactory } from "../../utils/crudFactory.js";

const config = createConfig(Model);
const { getAllItems, createItem, getItem, updateItem, deleteItem } =
  crudFactory(config);

export { getAllItems, createItem, getItem, updateItem, deleteItem };
