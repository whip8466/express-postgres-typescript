import {
  AllowNull,
  AutoIncrement,
  BelongsToMany,
  Column,
  DataType,
  Model,
  NotEmpty,
  PrimaryKey,
  Table
} from "sequelize-typescript";
import User from "./user.model";
import UserRole from "./userRoles.model";
const { ROLES } = require("../config/roles");
export interface RoleI {
  id: number;
  roleName: string;
}
@Table({
  tableName: "roles",
  timestamps: true
})
export default class Role extends Model implements RoleI {
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.ENUM(ROLES.ADMIN, ROLES.CUSTOMER))
  roleName: string;

  @BelongsToMany(() => User, () => UserRole)
  users: User[];
}
