import { Request, Response } from 'express';
import { Product } from '../entity/product'; 
import { AppDataSource } from '../data-source';
import { Type } from '../entity/Type';
import { cloudinaryImageUploadMethod } from '../config/multer';

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
   
  try {
    const products = await AppDataSource.getRepository(Product).find();
    for(let item of products){
      if (Array.isArray(item.images)) {
        item.images = item.images.map(image => image);
      }
      let types = await AppDataSource.getRepository(Type).find({ where: { typeId: item.typeId } });
        item['typeName'] = types[0].name
      }
    res.status(201).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = req.params.id
    const product = await AppDataSource.getRepository(Product).findOne({ where: { productId: productId } });
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const imageUpload = [];
  
    // Check if files are present
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        const { path } = file
        const newPath = await cloudinaryImageUploadMethod(path)
        imageUpload.push(newPath);
      }
    }
    const { name, price, category, typeId,description,isDeleted, isActive,isTodaySpecl,isTodaysMenu } = req.body;
    const product = AppDataSource.getRepository(Product).create({ name, price, images: imageUpload, category, typeId,description,isDeleted, isActive,isTodaysMenu,isTodaySpecl,createdAt: new Date() });
    await AppDataSource.getRepository(Product).save(product);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = req.params.id;
    const productRepository = AppDataSource.getRepository(Product);
    const productToDelete = await productRepository.findOne({ where: { productId: productId } });

    if (!productToDelete) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    await productRepository.remove(productToDelete);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
};


export const deleteProductImage = async (req: Request, res: Response): Promise<void> => {
  try {
   
    const productId = req.params.id;
    const imageUrlToDelete = req.params.imageId;
    const productRepository = AppDataSource.getRepository(Product);
    const product = await productRepository.findOne({ where: { productId: productId } });
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    product.images = product.images.filter((image) => image !== imageUrlToDelete);
    await productRepository.save(product);
    res.status(201).json({ message: 'Product image deleted successfully' });
  } catch (error) {
    console.error('Error deleting product image:', error);
    res.status(500).json({ message: 'Error deleting product image', error: error.message });
  }

  
};

export const updateProductById = async (req: Request, res: Response): Promise<void> => {
  try {

    const productId = req.params.id;
    const productRepository = AppDataSource.getRepository(Product);
    const productToUpdate = await productRepository.findOne({ where: { productId: productId } });
    if (!productToUpdate) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    if (req.body.name) {
      productToUpdate.name = req.body.name;
    }
    if (req.body.price) {
      productToUpdate.price = req.body.price;
    }
    if (req.body.category) {
      productToUpdate.category = req.body.category;
    }
    if (req.body.typeId) {
      productToUpdate.typeId = req.body.typeId;
    }
    if (req.body.description) {
      productToUpdate.description = req.body.description;
    }
    if (req.files && req.files.length > 0) {
      const imageUpload = [];
      for (let i = 0; i < req.files.length; i++) {
        const { path } = req.files[i];
        const newPath = await cloudinaryImageUploadMethod(path)
        imageUpload[i] = newPath;
        productToUpdate.images.push(imageUpload[i]) ;
      }   
    }
    if(req.body.isDeleted){
      productToUpdate.isDeleted = req.body.isDeleted;
    }
    if(req.body.isActive){
      productToUpdate.isActive = req.body.isActive;
    }
    if(req.body.isTodaySpecl){
      productToUpdate.isTodaySpecl = req.body.isTodaySpecl;
    }
    if(req.body.isFeatured){
      productToUpdate.isTodaysMenu  = req.body.isTodaysMenu;
    }

    await productRepository.save(productToUpdate);

    res.status(201).json({ message: 'Product updated successfully', updatedProduct: productToUpdate });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
}

export const topPicksToggle = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = req.params.id;
    const productRepository = AppDataSource.getRepository(Product);
    const productToUpdate = await productRepository.findOne({ where: { productId: productId } });
    if (!productToUpdate) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    productToUpdate.isTodaysMenu = productToUpdate.isTodaysMenu === 1 ? 0 : 1;
    await productRepository.save(productToUpdate);
    res.status(201).json({ message: 'Product updated successfully', updatedProduct: productToUpdate });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

export const todaySpclToggle = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = req.params.id;
    const productRepository = AppDataSource.getRepository(Product);
    const productToUpdate = await productRepository.findOne({ where: { productId: productId } });
    if (!productToUpdate) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    productToUpdate.isTodaySpecl = productToUpdate.isTodaySpecl === 1 ? 0 : 1;
    await productRepository.save(productToUpdate);
    res.status(201).json({ message: 'Product updated successfully', updatedProduct: productToUpdate });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

export const getTopPicksProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await AppDataSource.getRepository(Product).find({ where: { isTodaysMenu: 1 } });
    res.status(201).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching top picks products', error: error.message });
  }
};

export const getTodaySpecialProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await AppDataSource.getRepository(Product).find({ where: { isTodaySpecl: 1 } });
    res.status(201).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching today special products', error: error.message });
  }
};


