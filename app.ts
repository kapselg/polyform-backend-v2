import express from "express";
import dotenv from 'dotenv';
import { connect } from "./db";
import { router } from "./routes";
import cors from 'cors';

const app = express();

dotenv.config();

app.use(cors())

app.use(express.json());

//SeQualize instance

export const sq = connect();

app.use(router);

app.listen(process.env.PORT, () => {
  console.log(
    'Listening on ' + process.env.PORT
  );
})