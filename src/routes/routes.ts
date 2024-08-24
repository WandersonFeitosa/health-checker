import { Router } from "express";
import cors from "cors";
import schedule from "node-schedule";
import { appController } from "../modules/app/app.controller";
import { healthController } from "../modules/health/health.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const routes = Router();

routes.use(cors());

routes.get("/", (req, res) => appController.healthCheck(req, res));

routes.use(authMiddleware);

routes.get(
  "/health",
  async (req, res) => await healthController.healthCheck(req, res)
);
routes.post(
  "/api",
  async (req, res) => await healthController.registerAPI(req, res)
);

schedule.scheduleJob("*/1 * * * *", async () => {
  console.log("Running schedule every minute");
  await healthController.health();
});

export default routes;
