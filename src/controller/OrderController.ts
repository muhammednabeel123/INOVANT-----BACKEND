import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Orders } from "../entity/order";
import { OrderItems } from "../entity/orderItems";
import { Product } from "../entity/product";
import { User } from "../entity/User";

export const createOrder = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { userId, productId, quantity } = request.body;

        // const user = await AppDataSource.getRepository(User).findOne({ where: { id: userId } });
        // if (!user) {
        //     return response.status(404).send("User not found");
        // }

        const order = await AppDataSource.getRepository(Orders).findOne({
            where: {
                userId: userId,
                isProcessed: 0
            }
        });

        if (order) {
            let orderItem = await AppDataSource.getRepository(OrderItems).findOne({
                where: {
                    orderId: order.orderId,
                    productId: productId
                }
            });

            if (orderItem) {
                orderItem.quantity = quantity;
                orderItem.updatedAt = new Date();
            } else {
                orderItem = new OrderItems();
                orderItem.orderId = order.orderId;
                orderItem.productId = productId;
                orderItem.quantity = quantity;
                orderItem.createdAt = new Date();
                orderItem.updatedAt = new Date();
            }

            const savedOrderItem = await AppDataSource.getRepository(OrderItems).save(orderItem);
            return response.status(201).json(savedOrderItem);

        } else {
            const newOrder = new Orders();
            newOrder.orderNo = Math.floor(100000 + Math.random() * 900000);
            newOrder.userId = userId;
            newOrder.isProcessed = 0;
            newOrder.createdAt = new Date();
            newOrder.updatedAt = new Date();
            const savedOrder = await AppDataSource.getRepository(Orders).save(newOrder);

            if (savedOrder) {
                const product = await AppDataSource.getRepository(Product).findOne({ where: { productId: productId } });
                if (!product) {
                    return response.status(404).send("Product not found");
                }

                const orderItem = new OrderItems();
                orderItem.orderId = savedOrder.orderId;
                orderItem.productId = productId;
                orderItem.quantity = quantity;
                orderItem.createdAt = new Date();
                orderItem.updatedAt = new Date();
                const savedOrderItem = await AppDataSource.getRepository(OrderItems).save(orderItem);

                return response.status(201).json(savedOrderItem);
            }
        }
    } catch (error) {
        next(error);
    }
};


export const addItemToOrder = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { orderId, productId, quantity } = request.body;

        const order = await AppDataSource.getRepository(Orders).findOne({ where: { orderId: orderId } });

        if (!order) {
            return response.status(404).send("Order not found");
        }

        const product = await AppDataSource.getRepository(Product).findOne({ where: { productId: productId } });

        if (!product) {
            return response.status(404).send("Product not found");
        }

        const orderItem = new OrderItems();
        orderItem.orderId = orderId;
        orderItem.productId = productId;
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
            where: { orderId: orderId },
            // relations: ["userId"]
        });
        if (!order) {
            return response.status(404).send("Order not found");
        }
        const orderItems = await AppDataSource.getRepository(OrderItems).find({
            where: { orderId },
        });
        let result = []
        for (let item of orderItems) {
            const product = await AppDataSource.getRepository(Product).findOne({ where: { productId: item.productId } });
            let d = {
                orderId: item.orderId,
                orderItemId: item.orderItemId,
                productId: item.productId,
                quantity: item.quantity,
                image: product?.images ? `https://inovant.onrender.com/uploads/${product?.images}` : null,
                name: product?.name,
                price: product?.price
            }
            result.push(d)
        }
        let successRespone = {
            data: result,
            message: "Order details fetched successfully",
            status: 201
        }
        return response.status(201).send(successRespone)
    } catch (error) {
        return response.status(500).send("An error occurred while fetching order details");
    }
};

export const checkout = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const orderId = parseInt(request.body.orderId);
        const order = await AppDataSource.getRepository(Orders).findOne({ where: { orderId: orderId } });
        if (!order) {
            return response.status(404).send("Order not found");
        }
        order.isProcessed = 1;
        order.updatedAt = new Date();
        const updatedOrder = await AppDataSource.getRepository(Orders).save(order);
        return response.status(201).json(updatedOrder);
    } catch (error) {
        return response.status(500).send("An error occurred while fetching order details");
    }
};

export const cancelOrder = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const orderId = parseInt(request.params.orderId);
        const order = await AppDataSource.getRepository(Orders).findOne({ where: { orderId: orderId } });
        if (!order) {
            return response.status(404).send("Order not found");
        }
        if (order.isProcessed) {
            return response.status(201).send("Processed orders cannot be canceled");
        }
        await AppDataSource.getRepository(Orders).remove(order);
        return response.status(201).send("Order has been canceled successfully");
    } catch (error) {
        next(error);
    }
};
