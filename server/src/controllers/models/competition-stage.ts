import { competitionStage as createConfig } from "@dai0413/myorg-shared/models-config";
import { CompetitionStageModel as Model } from "../../models/competition-stage.js";
import { createController } from "../factories/createController.js";

const config = createConfig(Model);
const {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
  updateItems,
  deleteItems,
} = createController(config);

export {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
  updateItems,
  deleteItems,
};
