import { staffMatchEventLog } from "@dai0413/myorg-shared";
import { Response } from "express";
import { DecodedRequest } from "src/types.js";
import { StaffMatchEventLogModel } from "../../models/staff-match-event-log.js";
import { crudFactory } from "../../utils/crudFactory.js";
import { uploadItemHandler } from "../../utils/crud/upload/handler.js";

const getAllItems = crudFactory(
  staffMatchEventLog(StaffMatchEventLogModel),
).getAllItems;
const createItem = crudFactory(
  staffMatchEventLog(StaffMatchEventLogModel),
).createItem;
const getItem = crudFactory(
  staffMatchEventLog(StaffMatchEventLogModel),
).getItem;
const updateItem = crudFactory(
  staffMatchEventLog(StaffMatchEventLogModel),
).updateItem;
const deleteItem = crudFactory(
  staffMatchEventLog(StaffMatchEventLogModel),
).deleteItem;

const uploadItem = async (req: DecodedRequest, res: Response) =>
  uploadItemHandler(staffMatchEventLog(StaffMatchEventLogModel), req, res);

export { getAllItems, createItem, getItem, updateItem, deleteItem, uploadItem };
