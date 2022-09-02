import { Op } from "sequelize";
import { sq } from "../app";
import { GeneratedID, LONG_ID, SIMPLE_ID } from "../db/uid/generate";
import QuestionModel from "../shared/question.model";

export async function getFormById(formId: string) {
  //get form information
  let form = await sq.models.form.findOne({
    where: {
      url: formId,
    },
  });

  if (!form) {
    //no such form
    return "No such form";
  }

  const formValues = form.get();

  const questions = await sq.models.question.findAll({
    where: {
      form: formValues.id,
    },
  });

  if (questions.length == 0) {
    //no questions for the form
    //log the incident (db error)
    await sq.models.incident.create({
      action: "insert",
      desc: `Failed to get questions for registered form of id ${formId}`,
      fatal: false,
      id: new GeneratedID(LONG_ID).id,
    });
    return "The form of ID provided does not have any questions!";
  }

  const questionsArray: QuestionModel[] = [];

  for (const question of questions) {
    const questionValue = question.get();

    questionsArray[questionValue.options.index] = new QuestionModel(questionValue.details, questionValue.query, questionValue.id, questionValue.options, questionValue.type);
  }

  return {
    form: formValues,
    questions: [...questionsArray],
  };
}

export async function createNewForm(questions: QuestionModel[], formData: { username: string; options: {} }) {
  //todo: add new form validation
  const t = await sq.sequelize.transaction();
  const formId = new GeneratedID(LONG_ID).id;
  const formUrl = new GeneratedID(SIMPLE_ID).id;
  const accessCode = new GeneratedID(SIMPLE_ID).id;
  try {
    //create form entry
    await sq.models.form.findOrCreate({
      where: {
        user: formData.username,
        options: formData.options,
        accessCode: accessCode,
        id: formId,
        url: formUrl,
      },
      transaction: t,
    });

    //create question entry|ies
    for (const [index, question] of questions.entries()) {
      await sq.models.question.create(
        {
          form: formId,
          type: question.answerType,
          details: question.type,
          query: question.query,
          options: {
            ...question.options,
            index: index,
          },
          id: new GeneratedID(LONG_ID).id,
        },
        {
          transaction: t,
        }
      );
    }
  } catch (e: any) {
    //avoid inserting invalid data with the use of transaction rollback
    console.log(e);
    t.rollback();
    return;
  }

  //commit changes
  await t.commit();

  return { formId: formId, formUrl: formUrl, accessCode: accessCode };
}
