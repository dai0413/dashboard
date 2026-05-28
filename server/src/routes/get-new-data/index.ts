import express from "express";

import dPcRouter from "./d_pc.js";
import dScRouter from "./d_sc.js";
import dMRouter from "./d_m.js";
import dMlRouter from "./d_ml.js";
import jMRouter from "./j_m.js";
import lMRouter from "./l_m.js";
import snMRouter from "./sn_m.js";

const router = express.Router();

router.use(dPcRouter);
router.use(dScRouter);
router.use(dMRouter);
router.use(dMlRouter);
router.use(jMRouter);
router.use(lMRouter);
router.use(snMRouter);

export default router;
