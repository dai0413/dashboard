import { playerMatchEventLog } from "@dai0413/myorg-shared";
import { crudFactory } from "../../utils/crudFactory.js";
import { PlayerMatchEventLogModel } from "../../models/player-match-event-log.js";

const getAllItems = crudFactory(
  playerMatchEventLog(PlayerMatchEventLogModel),
).getAllItems;
const createItem = crudFactory(
  playerMatchEventLog(PlayerMatchEventLogModel),
).createItem;
const getItem = crudFactory(
  playerMatchEventLog(PlayerMatchEventLogModel),
).getItem;
const updateItem = crudFactory(
  playerMatchEventLog(PlayerMatchEventLogModel),
).updateItem;
const deleteItem = crudFactory(
  playerMatchEventLog(PlayerMatchEventLogModel),
).deleteItem;

export { getAllItems, createItem, getItem, updateItem, deleteItem };
