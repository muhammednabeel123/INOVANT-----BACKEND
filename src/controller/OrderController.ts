import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Orders } from "../entity/order";
import { OrderItems } from "../entity/orderItems";
import { Product } from "../entity/product";
import { User } from "../entity/User";
import Razorpay from "razorpay";
import * as crypto from "crypto";
import { Status } from "../entity/status";

export const createOrder = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const ordersArray = request.body;

        if (!Array.isArray(ordersArray) || ordersArray.length === 0) {
            return response.status(400).send("Invalid request. Array of orders expected.");
        }

        const savedOrderItems = [];

        for (const orderData of ordersArray) {
            const { userId, productId, quantity } = orderData;

            let order = await AppDataSource.getRepository(Orders).findOne({
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
                savedOrderItems.push(savedOrderItem);

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
                        return response.status(404).send(`Product with ID ${productId} not found`);
                    }

                    const orderItem = new OrderItems();
                    orderItem.orderId = savedOrder.orderId;
                    orderItem.productId = productId;
                    orderItem.quantity = quantity;
                    orderItem.createdAt = new Date();
                    orderItem.updatedAt = new Date();
                    const savedOrderItem = await AppDataSource.getRepository(OrderItems).save(orderItem);

                    savedOrderItems.push(savedOrderItem);
                }
            }
        }
        return response.status(201).json(savedOrderItems);
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
        let totalAmount = 0
        for (let item of orderItems) {
            const product = await AppDataSource.getRepository(Product).findOne({ where: { productId: item.productId } });
            let d = {
                orderId: item.orderId,
                orderItemId: item.orderItemId,
                productId: item.productId,
                quantity: item.quantity,
                image: product?.images,
                name: product?.name,
                price: product?.price ? parseFloat(product?.price) : 0
            }
            if (typeof d.price === 'number') {
                totalAmount += d.price;
            }
            result.push(d)
        }
        let successRespone = {
            data: result,
            message: "Order details fetched successfully",
            status: 201,
            totalAmount: totalAmount
        }
        return response.status(201).send(successRespone)
    } catch (error) {
        console.log(error)
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



export const capturedOrder = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const data = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)

        data.update(JSON.stringify(request.body))

        const digest = data.digest('hex')

        if (digest !== request.headers['x-razorpay-signature']) {
            return response.status(400).send("Invalid signature");
        }

        const { payload } = request.body;

        const orderId = parseInt(payload.payment.entity.notes.order_id);


        if (request.body.event === 'payment.captured') {

            const order = await AppDataSource.getRepository(Orders).findOne({ where: { orderId } });
            if (!order) {
                return response.status(404).send("Order not found");
            }

            order.isProcessed = 1; // Success
            order.updatedAt = new Date();
            const updatedOrder = await AppDataSource.getRepository(Orders).save(order);

            return response.status(200).json(updatedOrder);
        } else {
            return response.status(400).send("Unhandled event type");
        }

    } catch (error) {
        next(error);
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

export const getOrdersByUserId = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userId = parseInt(request.params.userId);
        const orders = await AppDataSource.getRepository(Orders).find({
            where: { userId: userId },
            order: { createdAt: 'DESC' }
        });

        if (!orders || orders.length === 0) {
            return response.status(404).send("No orders found for this user");
        }

        let result = [];
        for (let order of orders) {
            if (order.isProcessed === 1) {
                const orderItems = await AppDataSource.getRepository(OrderItems).find({
                    where: { orderId: order.orderId }
                });

                let orderDetails = {
                    orderId: order.orderId,
                    orderNo: order.orderNo,
                    isProcessed: order.isProcessed,
                    createdAt: order.createdAt,
                    items: []
                };

                for (let item of orderItems) {
                    const product = await AppDataSource.getRepository(Product).findOne({
                        where: { productId: item.productId }
                    });
                    orderDetails.items.push({
                        orderItemId: item.orderItemId,
                        productId: item.productId,
                        quantity: item.quantity,
                        image: product?.images,
                        name: product?.name,
                        price: product?.price
                    });
                }
                result.push(orderDetails);
            }
        }

        return response.status(200).json({
            data: result,
            message: "Orders fetched successfully",
            status: 200
        });
    } catch (error) {
        next(error);
    }
};

