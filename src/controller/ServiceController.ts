import { Request, Response } from 'express';
import { Service } from '../entity/service';
import { AppDataSource } from '../data-source';
import { cloudinaryImageUploadMethod } from '../config/multer';

// Create a new service with image upload
export const createService = async (req: Request, res: Response): Promise<void> => {
  try {
    let imageUrl = '';

    if (req.file) {
      const { path } = req.file;
      imageUrl = await cloudinaryImageUploadMethod(path) as string;
    }

    const { title, description } = req.body;
    const service = AppDataSource.getRepository(Service).create({ img: imageUrl, title, description, status: 1 });
    const savedService = await AppDataSource.getRepository(Service).save(service);
    res.status(201).json({ message: 'Service created successfully', data: savedService });
  } catch (error) {
    res.status(500).json({ message: 'Error creating service', error: error.message });
  }
};

export const updateService = async (req: Request, res: Response): Promise<void> => {
  try {
    const serviceId = req.params.id;
    const serviceRepository = AppDataSource.getRepository(Service);
    const serviceToUpdate = await serviceRepository.findOne({ where: { id: serviceId } });

    if (!serviceToUpdate) {
      res.status(404).json({ message: 'Service not found' });
      return;
    }

    if (req.file) {
      const { path } = req.file;
      serviceToUpdate.img = await cloudinaryImageUploadMethod(path) as string;
    }

    const { title, description } = req.body;
    if (title) serviceToUpdate.title = title;
    if (description) serviceToUpdate.description = description;

    const updatedService = await serviceRepository.save(serviceToUpdate);
    res.status(200).json({ message: 'Service updated successfully', data: updatedService });
  } catch (error) {
    res.status(500).json({ message: 'Error updating service', error: error.message });
  }
};

export const changeServiceStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const serviceId = req.params.id;
    const serviceRepository = AppDataSource.getRepository(Service);
    const serviceToChangeStatus = await serviceRepository.findOne({ where: { id: serviceId } });

    if (!serviceToChangeStatus) {
      res.status(404).json({ message: 'Service not found' });
      return;
    }

    serviceToChangeStatus.status = serviceToChangeStatus.status === 1 ? 0 : 1; 
    await serviceRepository.save(serviceToChangeStatus);
    res.status(200).json({ message: 'Service status changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error changing service status', error: error.message });
  }
};

export const getAllServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const services = await AppDataSource.getRepository(Service).find();
    res.status(200).json({ message: 'Fetched services successfully', data: services });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
};

export const getActiveServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const services = await AppDataSource.getRepository(Service).find({ where: { status: 1 } });
    res.status(200).json({ message: 'Fetched services successfully', data: services });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
};
