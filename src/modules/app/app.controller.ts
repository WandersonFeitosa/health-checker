import { Request, Response } from "express";
import { AppService } from "./app.service";

export class AppController {
  constructor(private healthService: AppService) {
    this.healthService = new AppService();
  }
  async healthCheck(req: Request, res: Response) {
    const result = await this.healthService.healthCheck();
    return res.send(result);
  }
}

export const appController = new AppController(new AppService());
