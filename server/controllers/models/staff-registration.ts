import { staffRegistration } from "@dai0413/myorg-shared";
import { crudFactory } from "../../utils/crudFactory.js";
import { StaffRegistrationModel } from "../../models/staff-registration.js";

const getAllItems = crudFactory(
  staffRegistration(StaffRegistrationModel),
).getAllItems;
const createItem = crudFactory(
  staffRegistration(StaffRegistrationModel),
).createItem;
const getItem = crudFactory(staffRegistration(StaffRegistrationModel)).getItem;
const updateItem = crudFactory(
  staffRegistration(StaffRegistrationModel),
).updateItem;
const deleteItem = crudFactory(
  staffRegistration(StaffRegistrationModel),
).deleteItem;

export { getAllItems, createItem, getItem, updateItem, deleteItem };
