import { statsL } from "@dai0413/myorg-shared";
import { Response } from "express";
import { DecodedRequest } from "../../types.js";
import { StatsLModel } from "../../models/stats-l.js";
import { crudFactory } from "../../utils/crudFactory.js";
import { uploadItemHandler } from "../../utils/crud/upload/handler.js";

const getAllItems = crudFactory(statsL(StatsLModel)).getAllItems;
const createItem = crudFactory(statsL(StatsLModel)).createItem;
const getItem = crudFactory(statsL(StatsLModel)).getItem;
const updateItem = crudFactory(statsL(StatsLModel)).updateItem;
const deleteItem = crudFactory(statsL(StatsLModel)).deleteItem;

const uploadItem = async (req: DecodedRequest, res: Response) =>
  uploadItemHandler(statsL(StatsLModel), req, res);

export { getAllItems, createItem, getItem, updateItem, deleteItem, uploadItem };
