/* eslint camelcase: off */
import { Model, DataTypes } from 'sequelize';
import { db } from '../config/database';

export enum UserRoleEnum {
  ADMIN = 1,
  APPLICATION = 2
}

export class UserRoles extends Model {
    public id_user_role!: number;
    public str_role!: string;
}

UserRoles.init({
  id_user_role: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  str_role: {
    type: DataTypes.CHAR(50),
    allowNull: false
  }
}, {
  tableName: 'e_user_roles',
  freezeTableName: true,
  timestamps: false,
  sequelize: db
});

UserRoles.sync();
