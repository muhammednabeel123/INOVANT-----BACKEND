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
    username: 'postgres',
    password:'1234',
    database: "Menu-ordering",
    entities: [User, Product,Type,Admin],
    synchronize: true,
    logging: false,
    ssl: false,
    // extra: {
    //     ssl: {
    //         rejectUnauthorized: false
    //     }
    // },
    migrations: [],
    subscribers: [],
})