import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Orders } from "../entity/order";
import { OrderItems } from "../entity/orderItems";
import { Product } from "../entity/product";
import { User } from "../entity/User";

export const createOrder = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { userId } = request.body;

        const user = await AppDataSource.getRepository(User).findOne({ where: { id: userId } });

        if (!user) {
            return response.status(404).send("User not found");
        }

        const newOrder = new Orders();
        newOrder.orderNo = Math.floor(100000 + Math.random() * 900000); // Random order number
        newOrder.userId = user;
        newOrder.isProcessed = false;
        newOrder.createdAt = new Date();
        newOrder.updatedAt = new Date();

        const savedOrder = await AppDataSource.getRepository(Orders).save(newOrder);
        return response.status(201).json(savedOrder);
    } catch (error) {
        next(error);
    }
};

export const addItemToOrder = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { orderId, productId, quantity } = request.body;

        const order = await AppDataSource.getRepository(Orders).findOne({ where: { id: orderId } });

        if (!order) {
            return response.status(404).send("Order not found");
        }

        const product = await AppDataSource.getRepository(Product).findOne({ where: { productId: productId } });

        if (!product) {
            return response.status(404).send("Product not found");
        }

        const orderItem = new OrderItems();
        orderItem.orderId = orderId;
        orderItem.productId = product;
        orderItem.quantity = quantity;
        orderItem.createdAt = new Date();
        orderItem.updatedAt = new Date();

        const savedOrderItem = await AppDataSource.getRepository(OrderItems).save(orderItem);
        return response.status(201).json(savedOrderItem);
    } catch (error) {
        next(error);
    }
};

export const getOrderDetails = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const orderId = parseInt(request.params.orderId);

        const order = await AppDataSource.getRepository(Orders).findOne({
            where: { id: orderId },
            relations: ["userId"]
        });

        if (!order) {
            return response.status(404).send("Order not found");
        }

        const orderItems = await AppDataSource.getRepository(OrderItems).find({
            where: { orderId },
            relations: ["productId"]
        });

        return response.status(200).json({ order, orderItems });
    } catch (error) {
        next(error);
    }
};

export const processOrder = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const orderId = parseInt(request.params.orderId);

        const order = await AppDataSource.getRepository(Orders).findOne({ where: { id: orderId } });

        if (!order) {
            return response.status(404).send("Order not found");
        }

        if (order.isProcessed) {
            return response.status(400).send("Order has already been processed");
        }

        order.isProcessed = true;
        order.updatedAt = new Date();

        const updatedOrder = await AppDataSource.getRepository(Orders).save(order);
        return response.status(200).json(updatedOrder);
    } catch (error) {
        next(error);
    }
};

export const cancelOrder = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const orderId = parseInt(request.params.orderId);

        const order = await AppDataSource.getRepository(Orders).findOne({ where: { id: orderId } });

        if (!order) {
            return response.status(404).send("Order not found");
        }

        if (order.isProcessed) {
            return response.status(400).send("Processed orders cannot be canceled");
        }

        await AppDataSource.getRepository(Orders).remove(order);
        return response.status(200).send("Order has been canceled successfully");
    } catch (error) {
        next(error);
    }
};
