import { DataTypes, Model, Sequelize } from "sequelize";
import { GeneratedID, LONG_ID, SIMPLE_ID } from "../uid/generate";

export class User extends Model<{
  id: string,
  name: string,
  email: string,
  password: string,
  url: string,
  type: 'admin' | 'user' | 'test',
  details: {}
}> {}

export function initUser(sequelize: Sequelize){
  return User.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    url: {
      type: DataTypes.STRING,
      defaultValue: new GeneratedID(SIMPLE_ID).id
    },
    //type of user
    type: {
      type: DataTypes.ENUM('admin', 'user', 'test')
    },
    //...and additional information about user (ex. language, sex)
    details: {
      type: DataTypes.JSON
    }
  }, { sequelize })
}
