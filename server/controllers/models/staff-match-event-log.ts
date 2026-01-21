import { staffMatchEventLog } from "@dai0413/myorg-shared";
import { crudFactory } from "../../utils/crudFactory.js";
import { StaffMatchEventLogModel } from "../../models/staff-match-event-log.js";

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

export { getAllItems, createItem, getItem, updateItem, deleteItem };
