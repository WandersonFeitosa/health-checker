import { HealthService } from "./health.service";
import { Request, Response } from "express";

export class HealthController {
  constructor(private healthService: HealthService) {
    this.healthService = new HealthService();
  }
  async healthCheck(req: Request, res: Response) {
    const result = await this.health();
    return res.send(result);
  }

  async health() {
    const result = await this.healthService.healthCheck();
    return result;
  }

  async registerAPI(req: Request, res: Response) {
    try {
      const result = await this.healthService.registerAPI(req.body);
      return res.send(result);
    } catch (error: any) {
      console.log(error);
      return res.status(400).send({
        message: error.message,
      });
    }
  }
}

export const healthController = new HealthController(new HealthService());
