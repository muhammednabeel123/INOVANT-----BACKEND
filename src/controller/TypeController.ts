import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Type } from '../entity/Type';

export const createType = async (req: Request, res: Response): Promise<void> => {
    try {
        const imageUpload = [];

        // Check if files are present
        if (req.files && Array.isArray(req.files)) {
            for (const file of req.files) {
                const { path } = file;
                const adjustedPath = path.replace(/^src\//, '');
                const url = `${process.env.BACKEND_STATICFILES_URL}/${adjustedPath}`;
                imageUpload.push(url);
            }
        }
        const { name } = req.body;
        const type = AppDataSource.getRepository(Type).create({ name, images: imageUpload, });
        await AppDataSource.getRepository(Type).save(type);
        res.status(201).json(type);
    } catch (error) {
        res.status(500).json({ message: 'Error creating type', error: error.message });
    }
};

export const getAllTypes = async (req: Request, res: Response): Promise<void> => {
    try {
        const types = await AppDataSource.getRepository(Type).find({
            where:{
                isDeleted:0
              },
              order: {
                typeId: 'DESC',
              },
        });
        let result = [];
        for (let item of types) {
            let d = {
                id: item.typeId,
                name: item.name
            }
            result.push(d)
        }
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching types', error: error.message });
    }
};

export const deleteType = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.body;
        const type = await AppDataSource.getRepository(Type).findOne({
            where: { typeId: id }
        });
        if (!type) {
            return res.status(404).json({ message: 'Type not found' });
        }
        type.isDeleted = 1;
        await AppDataSource.getRepository(Type).save(type);
        res.status(201).json({ message: 'Type marked as deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting type', error: error.message });
    }
};

