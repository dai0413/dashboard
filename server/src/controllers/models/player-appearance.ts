import { playerAppearance } from "@dai0413/myorg-shared";
import { Response } from "express";
import { DecodedRequest } from "../../types.js";
import { PlayerAppearanceModel } from "../../models/player-appearance.js";
import { crudFactory } from "../../utils/crudFactory.js";
import { uploadItemHandler } from "../../utils/crud/upload/handler.js";

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

const uploadItem = async (req: DecodedRequest, res: Response) =>
  uploadItemHandler(playerAppearance(PlayerAppearanceModel), req, res);

export { getAllItems, createItem, getItem, updateItem, deleteItem, uploadItem };
