import { sq } from "../app";
import { Answer } from "../db/models/answer.model ";
import { GeneratedID, LONG_ID } from "../db/uid/generate";
import QuestionModel from "../shared/question.model";
import { Results, Submission } from "../shared/results.model";
import { z } from 'zod';

export async function getAnswersByCode(accessCode: string): Promise<Results | string> {
  
  //get form id by access code
  const formInfo = await sq.models.form
    .findOne({
      where: {
        accessCode: accessCode,
      },
    })
    //pipe to null if there are no results
    .then((result) => (result ? { id: result.get().id, name: result.get().options.name } : null))
    .catch((e) => null);

  if (!formInfo) {
    return "Invalid access code";
  }

  //get all questions

  const questions: QuestionModel[] = await sq.models.question
    .findAll({
      where: { form: formInfo.id },
    })
    .then((results) =>
    //map results to QuestionModel array
      results.map((result) => {
        const data = result.get()
        return {
          type: data.type,
          query: data.query,
          id: data.id,
          options: data.options,
          answerType: data.type
        }
      })
    );

  if (!formInfo) {
    return "Form does not have questions";
  }
  //get all answers by access code

  const submissions: Submission[] = await sq.models.answer
    .findAll({
      where: { formId: formInfo.id },
    })
    .then((answers) =>
      answers.map((answer) => {
        const answerArray = answer.get().answers;
        return { submitDate: answer.getDataValue("addedOn"), answers: answerArray };
      })
    );

  //pack results
  const response: Results = {
    formName: formInfo.name,
    questions: questions,
    submissions: submissions,
  };

  //pack em' up and return
  return response;
}
/**
 * 
 * @param formId id of the form
 * @param submission answers
 * @returns 
 */
export async function submitAnswersById(formId: string, submission: Submission): Promise<string | Submission> {
  //check if form exists
  const form = await sq.models.form.findOne({
    where: {
      id: formId,
    },
  });

  if (!form) return "No such form";
  
  //get questions by formid
  const questions = await sq.models.question.findAll({
    where: {
      form: formId,
    }
  });

  //sort by index
  questions.sort((a, b)=>{
    if(a.getDataValue('options').index < b.getDataValue('options').index){
      return 1;
    }
    return -1;
  })

  //validate here


  //insert submissions
  const t = await sq.sequelize.transaction();
  const results = await sq.models.answer
    .create({
      id: new GeneratedID(LONG_ID).id,
      answers: submission.answers,
      formId: formId,
      options: {},
      addedOn: new Date(),
    }, {transaction: t})
    .then((answer) => ({
      submitDate: answer.getDataValue("addedOn"),
      answers: answer.getDataValue("answers"),
    }));

  await t.commit();

  //return the submission
  return results;
}
