import { staffRegistrationHistory } from "@dai0413/myorg-shared";
import { crudFactory } from "../../utils/crudFactory.js";
import { StaffRegistrationHistoryModel } from "../../models/staff-registration-history.js";
import { uploadItem } from "./services/uploadItem/staff-registration-history.js";

const getAllItems = crudFactory(
  staffRegistrationHistory(StaffRegistrationHistoryModel),
).getAllItems;
const createItem = crudFactory(
  staffRegistrationHistory(StaffRegistrationHistoryModel),
).createItem;
const getItem = crudFactory(
  staffRegistrationHistory(StaffRegistrationHistoryModel),
).getItem;
const updateItem = crudFactory(
  staffRegistrationHistory(StaffRegistrationHistoryModel),
).updateItem;
const deleteItem = crudFactory(
  staffRegistrationHistory(StaffRegistrationHistoryModel),
).deleteItem;

export { getAllItems, createItem, getItem, updateItem, deleteItem, uploadItem };
