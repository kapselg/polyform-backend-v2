import express from "express";
import dotenv from 'dotenv';
import { connect } from "./db";
import { router } from "./routes";
import cors from 'cors';
import { env } from "./env";

const app = express();

dotenv.config();

app.use(cors());

app.use(express.json());

//SeQualize instance
console.log('off');

export const sq = connect();

app.use(router);

app.listen(env.PORT, () => {
  console.log(
    'Listening on ' + process.env.PORT
  );
})