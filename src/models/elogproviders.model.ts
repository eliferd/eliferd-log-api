/* eslint camelcase: off */
import { Model, DataTypes } from 'sequelize';
import { db } from '../config/database';

export class LogProviders extends Model {
    public id_log_provider!: number;
    public str_provider_name!: string;
}

LogProviders.init({
  id_log_provider: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  str_provider_name: {
    type: DataTypes.CHAR(50),
    allowNull: false
  }
}, {
  tableName: 'e_log_providers',
  freezeTableName: true,
  timestamps: false,
  sequelize: db
});

LogProviders.sync();
