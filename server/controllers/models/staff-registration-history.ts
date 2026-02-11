import { Response } from "express";
import { DecodedRequest } from "types.js";
import { staffRegistrationHistory } from "@dai0413/myorg-shared";
import { crudFactory } from "../../utils/crudFactory.js";
import { StaffRegistrationHistoryModel } from "../../models/staff-registration-history.js";
import { uploadItemHandler } from "../../utils/crud/upload/handler.js";

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

const uploadItem = async (req: DecodedRequest, res: Response) =>
  uploadItemHandler(
    staffRegistrationHistory(StaffRegistrationHistoryModel),
    req,
    res,
  );

export { getAllItems, createItem, getItem, updateItem, deleteItem, uploadItem };
