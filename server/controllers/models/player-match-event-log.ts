import { playerMatchEventLog } from "@dai0413/myorg-shared";
import { PlayerMatchEventLogModel } from "../../models/player-match-event-log.js";
import { Response } from "express";
import { DecodedRequest } from "types.js";
import { crudFactory } from "../../utils/crudFactory.js";
import { uploadItemHandler } from "../../utils/crud/upload/handler.js";

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

const uploadItem = async (req: DecodedRequest, res: Response) =>
  uploadItemHandler(playerMatchEventLog(PlayerMatchEventLogModel), req, res);

export { getAllItems, createItem, getItem, updateItem, deleteItem, uploadItem };
