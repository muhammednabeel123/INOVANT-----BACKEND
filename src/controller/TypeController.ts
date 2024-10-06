import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Type } from '../entity/Type';

export const createType = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.body;
        const type = AppDataSource.getRepository(Type).create({ name });
        await AppDataSource.getRepository(Type).save(type);
        res.status(201).json(type);
    } catch (error) {
        res.status(500).json({ message: 'Error creating type', error: error.message });
    }
};

export const getAllTypes = async (req: Request, res: Response): Promise<void> => {
    try {
        const types = await AppDataSource.getRepository(Type).find();
        let result = [];
        for(let item of types){
            let d ={
                id: item.typeId,
                name: item.name
            }
            result.push(d)
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching types', error: error.message });
    }
};