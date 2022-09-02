import { sq } from "../app";
import { Answer } from "../db/models/answer.model ";
import { GeneratedID, LONG_ID } from "../db/uid/generate";
import { Results, Submission } from "../shared/results.model";

export async function getAnswersByCode(accessCode: string): Promise<Results | string> {
  //get form id by access code

  const formInfo = await sq.models.form
    .findOne({
      where: {
        accessCode: accessCode,
      },
    })
    .then((result) => (result ? { id: result.get().id, name: result.get().options.name } : null))
    .catch((e) => null);

  if (!formInfo) {
    return "Invalid access code";
  }

  //get all questions

  const questions = await sq.models.question
    .findAll({
      where: { form: formInfo.id },
    })
    .then((results) =>
      results.map((result) => {
        return result.getDataValue("query");
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

  const response: Results = {
    formName: formInfo.name,
    questions: questions,
    submissions: submissions,
  };

  //pack em' up and return
  return response;
}

export async function submitAnswersById(formId: string, submission: Submission): Promise<string | Submission> {
  //TODO: add answer validation
  //check if form exists
  const form = await sq.models.form.findOne({
    where: {
      id: formId,
    },
  });

  if (!form) return "No such form";

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
