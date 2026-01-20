import { staffAppearance } from "@dai0413/myorg-shared";
import { crudFactory } from "../../utils/crudFactory.js";
import { StaffAppearanceModel } from "../../models/staff-appearance.js";

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

export { getAllItems, createItem, getItem, updateItem, deleteItem };
