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
import State from "./state.model";
  
  export interface CityI {
    id: number;
    name: string;
    stateId: number;
  }
  
  @Table({
    tableName: "cities",
    timestamps: true
  })
  export default class City extends Model implements CityI {
    @AutoIncrement
    @PrimaryKey
    @Column
    id: number;
  
    @AllowNull(false)
    @NotEmpty
    @Column(DataType.STRING)
    name: string;

    @ForeignKey(() => State)
    @Column
    stateId: number;
  
    @BelongsTo(() => State)
    state: State;
  }
  