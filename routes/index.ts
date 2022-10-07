import express from "express";
import { sq } from "../app";
import { answersRoute } from "./answers";
import { formRoute } from "./form";

export const router = express.Router();

router.use('/answers', answersRoute);
router.use('/form', formRoute);
router.get('/', async (req, res) => {
  res.status(200).send('id: 01BB43<br>access: B3JV88');

})