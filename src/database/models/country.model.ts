import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  HasMany,
  Model,
  NotEmpty,
  PrimaryKey,
  Table
} from "sequelize-typescript";
import State from "./state.model";

export interface CountryI {
  id: number;
  name: string;
  phoneCode: string;
}

@Table({
  tableName: "countries",
  timestamps: true
})
export default class Country extends Model implements CountryI {
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.STRING)
  name: string;

  @Column(DataType.STRING)
  phoneCode: string;

  @HasMany(() => State)
  states: State[];
}
