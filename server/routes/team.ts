import express from "express";
const router = express.Router();

import {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
  downloadItem,
} from "../controllers/models/team.ts";

router.route("/").get(getAllItems).post(createItem);
router.route("/download").get(downloadItem);
router.route("/:id").patch(updateItem).delete(deleteItem).get(getItem);

export default router;
