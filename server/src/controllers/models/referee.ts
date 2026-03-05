import { referee } from "@dai0413/myorg-shared";
import { Response } from "express";
import { DecodedRequest } from "src/types.js";
import { crudFactory } from "../../utils/crudFactory.js";
import { uploadItemHandler } from "../../utils/crud/upload/handler.js";
import { RefereeModel } from "../../models/referee.js";

const getAllItems = crudFactory(referee(RefereeModel)).getAllItems;
const createItem = crudFactory(referee(RefereeModel)).createItem;
const getItem = crudFactory(referee(RefereeModel)).getItem;
const updateItem = crudFactory(referee(RefereeModel)).updateItem;
const deleteItem = crudFactory(referee(RefereeModel)).deleteItem;

const uploadItem = async (req: DecodedRequest, res: Response) =>
  uploadItemHandler(referee(RefereeModel), req, res);

export { getAllItems, createItem, getItem, updateItem, deleteItem, uploadItem };
