import { DataTypes, Model, Sequelize } from "sequelize";
import { GeneratedID, LONG_ID } from "../uid/generate";

export class Incident extends Model<{
  id: string,
  action: 'insert' | 'select' | 'delete' | 'update' | 'other',
  desc: string,
  fatal: boolean
}>{}

export function initIncident(sequelizeInstance: Sequelize){
  return Incident.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    action: {
      type: DataTypes.ENUM('insert',  'select',  'delete',  'update', 'other',)
    },
    desc: {
      type: DataTypes.STRING
    },
    fatal: {
      type: DataTypes.BOOLEAN
    },
  }, {sequelize: sequelizeInstance})
}