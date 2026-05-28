import express from "express";
const router = express.Router();

import { API_PATHS } from "@dai0413/myorg-shared";
import {
  getStaffs,
  getStaffRegistrationHistories,
} from "../../controllers/get-new-data/d_sc/index.js";

router.route(API_PATHS.GET_NEW_DATA.D_SC.STAFF).get(getStaffs);
router
  .route(API_PATHS.GET_NEW_DATA.D_SC.STAFF_REGISTRATION_HISTORY)
  .get(getStaffRegistrationHistories);

export default router;
