/* eslint camelcase: off */
import { Model, DataTypes } from 'sequelize';
import { db } from '../config/database';

export class LogLevels extends Model {
    public id_log_level!: number;
    public str_name!: string;
}

LogLevels.init({
  id_log_level: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  str_name: {
    type: DataTypes.CHAR(50),
    allowNull: false
  }
}, {
  tableName: 'e_log_levels',
  freezeTableName: true,
  timestamps: false,
  sequelize: db
});

LogLevels.sync();
