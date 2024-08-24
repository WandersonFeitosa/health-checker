import mongoose from "mongoose";

export class MongooseService {
  private apiSchema = new mongoose.Schema({
    url: String,
    healthRoute: String,
    emails: [String],
    phoneNumbers: [Number],
    name: String,
    failChecks: Number,
  });

  public APIs = mongoose.model("APIs", this.apiSchema);
}

export const mongooseService = new MongooseService();
