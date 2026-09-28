import { Router, type IRouter } from "express";
import healthRouter from "./health";
import hirelensRouter from "./hirelens";

const router: IRouter = Router();

router.use(healthRouter);
router.use(hirelensRouter);

export default router;
