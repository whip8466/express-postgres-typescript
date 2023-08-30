import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  NotEmpty,
  PrimaryKey,
  Table
} from "sequelize-typescript";
import Country from "./country.model";
import City from "./city.model";

export interface StateI {
  id: number;
  name: string;
  stateCode: string;
  isServiceAvailable: boolean;
}

@Table({
  tableName: "states",
  timestamps: true
})
export default class State extends Model implements StateI {
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.STRING)
  name: string;

  @Column(DataType.STRING)
  stateCode: string;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.BOOLEAN)
  isServiceAvailable: boolean;

  @ForeignKey(() => Country)
  @Column
  countryId: number;

  @BelongsTo(() => Country)
  country: Country;

  @HasMany(() => City)
  cities: City[];
}
