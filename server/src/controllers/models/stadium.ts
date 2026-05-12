import { stadium as createConfig } from "@dai0413/myorg-shared/models-config";
import { crudFactory } from "../factories/crudFactory.js";
import { StadiumModel as Model } from "../../models/stadium.js";

const config = createConfig(Model);
const { getAllItems, createItem, getItem, updateItem, deleteItem } =
  crudFactory(config);

export { getAllItems, createItem, getItem, updateItem, deleteItem };
