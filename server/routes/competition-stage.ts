import express from "express";
const router = express.Router();

import {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
} from "../controllers/models/competition-stage.js";

router.route("/").get(getAllItems).post(createItem);
router.route("/:id").patch(updateItem).delete(deleteItem).get(getItem);

export default router;
