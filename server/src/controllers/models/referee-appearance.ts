import { refereeAppearance } from "@dai0413/myorg-shared";
import { Response } from "express";
import { DecodedRequest } from "../../types.js";
import { crudFactory } from "../../utils/crudFactory.js";
import { RefereeAppearanceModel } from "../../models/referee-appearance.js";
import { uploadItemHandler } from "../../utils/crud/upload/handler.js";

const getAllItems = crudFactory(
  refereeAppearance(RefereeAppearanceModel),
).getAllItems;
const createItem = crudFactory(
  refereeAppearance(RefereeAppearanceModel),
).createItem;
const getItem = crudFactory(refereeAppearance(RefereeAppearanceModel)).getItem;
const updateItem = crudFactory(
  refereeAppearance(RefereeAppearanceModel),
).updateItem;
const deleteItem = crudFactory(
  refereeAppearance(RefereeAppearanceModel),
).deleteItem;

const uploadItem = async (req: DecodedRequest, res: Response) =>
  uploadItemHandler(refereeAppearance(RefereeAppearanceModel), req, res);

export { getAllItems, createItem, getItem, updateItem, deleteItem, uploadItem };
