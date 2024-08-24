import { mongooseService } from "../mongoose/mongoose.service";
import axios from "axios";

export class HealthService {
  async healthCheck(): Promise<any> {
    try {
      const apis = await mongooseService.APIs.find();

      let apiResults: {
        api: any;
        status: boolean;
      }[] = [];

      for (const api of apis) {
        try {
          await axios.get(`${api.url}${api.healthRoute}`);

          if (api.failChecks) {
            api.failChecks = 0;
            await api.save();
          }

          apiResults.push({ api, status: true });
        } catch (error: any) {
          console.error(`Error checking API ${api.url}: ${error.message}`);
          apiResults.push({ api, status: false });
        }
      }

      const failedAPIs = apiResults.filter((api) => !api.status);

      if (failedAPIs.length > 0) {
        for (const failedAPI of failedAPIs) {
          const api = apis.find((api) => api.url === failedAPI.api.url);
          if (api) {
            api.failChecks = api.failChecks ? api.failChecks + 1 : 1;
            await api.save();
          }
        }
      }

      return apiResults;
    } catch (error: any) {
      console.error(error);
      return { error: error.message };
    }
  }

  async registerAPI(api: any): Promise<any> {
    try {
      const { url, healthRoute, emails, phoneNumbers, name } = api;

      if (!url || !healthRoute || !emails || !phoneNumbers || !name) {
        throw new Error("Invalid API data");
      }

      if (!Array.isArray(emails) || !Array.isArray(phoneNumbers)) {
        throw new Error("Invalid emails or phoneNumbers");
      }

      for (const email of emails) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email) || email.length > 320 || email.length < 5) {
          throw new Error(`Invalid email: ${email}`);
        }
      }

      for (const phoneNumber of phoneNumbers) {
        if (typeof phoneNumber !== "number") {
          throw new Error(`Phone number must be a number: ${phoneNumber}`);
        }
        if (phoneNumber.toString().length !== 13) {
          throw new Error(`Invalid phone number: ${phoneNumber}`);
        }
      }

      const existingAPI = await mongooseService.APIs.findOne({ url });

      if (existingAPI) {
        throw new Error("API already exists");
      }

      const newAPI = new mongooseService.APIs({
        url,
        healthRoute,
        emails,
        phoneNumbers,
        name,
      });

      await newAPI.save();

      return newAPI;
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  }
}
