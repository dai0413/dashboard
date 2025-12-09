import { formation } from "@dai0413/myorg-shared";
import { crudFactory } from "../../utils/crudFactory.js";
import { FormationModel } from "../../models/formation.js";

const getAllItems = crudFactory(formation(FormationModel)).getAllItems;
const createItem = crudFactory(formation(FormationModel)).createItem;
const getItem = crudFactory(formation(FormationModel)).getItem;
const updateItem = crudFactory(formation(FormationModel)).updateItem;
const deleteItem = crudFactory(formation(FormationModel)).deleteItem;

export { getAllItems, createItem, getItem, updateItem, deleteItem };
