import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Product } from "./entity/product"
import * as dotenv from "dotenv";
import { Type } from "./entity/Type";
import { Admin } from "./entity/admin";
import { OrderItems } from "./entity/orderItems";
import { Orders } from "./entity/order";
import { Status } from "./entity/status";
import { Booking } from "./entity/booking";
import { Service } from "./entity/service";
dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.HOST,
    port: 5432,
    username: 'default',
    password: 'jMfIREP1nWe6',
    database: "verceldb",
    entities: [User, Product,Type,Admin,OrderItems,Orders,Status,Booking,Service],
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