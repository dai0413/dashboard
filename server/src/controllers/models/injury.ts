import { injury as createConfig } from "@dai0413/myorg-shared/models-config";
import { InjuryModel as Model } from "../../models/injury.js";
import { crudFactory } from "../../utils/crudFactory.js";

const config = createConfig(Model);
const { getAllItems, createItem, getItem, updateItem, deleteItem } =
  crudFactory(config);

export { getAllItems, createItem, getItem, updateItem, deleteItem };
