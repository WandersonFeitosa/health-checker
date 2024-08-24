import express from "express";
import dotenv from "dotenv";
import routes from "./routes/routes";
import mongoose from "mongoose";

dotenv.config();

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const host = process.env.HOST || "::1";
const dbUrl = process.env.DATABSE_URL as string;

const app = express();

app.use(express.json());
app.use(routes);

function startServer() {
  try {
    app.listen({
      host,
      port,
    });
  } catch (err) {
    console.error(err);
  }
  console.log(`Servidor iniciado em http://localhost:${port}`);
}

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Conectado ao banco de dados");
    startServer();
  })
  .catch((err) => {
    console.log(err);
  });
