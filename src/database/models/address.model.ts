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

const { ADDRESS_TYPE } = require("../config/enums");
import User from "./user.model";
import Country from "./country.model";
import State from "./state.model";
import City from "./city.model";

export interface AddressI {
  id: number;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2: string;
  pincode: number;
  type: string;
  isPrimary: boolean;
  countryId: number;
  stateId: number;
  cityId: number;
}

@Table({
  tableName: "addresses",
  timestamps: true
})
export default class Address extends Model implements AddressI {
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.STRING)
  firstName: string;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.STRING)
  lastName: string;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.STRING)
  addressLine1: string;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.STRING)
  addressLine2: string;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.INTEGER)
  pincode: number;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.ENUM(ADDRESS_TYPE.HOME, ADDRESS_TYPE.OFFICE))
  type: string;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.BOOLEAN)
  isPrimary: boolean;

  @ForeignKey(() => City)
  @Column
  cityId: number;

  @BelongsTo(() => City)
  city: City;

  @ForeignKey(() => State)
  @Column
  stateId: number;

  @BelongsTo(() => State)
  state: State;

  @ForeignKey(() => Country)
  @Column
  countryId: number;

  @BelongsTo(() => Country)
  country: Country;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
