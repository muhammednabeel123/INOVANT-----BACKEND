import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"
import { randomInt } from "crypto";
import jwt from "jsonwebtoken";

// const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID } = process.env;
// const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, {
//     lazyLoading: true
// })

export const getAllUsers = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const users = await AppDataSource.getRepository(User).find();
        return response.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

export const one = async (request: Request, response: Response, next: NextFunction) => {
    const id = parseInt(request.params.id);

    const user = await AppDataSource.getRepository(User).findOne({
        where: { id }
    });

    if (!user) {
        return "unregistered user";
    }
    return user;
};

export const saveUser = async (request: Request, response: Response, next: NextFunction) => {
    const { firstName, lastName, age, phoneNo } = request.body;

    const user = Object.assign(new User(), {
        firstName,
        lastName,
        age,
        phoneNo
    });

    const userSaved = AppDataSource.getRepository(User).save(user);
    if (userSaved) {
        response.status(200).send(userSaved)
    }

};

export const removeUser = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const id = parseInt(request.params.id);

        if (isNaN(id)) {
            return response.status(400).send("Invalid user ID");
        }

        const userToRemove = await AppDataSource.getRepository(User).findOneBy({ id });

        if (!userToRemove) {
            return response.status(404).send("User does not exist");
        }

        await AppDataSource.getRepository(User).remove(userToRemove);

        return response.status(200).send("User has been removed successfully");
    } catch (error) {
        console.error("Error removing user:", error);
        return response.status(500).send("An error occurred while removing the user");
    }
};


export const sendOtp = async (request: Request, response: Response, next: NextFunction) => {
    const { phoneNumber } = request.body;

    try {
        const userUpdateResult = await AppDataSource.getRepository(User).findOne(
            { where: { phoneNo: phoneNumber } }
        );

        if (!userUpdateResult) {
            return response.status(404).send("User not found");
        }

        // const otpResponse = await client.verify
        //     .v2.services(TWILIO_SERVICE_SID)
        //     .verifications.create({
        //         to: `+91${phoneNumber}`,
        //         channel: 'sms'
        //     });

        // if (otpResponse) {
        //     return response.status(200).send("OTP sent and expiration updated successfully");
        // }

    } catch (error) {
        console.error("Error sending OTP:", error);
        return response.status(500).send("An error occurred while sending OTP");
    }
};

export const verifyOtp = async (request: Request, response: Response, next: NextFunction) => {
    const { phoneNumber, otp } = request.body;

    try {
        const user = await AppDataSource.getRepository(User).findOne({
            where: { phoneNo: phoneNumber }
        });

        if (!user) {
            return response.status(404).send("User not found");
        }

        // const verifiedResponse = await client.verify
        //     .v2.services(TWILIO_SERVICE_SID)
        //     .verificationChecks.create({
        //         to: `+91${phoneNumber}`,
        //         code: otp
        //     });

        // if (verifiedResponse) {
        //     const token = jwt.sign(
        //         {
        //             userId: user.id,
        //             phoneNo: user.phoneNo,
        //             firstName: user.firstName,
        //             lastName: user.lastName,
        //         },
        //         process.env.JWT_SECRET
        //     );

        //     return response.status(200).json({
        //         message: "OTP verified successfully",
        //         token
        //     });
        // }

    } catch (error) {
        console.error("Error verifying OTP:", error);
        return response.status(500).send("An error occurred while verifying OTP");
    }
};
