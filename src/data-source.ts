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
import { Branch } from "./entity/branch";
dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.HOST,
    port: 5432,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: "rms_db",
    entities: [User, Product, Type, Admin, OrderItems, Orders, Status, Booking, Service, Branch],
    synchronize: true,
    logging: false,
    ssl: true,
    extra: {
        ssl: {
            rejectUnauthorized: false
        }
    },
    migrations: [],
    subscribers: [],
})