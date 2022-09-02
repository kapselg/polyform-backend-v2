import { DataTypes, Model, Sequelize } from "sequelize";

interface Options {
  [key: string]: any;
  name: string;
}

export class Form extends Model<{
  id: string;
  url: string;
  user: string;
  accessCode: string;
  options: Options;
}> {}

export function initForm(sequelize: Sequelize){
  return Form.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    url: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    accessCode: {
      type: DataTypes.STRING
    },
    user: {
      type: DataTypes.STRING,
    },
    options: {
      type: DataTypes.JSON
    }
  }, { sequelize })
}
