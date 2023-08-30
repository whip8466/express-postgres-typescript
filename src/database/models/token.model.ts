import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  NotEmpty,
  PrimaryKey,
  Table
} from "sequelize-typescript";

const { TOKEN_TYPES } = require("../config/enums");

import User from "./user.model";

export interface TokenI {
  id: number;
  token: string;
  type: string;
  expires: string;
  blacklisted: boolean;
}

@Table({
  tableName: "tokens",
  timestamps: true
})
export default class Token extends Model implements TokenI {
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.STRING)
  token: string;

  @AllowNull(false)
  @NotEmpty
  @Column(
    DataType.ENUM(
      TOKEN_TYPES.REFRESH,
      TOKEN_TYPES.RESET_PASSWORD,
      TOKEN_TYPES.VERIFY_EMAIL,
    )
  )
  type: string;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.DATE)
  expires: string;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.BOOLEAN)
  blacklisted: boolean;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
