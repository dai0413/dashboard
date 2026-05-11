import { season as createConfig } from "@dai0413/myorg-shared/models-config";
import { crudFactory } from "../../utils/crudFactory.js";
import { SeasonModel as Model } from "../../models/season.js";

const config = createConfig(Model);
const { getAllItems, createItem, getItem, updateItem, deleteItem } =
  crudFactory(config);

export { getAllItems, createItem, getItem, updateItem, deleteItem };
