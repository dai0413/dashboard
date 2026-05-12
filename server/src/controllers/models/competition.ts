import { competition as createConfig } from "@dai0413/myorg-shared/models-config";
import { CompetitionModel as Model } from "../../models/competition.js";
import { crudFactory } from "../factories/crudFactory.js";

const config = createConfig(Model);
const { getAllItems, createItem, getItem, updateItem, deleteItem } =
  crudFactory(config);

export { getAllItems, createItem, getItem, updateItem, deleteItem };
