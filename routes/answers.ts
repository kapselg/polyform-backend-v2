import express, { Request, Response } from "express";
import { getAnswersByCode, submitAnswersById } from "../controllers/answers";
import { Answer } from "../db/models/answer.model ";
import { Submission } from "../shared/results.model";

export const answersRoute = express.Router();

answersRoute.get('', async (req: Request<{}, {}, {}, {code?: string}>, res: Response) => {
  if(!req.query.code){
    res.sendStatus(400);
    return;
  }

  const result = await getAnswersByCode(req.query.code);

  if (result) {
    res.send(result);
  } else {
    res.sendStatus(404);
  }

})

answersRoute.post('', async (req: Request<{}, {}, {formId: string, answers: Submission }>, res: Response) => {
  if(!req.body.formId || !req.body.answers){
    res.sendStatus(400);
    return;
  }

  const result = await submitAnswersById(req.body.formId, req.body.answers);

  if (typeof result ===  'string') {
    res.status(400).send(result);
  } else {
    res.send(result);
  }

})
