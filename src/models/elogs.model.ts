/* eslint camelcase: off */
import { Model, DataTypes } from 'sequelize';
import { db } from '../config/database';
import { LogLevels } from './eloglevels.model';
import { LogProviders } from './elogproviders.model';

export class Logs extends Model {
    public id_log!: number;
    public id_log_provider!: number;
    public id_log_level!: number;
    public str_message!: string;
    public print_date!: Date;
}

Logs.init({
  id_log: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  id_log_provider: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: LogProviders
    }
  },
  id_log_level: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: LogLevels
    }
  },
  str_message: {
    type: DataTypes.CHAR(255),
    allowNull: false
  },
  print_date: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'e_logs',
  freezeTableName: true,
  timestamps: false,
  sequelize: db
});

Logs.hasMany(LogLevels, { as: 'loglevels', foreignKey: 'id_log_level' });
Logs.hasMany(LogProviders, { as: 'logproviders', foreignKey: 'id_log_provider' });
LogLevels.belongsTo(Logs, { foreignKey: 'id_log_level' });
LogProviders.belongsTo(Logs, { foreignKey: 'id_log_provider' });

Logs.sync();
