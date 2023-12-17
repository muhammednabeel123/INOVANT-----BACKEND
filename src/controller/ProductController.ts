import { Request, Response } from 'express';
import { Product } from '../entity/product'; 
import { AppDataSource } from '../data-source';

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
   
  try {
    const products = await AppDataSource.getRepository(Product).find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = req.params.id
    const product = await AppDataSource.getRepository(Product).findOne({ where: { id: productId } });
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const imageUpload = [];
    for (let i = 0; i < req.files.length; i++) {
      imageUpload[i] = req.files[i].filename;
    }
    const { name, price, color } = req.body;
    console.log(req.body)
    const product = AppDataSource.getRepository(Product).create({ name, price,images: imageUpload });
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
    const productToDelete = await productRepository.findOne({ where: { id: productId } });

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
    const product = await productRepository.findOne({ where: { id: productId } });
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    product.images = product.images.filter((image) => image !== imageUrlToDelete);
    await productRepository.save(product);
    res.status(200).json({ message: 'Product image deleted successfully' });
  } catch (error) {
    console.error('Error deleting product image:', error);
    res.status(500).json({ message: 'Error deleting product image', error: error.message });
  }

  
};

export const updateProductById = async (req: Request, res: Response): Promise<void> => {
  try {

    const productId = req.params.id;
    const productRepository = AppDataSource.getRepository(Product);
    const productToUpdate = await productRepository.findOne({ where: { id: productId } });
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
    if (req.files && req.files.length > 0) {
      const imageUpload = [];
      for (let i = 0; i < req.files.length; i++) {
        imageUpload[i] = req.files[i].filename;
        productToUpdate.images.push(imageUpload[i]) ;
      }   
    }

    await productRepository.save(productToUpdate);

    res.status(200).json({ message: 'Product updated successfully', updatedProduct: productToUpdate });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};


