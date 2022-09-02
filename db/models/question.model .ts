import { DataTypes, Model, Sequelize } from "sequelize";
import { QuestionOptions } from "../../shared/question.model";
import { GeneratedID, LONG_ID } from "../uid/generate";

export class Question extends Model<{
  id: string,
  query: string,
  form: string,
  type: string,
  details: {},
  options: QuestionOptions,
}> {}

export function initQuestion(sequelize: Sequelize){
  return Question.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    //actual question
    query: {
      type: DataTypes.STRING,
    },
    //id of parent form
    form: {
      type: DataTypes.STRING
    },
    //type of expected answer...
    type: {
      type: DataTypes.STRING
    },
    //...and additional information about it, specific to the type (ex. length for text, max for number)
    details: {
      type: DataTypes.JSON
    },
    //universal question options (ex. required)
    options: {
      type: DataTypes.JSON
    }
  }, { sequelize })
}
