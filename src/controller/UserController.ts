import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"
import { randomInt } from "crypto";
import jwt from "jsonwebtoken";

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID } = process.env;
const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, {
    lazyLoading: true
})

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
        where: { userId: id }
    });

    if (!user) {
        return "unregistered user";
    }
    return user;
};

export const updateUser = async (request: Request, response: Response, next: NextFunction) => {
    const { userId, firstName, lastName, age, phoneNo } = request.body;

    const user = Object.assign(new User(), {
        firstName,
        lastName,
        age,
        phoneNo
    });

    const userSaved = AppDataSource.getRepository(User).update({ userId: userId }, user);
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

        const userToRemove = await AppDataSource.getRepository(User).findOneBy({ userId: id });

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
    const { phoneNumber, userName } = request.body;

    try {
        // Check if phoneNumber and userName are provided
        if (userName && phoneNumber) {
            // Ensure phoneNumber consists of exactly 10 digits and is numeric
            const phoneNumberRegex = /^\d{10}$/;

            if (!phoneNumberRegex.test(phoneNumber)) {
                return response.status(400).json({
                    errorMessage: "Phone number must be exactly 10 digits.",
                    errorCode: 400
                });
            }

            const userUpdateResult = await AppDataSource.getRepository(User).findOne(
                { where: { phoneNo: phoneNumber, userName: userName } }
            );

            if (!userUpdateResult) {
                const userWithSameUsername = await AppDataSource.getRepository(User).findOne(
                    { where: { userName: userName } }
                );

                const userWithSamePhoneNumber = await AppDataSource.getRepository(User).findOne(
                    { where: { phoneNo: phoneNumber } }
                );

                if (userWithSameUsername && !userWithSamePhoneNumber) {
                    return response.status(404).json({
                        errorMessage: "The username already exists, but the phone number does not match.",
                        errorCode: 404
                    });
                }

                if (!userWithSameUsername && userWithSamePhoneNumber) {
                    return response.status(404).json({
                        errorMessage: "The phone number already exists, but the username does not match.",
                        errorCode: 404
                    });
                }

                await AppDataSource.getRepository(User).save({
                    userName: userName,
                    phoneNo: phoneNumber
                });
            }

            const otpResponse = await client.verify
                .v2.services(TWILIO_SERVICE_SID)
                .verifications.create({
                    to: `+91${phoneNumber}`,
                    channel: 'sms'
                });

            if (otpResponse) {
                return response.status(200).json({
                    errorMessage: "OTP sent and expiration updated successfully",
                    errorCode: 200
                });
            }
        } else {
            return response.status(404).json({
                errorMessage: "User Name/Phone Number not provided",
                errorCode: 404
            });
        }
    } catch (error) {
        console.error("Error sending OTP:", error);
        return response.status(500).json({
            errorMessage: "An error occurred while sending OTP",
            errorCode: 500
        });
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

        const verifiedResponse = await client.verify
            .v2.services(TWILIO_SERVICE_SID)
            .verificationChecks.create({
                to: `+91${phoneNumber}`,
                code: otp
            });

        if (verifiedResponse) {
            const token = jwt.sign(
                {
                    userId: user.userId,
                    phoneNo: user.phoneNo,
                    userName: user.userName,
                },
                process.env.JWT_SECRET
            );

            return response.status(200).json({
                message: "OTP verified successfully",
                token
            });

        }

    } catch (error) {
        console.error("Error verifying OTP:", error);
        return response.status(500).send("An error occurred while verifying OTP");
    }
};
