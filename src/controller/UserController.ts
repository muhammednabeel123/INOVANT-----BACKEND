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
    try {
        const { userId, firstName, lastName, age, phoneNo, pinCode, address, userName } = request.body;

        // Check if userId is provided
        if (!userId) {
            return response.status(400).json({
                message: "UserId is required",
                status: 400
            });
        }

        // Find the user by ID
        const existingUser = await AppDataSource.getRepository(User).findOne({ where: { userId } });

        if (!existingUser) {
            return response.status(404).json({
                message: "User not found",
                status: 404
            });
        }

        // Update only the fields that are provided in the request body
        if (firstName) {
            existingUser.firstName = firstName;
        }
        if (lastName) {
            existingUser.lastName = lastName;
        }
        if (age) {
            existingUser.age = age;
        }
        if (phoneNo) {
            existingUser.phoneNo = phoneNo;
        }
        if (pinCode) {
            existingUser.pincode = pinCode;
        }
        if (address) {
            existingUser.address = address;
        }
        if (userName) {
            existingUser.userName = userName;
        }

        // Save the updated user
        const userSaved = await AppDataSource.getRepository(User).save(existingUser);

        if (!userSaved) {
            return response.status(500).json({
                message: "Failed to update user",
                status: 500
            });
        }

        // Send success response
        const successResponse = {
            data: userSaved,
            status: 200,
            message: 'User updated successfully'
        };
        return response.status(200).json(successResponse);

    } catch (error) {
        console.error("Error updating user:", error);
        return response.status(500).json({
            message: "An error occurred while updating user",
            status: 500,
            error: error.message
        });
    }
}

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
    const { phoneNumber } = request.body;

    try {
        if (phoneNumber) {
            const phoneNumberRegex = /^\d{10}$/;

            if (!phoneNumberRegex.test(phoneNumber)) {
                return response.status(401).json({
                    errorMessage: "Phone number must be exactly 10 digits.",
                    errorCode: 401
                });
            }

            const userUpdateResult = await AppDataSource.getRepository(User).findOne(
                { where: { phoneNo: phoneNumber } }
            );

            if (!userUpdateResult) {
                await AppDataSource.getRepository(User).save({
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
                    message: "OTP sent successfully",
                    errorCode: 200
                });
            }
        } else {
            return response.status(401).json({
                errorMessage: "Phone Number not provided",
                errorCode: 401
            });
        }
    } catch (error) {
        console.log(error);

        return response.status(401).json({
            errorMessage: "An error occurred while sending OTP",
            errorCode: 401
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
            return response.status(404).send({
                errorMessage: "No User found.",
                errorCode: 403
            });
        }

        const verifiedResponse = await client.verify
            .v2.services(TWILIO_SERVICE_SID)
            .verificationChecks.create({
                to: `+91${phoneNumber}`,
                code: otp
            });

        if (verifiedResponse.valid) {
            const token = jwt.sign(
                {
                    userId: user.userId,
                    phoneNo: user.phoneNo,
                    userName: user.userName,
                    role: 'user'
                },
                process.env.JWT_SECRET
            );

            return response.status(200).json({
                message: "OTP verified successfully",
                status: 200,
                token
            });

        } else {
            return response.status(401).json({
                message: "OTP is not correct/valid",
                status: 401,
            });
        }

    } catch (error) {
        console.error("Error verifying OTP:", error);
        return response.status(500).send("An error occurred while verifying OTP");
    }
};
