import { teamMatchFormation } from "@dai0413/myorg-shared";
import { crudFactory } from "../../utils/crudFactory.js";
import { TeamMatchFormationModel } from "../../models/team-match-formation.js";

const getAllItems = crudFactory(
  teamMatchFormation(TeamMatchFormationModel),
).getAllItems;
const createItem = crudFactory(
  teamMatchFormation(TeamMatchFormationModel),
).createItem;
const getItem = crudFactory(
  teamMatchFormation(TeamMatchFormationModel),
).getItem;
const updateItem = crudFactory(
  teamMatchFormation(TeamMatchFormationModel),
).updateItem;
const deleteItem = crudFactory(
  teamMatchFormation(TeamMatchFormationModel),
).deleteItem;

export { getAllItems, createItem, getItem, updateItem, deleteItem };
