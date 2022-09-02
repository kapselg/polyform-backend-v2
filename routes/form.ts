import express, { NextFunction, Request, Response } from "express";
import { getFormById, createNewForm } from "../controllers/form";
import { GeneratedID, SIMPLE_ID } from "../db/uid/generate";
import QuestionModel from "../shared/question.model";

export const formRoute = express.Router();

//REQ: ID or a URL of a form
//RES: a form
formRoute.get("/", async (req: Request<{}, {}, {}, { id?: string }>, res: Response, next: NextFunction) => {
  if (!req.query.id) {
    res.sendStatus(400);
    return;
  }
  const result = await getFormById(req.query.id);

  if (result) {
    res.send(result);
  } else {
    res.sendStatus(404);
  }
});

formRoute.put(
  "/",
  async (
    req: Request<
      {},
      {},
      {
        questions: QuestionModel[];
        formData: {
          username: string;
          options: {};
        };
      },
      {}
    >,
    res: Response,
    next: NextFunction
  ) => {
    console.log('hello');
    
    const result = await createNewForm(req.body.questions, 
      { 
        ...req.body.formData,
      });
    
    if (result) {
      
      
      res.send(result);
    } else {
      res.sendStatus(500);
    }
  }
);
