import { playerAppearance } from "@dai0413/myorg-shared";
import { crudFactory } from "../../utils/crudFactory.js";
import { PlayerAppearanceModel } from "../../models/player-appearance.js";

const getAllItems = crudFactory(
  playerAppearance(PlayerAppearanceModel),
).getAllItems;
const createItem = crudFactory(
  playerAppearance(PlayerAppearanceModel),
).createItem;
const getItem = crudFactory(playerAppearance(PlayerAppearanceModel)).getItem;
const updateItem = crudFactory(
  playerAppearance(PlayerAppearanceModel),
).updateItem;
const deleteItem = crudFactory(
  playerAppearance(PlayerAppearanceModel),
).deleteItem;

export { getAllItems, createItem, getItem, updateItem, deleteItem };
