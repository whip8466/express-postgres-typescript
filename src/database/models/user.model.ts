import {
  AllowNull,
  AutoIncrement,
  BeforeCreate,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  NotEmpty,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import * as bcrypt from "bcrypt";

const { GENDER, LANGUAGES } = require("../config/enums");

import Tokens from "./token.model";
import UserRole from "./userRoles.model";
import Role from "./role.model";
import State from "./state.model";

export interface UserI {
  id: number;
  firstName: string;
  lastName: string;
  profileImage: string;
  email: string;
  phone: string;
  password: string;
  dateOfBirth: string;
  gender: string;
  stateId: number;
  lang: string;
}

@Table({
  tableName: "users",
  timestamps: true,
})
class User extends Model implements UserI {
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  // @AllowNull(false)
  // @NotEmpty
  @Column(DataType.STRING)
  firstName: string;

  // @AllowNull(false)
  // @NotEmpty
  @Column(DataType.STRING)
  lastName: string;

  @Column(DataType.STRING)
  profileImage: string;

  // @AllowNull(true)
  // @NotEmpty
  // @Unique
  // @IsEmail
  @Column(DataType.STRING)
  email: string;

  @Column(DataType.STRING)
  phone: string;

  // @AllowNull(false)
  // @NotEmpty
  @Column(DataType.STRING)
  password: string;

  @Column(DataType.DATE)
  dateOfBirth: string;

  // @AllowNull(false)
  // @NotEmpty
  @Column(DataType.ENUM(GENDER.MALE, GENDER.FEMALE, GENDER.OTHER))
  gender: string;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.ENUM(LANGUAGES.EN, LANGUAGES.ES))
  lang: string;

  @ForeignKey(() => State)
  @Column
  stateId: number;

  @BelongsTo(() => State)
  state: State;

  @HasMany(() => Tokens)
  tokens: Tokens[];

  @BelongsToMany(() => Role, () => UserRole)
  roles: Role[];

  @BeforeCreate
  static async encryptPassword(instance: User) {
    // this will also be called when an instance is created
    if (instance.password) {
      instance.password = await bcrypt.hash(instance.password, 8);
    }
  }
}

export default User;
