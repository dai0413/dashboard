import { nationalCallUp as createConfig } from "@dai0413/myorg-shared/models-config";
import { NationalCallUpModel as Model } from "../../models/national-callup.js";
import { crudFactory } from "../factories/crudFactory.js";

const config = createConfig(Model);
const { getAllItems, createItem, getItem, updateItem, deleteItem } =
  crudFactory(config);

export { getAllItems, createItem, getItem, updateItem, deleteItem };
