import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Branch } from "../entity/branch";
import { Admin } from "../entity/admin";

export const getAllBranches = async (req: Request, res: Response): Promise<void> => {
  try {
    const branches = await AppDataSource.getRepository(Branch).find({
        where:{
            isDeleted:0
        }
    });
      for (let item of branches) {
          const admin = await AppDataSource.getRepository(Admin).findOne({
              where: {
                  adminId: item.adminId,
                  isDeleted:0
              }
          })
          item['adminName'] = admin ? 
            `${admin?.firstName || ''} ${admin?.lastName || ''}`.trim() : 
            '';
      }
    const successResponse = {
      data: branches,
      status: 200,
      message: 'Branches successfully retrieved',
    };
    return res.status(200).send(successResponse);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching branches', error: error.message });
  }
};

export const getBranchById = async (req: Request, res: Response): Promise<void> => {
  try {
    const branchId = parseInt(req.params.id);
    const branch = await AppDataSource.getRepository(Branch).findOne({ where: { branchId,isDeleted:0 } });
    const admin = await AppDataSource.getRepository(Admin).findOne({
        where:{
            adminId:branch.adminId,
            isDeleted:0
        }
    })
    if (!branch) {
        res.status(404).json({ message: 'Branch not found' });
        return;
    }

    branch['adminName'] = admin ? 
    `${admin?.firstName || ''} ${admin?.lastName || ''}`.trim() : 
    '';

    const successResponse = {
      data: branch,
      status: 200,
      message: 'Branch successfully retrieved',
    };
    return res.status(200).send(successResponse);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching branch', error: error.message });
  }
};

export const saveBranch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { branchName, pincode, adminId } = req.body;

    if (!branchName || !adminId) {
      return res.status(400).json({ message: 'Branch name and Admin ID are required.' });
    }

    const admin = await AppDataSource.getRepository(Admin).findOne({ where: { adminId,isDeleted:0 } });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }

    const branch = Object.assign(new Branch(), { branchName, pincode, adminId });
    const savedBranch = await AppDataSource.getRepository(Branch).save(branch);

    const successResponse = {
      data: savedBranch,
      status: 201,
      message: 'Branch created successfully',
    };
    return res.status(201).send(successResponse);
  } catch (error) {
    res.status(500).json({ message: 'Error creating branch', error: error.message });
  }
};

export const updateBranch = async (req: Request, res: Response): Promise<void> => {
  try {
    const branchId = parseInt(req.params.id);
    const { branchName, adminId, pincode } = req.body;

    if (!branchName || !adminId) {
      return res.status(400).json({ message: 'Branch name and Admin ID are required.' });
    }

    const branchToUpdate = await AppDataSource.getRepository(Branch).findOne({ where: { branchId,isDeleted:0 } });
    if (!branchToUpdate) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    const admin = await AppDataSource.getRepository(Admin).findOne({ where: { adminId ,isDeleted:0} });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }

    branchToUpdate.branchName = branchName;
    branchToUpdate.pincode = pincode || branchToUpdate.pincode;
    branchToUpdate.adminId = adminId

    const updatedBranch = await AppDataSource.getRepository(Branch).save(branchToUpdate);

    const successResponse = {
      data: updatedBranch,
      status: 200,
      message: 'Branch updated successfully',
    };
    return res.status(200).send(successResponse);
  } catch (error) {
    res.status(500).json({ message: 'Error updating branch', error: error.message });
  }
};

export const removeBranch = async (req: Request, res: Response): Promise<void> => {
  try {
    const branchId = parseInt(req.params.id);
    const branchToRemove = await AppDataSource.getRepository(Branch).findOne({ where: { branchId } });

    if (!branchToRemove) {
      res.status(404).json({ message: 'Branch not found' });
      return;
    }

    const branchDeleted = await AppDataSource.getRepository(Branch).update({ branchId }, { isDeleted: 1 });

    if (branchDeleted.affected) {
      const successResponse = {
        message: 'Branch has been removed',
        status: 200,
      };
      return res.status(200).send(successResponse);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error removing branch', error: error.message });
  }
};
export const getBranchesByAdminId = async (req: Request, res: Response): Promise<void> => {
    try {
      const { adminId } = req.params;
      
      const branches = await AppDataSource.getRepository(Branch)
        .createQueryBuilder("branch")
        .innerJoin(Admin, "admin", "branch.adminId = admin.adminId")
        .where("branch.adminId = :adminId", { adminId })
        .andWhere("branch.isDeleted = 0")
        .andWhere("admin.isDeleted = 0")
        .getMany();
  
      if (!branches || branches.length === 0) {
        return res.status(404).json({ message: 'No branches found for the given admin or admin is deleted' });
      }
  
      const successResponse = {
        data: branches,
        status: 200,
        message: 'Branches retrieved successfully'
      };
  
      res.status(200).json(successResponse);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching branches', error: error.message });
    }
  };
