import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Product } from "./entity/product"
import * as dotenv from "dotenv";
import { Type } from "./entity/Type";
import { Admin } from "./entity/admin";
dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.HOST,
    port: 5432,
    username: 'default',
    password: process.env.PASSWORD,
    database: "verceldb",
    entities: [User, Product,Type,Admin],
    synchronize: true,
    logging: false,
    ssl: true,
    extra: {
        ssl: {
            rejectUnauthorized: false
        }
    },
    migrations: [],
    subscribers: [],
})