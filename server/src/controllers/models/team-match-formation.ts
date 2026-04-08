import { teamMatchFormation } from "@dai0413/myorg-shared";
import { Response } from "express";
import { DecodedRequest } from "../../types.js";
import { TeamMatchFormationModel } from "../../models/team-match-formation.js";
import { crudFactory } from "../../utils/crudFactory.js";
import { uploadItemHandler } from "../../utils/crud/upload/handler.js";

const getAllItems = crudFactory(
  teamMatchFormation(TeamMatchFormationModel),
).getAllItems;
const createItem = crudFactory(
  teamMatchFormation(TeamMatchFormationModel),
).createItem;
const getItem = crudFactory(
  teamMatchFormation(TeamMatchFormationModel),
).getItem;
const updateItem = crudFactory(
  teamMatchFormation(TeamMatchFormationModel),
).updateItem;
const deleteItem = crudFactory(
  teamMatchFormation(TeamMatchFormationModel),
).deleteItem;

const uploadItem = async (req: DecodedRequest, res: Response) =>
  uploadItemHandler(teamMatchFormation(TeamMatchFormationModel), req, res);

export { getAllItems, createItem, getItem, updateItem, deleteItem, uploadItem };
