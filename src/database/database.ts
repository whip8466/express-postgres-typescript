import { Sequelize } from "sequelize-typescript";
import User from "./models/user.model";
import Country from "./models/country.model";
import State from "./models/state.model";
import City from "./models/city.model";
import Token from "./models/token.model";
import Role from "./models/role.model";
import UserRole from "./models/userRoles.model";
import Category from "./models/category.model";
import Product from "./models/product.model";
import Address from "./models/address.model";

const databaseName: string = process.env.DATABASE_NAME || "";
const databaseUser: string = process.env.DATABASE_USER || "";
const databasePassword: string = process.env.DATABASE_PASSWORD || "";
const host: string = process.env.DATABASE_HOST || "";
const port: number | undefined = parseInt(process.env.DATABASE_PORT || '', 10);
const dialect: string = process.env.DATABASE_DIALECT || "";

export const sequelize = new Sequelize(
  databaseName,
  databaseUser,
  databasePassword,
  {
    host,
    port,
    dialect: dialect as any,
    models: [
      User,
      Role,
      UserRole,
      Token,
      Country,
      State,
      City,
      Address,
      Category,
      Product,
    ]
  }
);
