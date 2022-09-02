import express from "express";
import { answersRoute } from "./answers";
import { formRoute } from "./form";

export const router = express.Router();

router.use('/answers', answersRoute);
router.use('/form', formRoute);