export const getAllOrders = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const orders = await AppDataSource.getRepository(Orders).find({
            order: { createdAt: 'DESC' }
        });

        if (!orders || orders.length === 0) {
            return response.status(404).json({
                message: "No orders found",
                status: 404
            });
        }

        let result = [];
        for (let order of orders) {
            if (order.isProcessed === 1) {
                const orderItems = await AppDataSource.getRepository(OrderItems).find({
                    where: { orderId: order.orderId }
                });

                const user = await AppDataSource.getRepository(User).findOne({
                    where: { userId: order.userId }
                });

                let orderDetails = {
                    orderId: order.orderId,
                    orderNo: order.orderNo,
                    isProcessed: order.isProcessed,
                    createdAt: order.createdAt,
                    updatedAt: order.updatedAt,
                    user: {
                        userId: user?.userId,
                        name: user?.firstName + ' ' + user?.lastName,
                        email: user?.phoneNo
                    },
                    items: []
                };

                let totalAmount = 0;
                for (let item of orderItems) {
                    const product = await AppDataSource.getRepository(Product).findOne({
                        where: { productId: item.productId }
                    });

                    const itemAmount = (parseInt(product?.price) || 0) * item.quantity;
                    totalAmount += itemAmount;

                    orderDetails.items.push({
                        orderItemId: item.orderItemId,
                        productId: item.productId,
                        quantity: item.quantity,
                        image: product?.images,
                        name: product?.name,
                        price: product?.price,
                        itemTotal: itemAmount
                    });
                }

                orderDetails['totalAmount'] = totalAmount;
                result.push(orderDetails);
            }
        }

        return response.status(200).json({
            data: result,
            message: "All orders fetched successfully",
            status: 200,
            totalOrders: result.length
        });
    } catch (error) {
        next(error);
    }
};

export const updateOrder = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const orderId = parseInt(request.params.orderId);
        const { isDeleted, statusId } = request.body;

        const order = await AppDataSource.getRepository(Orders).findOne({ where: { orderId: orderId } });
        if (!order) {
            return response.status(404).send("Order not found");
        }

        if (statusId !== undefined) {
            order.statusId = statusId;
            order.isDeleted = isDeleted;
            order.updatedAt = new Date();
            await AppDataSource.getRepository(Orders).save(order);
        }

        return response.status(200).send("Order updated successfully");
    } catch (error) {
        next(error);
    }
};

export const removeItemFromCart = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const orderItemId = parseInt(request.params.orderItemId);

        // Find the order item
        const orderItem = await AppDataSource.getRepository(OrderItems).findOne({ where: { orderItemId } });

        if (!orderItem) {
            return response.status(404).json({ status: 404, message: "Order item not found" });
        }

        // Find the associated order
        const order = await AppDataSource.getRepository(Orders).findOne({ where: { orderId: orderItem.orderId } });

        if (!order) {
            return response.status(404).json({ status: 404, message: "Order not found" });
        }

        // Check if the order is not processed
        if (order.isProcessed !== 0) {
            return response.status(400).json({ status: 400, message: "Cannot remove item from a processed order" });
        }

        // Remove the order item
        await AppDataSource.getRepository(OrderItems).remove(orderItem);

        return response.status(200).json({ status: 200, message: "Order item removed successfully" });
    } catch (error) {
        response.status(500).json({ status: 500, message: "Error removing order item", error: error.message });
    }
};


export const listStatus = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const status = await AppDataSource.getRepository(Status).find({})
        console.log(status, 'as')
        let result = []
        for (let item of status) {
            let d = {
                statusId: item.statusId,
                name: item.name
            }
            result.push(d)
        }
        const successRespone = {
            data: result,
            status: 201,
            message: 'successfully retrieved'
        }
        return response.status(201).send(successRespone)
    } catch (error) {
        console.log(error)
        return response.status(500).send("An error occurred while fetching status details");
    }
}