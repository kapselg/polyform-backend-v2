import { Sequelize } from "sequelize";
import { Answer, initAnswer } from "./models/answer.model ";
import { Form, initForm as initForm } from "./models/form.model";
import { Incident, initIncident } from "./models/incidents.model";
import { initQuestion, Question } from "./models/question.model ";
import { initUser, User } from "./models/user.model";

const sequelize = new Sequelize("sqlite::memory", {
  storage: "./mysqli.storage",
  logging: true
});


export function connect() {
  let models = {
    answer: Answer,
    form: Form,
    user: User,
    question: Question,
    incident: Incident
  };
  //init models
  models.form = initForm(sequelize);
  models.user = initUser(sequelize);
  models.question = initQuestion(sequelize);
  models.answer = initAnswer(sequelize);
  models.incident = initIncident(sequelize);

  //force: true IS FOR DEVELOPMENT ONLY!!!
  //TODO: Remove force: true for prod
  // sequelize.sync({ force: true });

  // sequelize.sync({ });

  return {sequelize, models};
}
