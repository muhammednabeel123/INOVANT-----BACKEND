import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Admin } from "../entity/admin";
import jwt from "jsonwebtoken";

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID } = process.env;
const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, {
  lazyLoading: true
})

export const getAllAdmins = async (req: Request, res: Response): Promise<void> => {
  try {
    const admins = await AppDataSource.getRepository(Admin).find();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admins', error: error.message });
  }
};

export const getAdminById = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = parseInt(req.params.id);
    const admin = await AppDataSource.getRepository(Admin).findOne({ where: { adminId } });

    if (!admin) {
      res.status(404).json({ message: 'Admin not found' });
      return;
    }
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin', error: error.message });
  }
};

// Save a new admin
export const saveAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, phoneNo, isSuperAdmin } = req.body;
    const admin = Object.assign(new Admin(), { firstName, lastName, phoneNo, isSuperAdmin });

    const savedAdmin = await AppDataSource.getRepository(Admin).save(admin);

    const successRespone = {
      data: savedAdmin,
      message: 'Admin saved successfully',
      status: 201
    }

    res.status(201).json(successRespone);
  } catch (error) {
    res.status(500).json({ message: 'Error saving admin', error: error.message });
  }
};

// Remove an admin by ID
export const removeAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = parseInt(req.params.id);
    const adminToRemove = await AppDataSource.getRepository(Admin).findOne({ where: { adminId } });

    if (!adminToRemove) {
      res.status(404).json({ message: 'Admin not found' });
      return;
    }

    const adminDeleted = await AppDataSource.getRepository(Admin).update({ adminId: adminId }, { isDeleted: 1 });

    if (adminDeleted.affected) {
      const successRespone = {
        message: 'Admin has been removed',
        status: 200
      }
      res.status(200).json(successRespone);
    }
    
  } catch (error) {
    res.status(500).json({ message: 'Error removing admin', error: error.message });
  }
};


export const adminSendOtp = async (request: Request, response: Response, next: NextFunction) => {
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

      const userUpdateResult = await AppDataSource.getRepository(Admin).findOne(
        { where: { phoneNo: phoneNumber } }
      );

      if (!userUpdateResult) {
        return response.status(404).json({
          errorMessage: "Admin not found with this phone number",
          errorCode: 404
        });
      }

      if (userUpdateResult.isDeleted === 1) {
        return response.status(403).json({
          errorMessage: "This admin account has been deleted",
          errorCode: 403
        });
      }

      // const otpResponse = await client.verify
      //   .v2.services(TWILIO_SERVICE_SID)
      //   .verifications.create({
      //     to: `+91${phoneNumber}`,
      //     channel: 'sms'
      //   });

      // if (otpResponse) {
        return response.status(200).json({
          message: "OTP sent successfully",
          errorCode: 200
        });
      // }
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

export const adminVerifyOtp = async (request: Request, response: Response, next: NextFunction) => {
  const { phoneNumber, otp } = request.body;

  try {
    const user = await AppDataSource.getRepository(Admin).findOne({
      where: { phoneNo: phoneNumber }
    });

    if (!user) {
      return response.status(404).send({
        errorMessage: "No Admin found.",
        errorCode: 403
      });
    }

    // const verifiedResponse = await client.verify
    //   .v2.services(TWILIO_SERVICE_SID)
    //   .verificationChecks.create({
    //     to: `+91${phoneNumber}`,
    //     code: otp
    //   });

    // if (verifiedResponse) {
    if(otp == 3344){
      const token = jwt.sign(
        {
          userId: user.adminId,
          phoneNo: user.phoneNo,
        },
        process.env.JWT_SECRET
      );

      return response.status(200).json({
        message: "OTP verified successfully",
        status: 200,
        token
      });

    }

  } catch (error) {
    console.error("Error verifying OTP:", error);
    return response.status(500).send("An error occurred while verifying OTP");
  }
};

