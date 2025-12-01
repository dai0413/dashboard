import { playerRegistration } from "@dai0413/shared";
import { crudFactory } from "../../utils/crudFactory.js";
import { PlayerRegistrationModel } from "../../models/player-registration.js";

const getAllItems = crudFactory(
  playerRegistration(PlayerRegistrationModel)
).getAllItems;
const createItem = crudFactory(
  playerRegistration(PlayerRegistrationModel)
).createItem;
const getItem = crudFactory(
  playerRegistration(PlayerRegistrationModel)
).getItem;
const updateItem = crudFactory(
  playerRegistration(PlayerRegistrationModel)
).updateItem;
const deleteItem = crudFactory(
  playerRegistration(PlayerRegistrationModel)
).deleteItem;

export { getAllItems, createItem, getItem, updateItem, deleteItem };
