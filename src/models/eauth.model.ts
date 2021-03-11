/* eslint camelcase: off */
import { Model, DataTypes } from 'sequelize';
import { db } from '../config/database';
import { UserRoles } from './euserrole.model';

export class Auth extends Model {
    public id_user!:number;
    public str_username!:string;
    public str_password!:string;
    public id_user_role!:number;
}

Auth.init({
  id_user: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  str_username: {
    type: DataTypes.CHAR(50),
    allowNull: false
  },
  str_password: {
    type: DataTypes.CHAR(128),
    allowNull: false
  },
  id_user_role: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: UserRoles
    }
  }
}, {
  tableName: 'e_auth',
  freezeTableName: true,
  timestamps: false,
  sequelize: db
});

Auth.hasMany(UserRoles, { as: 'userroles', foreignKey: 'id_user_role' });
UserRoles.belongsTo(Auth, { foreignKey: 'id_user_role' });

Auth.sync();
