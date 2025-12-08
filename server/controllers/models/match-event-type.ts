import { matchEventType } from "@dai0413/myorg-shared";
import { crudFactory } from "../../utils/crudFactory.js";
import { MatchEventTypeModel } from "../../models/match-event-type.js";

const getAllItems = crudFactory(
  matchEventType(MatchEventTypeModel)
).getAllItems;
const createItem = crudFactory(matchEventType(MatchEventTypeModel)).createItem;
const getItem = crudFactory(matchEventType(MatchEventTypeModel)).getItem;
const updateItem = crudFactory(matchEventType(MatchEventTypeModel)).updateItem;
const deleteItem = crudFactory(matchEventType(MatchEventTypeModel)).deleteItem;

export { getAllItems, createItem, getItem, updateItem, deleteItem };
