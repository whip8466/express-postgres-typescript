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
import Product from "./product.model";
  
  export interface CategoryI {
    id: number;
    categoryNameEN: string;
    categoryNameES: string;
  }
  
  @Table({
    tableName: "categories",
    timestamps: true
  })
  export default class Category extends Model implements CategoryI {
    @AutoIncrement
    @PrimaryKey
    @Column
    id: number;
  
    @AllowNull(false)
    @NotEmpty
    @Column(DataType.STRING)
    categoryNameEN: string;

    @AllowNull(false)
    @NotEmpty
    @Column(DataType.STRING)
    categoryNameES: string;
  
    @HasMany(() => Product)
    products: Product[];
  }
  