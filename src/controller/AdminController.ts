import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Admin } from "../entity/admin";

export class AdminController {

    private adminRepository = AppDataSource.getRepository(Admin);

    // Get all admins
    async all(request: Request, response: Response, next: NextFunction) {
        return this.adminRepository.find();
    }

    // Get one admin by ID
    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        const admin = await this.adminRepository.findOne({
            where: { id }
        });

        if (!admin) {
            return response.status(404).send("Admin not found");
        }
        return response.status(200).json(admin);
    }

    // Save a new admin
    async save(request: Request, response: Response, next: NextFunction) {
        const { firstName, lastName, age } = request.body;

        const admin = Object.assign(new Admin(), {
            firstName,
            lastName,
            age
        });

        const savedAdmin = await this.adminRepository.save(admin);
        return response.status(201).json(savedAdmin);
    }

    // Remove an admin by ID
    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        const adminToRemove = await this.adminRepository.findOne({
            where: { id }
        });

        if (!adminToRemove) {
            return response.status(404).send("Admin not found");
        }

        await this.adminRepository.remove(adminToRemove);
        return response.status(200).send("Admin has been removed");
    }

}
