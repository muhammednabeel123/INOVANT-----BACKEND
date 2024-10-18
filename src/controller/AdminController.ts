import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Admin } from "../entity/admin";

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
      const id = parseInt(req.params.id);
      const admin = await AppDataSource.getRepository(Admin).findOne({ where: { id } });
      
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
      const { firstName, lastName, age } = req.body;
      const admin = Object.assign(new Admin(), { firstName, lastName, age });
  
      const savedAdmin = await AppDataSource.getRepository(Admin).save(admin);
      res.status(201).json(savedAdmin);
    } catch (error) {
      res.status(500).json({ message: 'Error saving admin', error: error.message });
    }
  };
  
  // Remove an admin by ID
  export const removeAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const adminToRemove = await AppDataSource.getRepository(Admin).findOne({ where: { id } });
  
      if (!adminToRemove) {
        res.status(404).json({ message: 'Admin not found' });
        return;
      }
  
      await AppDataSource.getRepository(Admin).remove(adminToRemove);
      res.status(200).json({ message: 'Admin has been removed' });
    } catch (error) {
      res.status(500).json({ message: 'Error removing admin', error: error.message });
    }
  };
