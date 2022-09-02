import { DataTypes, Model, Sequelize } from "sequelize";
import { GeneratedID, LONG_ID } from "../uid/generate";

export class Answer extends Model<{
  id: string,
  formId: string,
  answers: (string | string[])[],
  options: {},
  addedOn: Date
}> {}

export function initAnswer(sequelize: Sequelize){
  return Answer.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    //id of parent form
    formId: {
      type: DataTypes.STRING
    },
    //answer data
    answers: {
      type: DataTypes.JSON
    },
    //additional options (ex. is the answer a default value)
    options: {
      type: DataTypes.JSON
    },
    //submission date
    addedOn: {
      type: DataTypes.DATE,
    }
  }, { sequelize })
}
