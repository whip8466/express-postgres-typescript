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
import Category from "./category.model";

export interface ProductI {
  id: number;
  productName: string;
  productImage: string;
  description: string;
  mrp: number;
  categoryId: number;
}

@Table({
  tableName: "products",
  timestamps: true
})
export default class Product extends Model implements ProductI {
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.STRING)
  productName: string;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.STRING)
  productImage: string;

  @Column(DataType.TEXT)
  description: string;

  @Column(DataType.DECIMAL(10, 2))
  mrp: number;

  @ForeignKey(() => Category)
  @Column
  categoryId: number;

  @BelongsTo(() => Category)
  category: Category;
}
