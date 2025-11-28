import { playerRegistrationHistory } from "@myorg/shared";
import { crudFactory } from "../../utils/crudFactory.js";
import { PlayerRegistrationHistoryModel } from "../../models/player-registration-history.js";

const getAllItems = crudFactory(
  playerRegistrationHistory(PlayerRegistrationHistoryModel)
).getAllItems;
const createItem = crudFactory(
  playerRegistrationHistory(PlayerRegistrationHistoryModel)
).createItem;
const getItem = crudFactory(
  playerRegistrationHistory(PlayerRegistrationHistoryModel)
).getItem;
const updateItem = crudFactory(
  playerRegistrationHistory(PlayerRegistrationHistoryModel)
).updateItem;
const deleteItem = crudFactory(
  playerRegistrationHistory(PlayerRegistrationHistoryModel)
).deleteItem;

export { getAllItems, createItem, getItem, updateItem, deleteItem };
