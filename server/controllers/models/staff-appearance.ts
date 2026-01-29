import { staffAppearance } from "@dai0413/myorg-shared";
import { Response } from "express";
import { DecodedRequest } from "types.js";
import { crudFactory } from "../../utils/crudFactory.js";
import { StaffAppearanceModel } from "../../models/staff-appearance.js";
import { uploadItemHandler } from "../../utils/crud/upload/handler.js";

const getAllItems = crudFactory(
  staffAppearance(StaffAppearanceModel),
).getAllItems;
const createItem = crudFactory(
  staffAppearance(StaffAppearanceModel),
).createItem;
const getItem = crudFactory(staffAppearance(StaffAppearanceModel)).getItem;
const updateItem = crudFactory(
  staffAppearance(StaffAppearanceModel),
).updateItem;
const deleteItem = crudFactory(
  staffAppearance(StaffAppearanceModel),
).deleteItem;

const uploadItem = async (req: DecodedRequest, res: Response) =>
  uploadItemHandler(staffAppearance(StaffAppearanceModel), req, res);

export { getAllItems, createItem, getItem, updateItem, deleteItem, uploadItem };
