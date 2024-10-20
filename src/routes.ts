import {createProduct,deleteProduct, getAllProducts, getProductById, deleteProductImage, updateProductById, topPicksToggle, todaySpclToggle, getTopPicksProducts, getTodaySpecialProducts,} from './controller/ProductController';
import express, { Request, Response } from "express";
const router = express.Router();
import { upload } from "./config/multer";
import { createType, getAllTypes } from "./controller/TypeController";
import { getAdminById, getAllAdmins, removeAdmin, saveAdmin } from "./controller/AdminController";
import { getAllUsers, removeUser, saveUser, sendOtp, verifyOtp } from './controller/UserController';

  
router.get('/products',getAllProducts);
router.get('/products/:id',getProductById);
router.post('/add-products',upload,createProduct);
router.delete('/products/:id', deleteProduct);
router.delete('/products/:id/images/:imageId', deleteProductImage);
router.put('/edit-products/:id',upload,updateProductById);
router.post('/add-type',upload,createType);
router.put('/top-picks-toggle/:id',topPicksToggle);
router.put('/today-spcl-toggle/:id',todaySpclToggle);
router.get('/top-picks',getTopPicksProducts);
router.get('/today-spcl',getTodaySpecialProducts);
router.get('/types',getAllTypes);
router.get('/admins', getAllAdmins);

router.get('/admins/:id', getAdminById);
router.post('/admins', saveAdmin);
router.delete('/admins/:id', removeAdmin);

router.get('/users', getAllUsers);

router.post('/user', saveUser);
router.delete('/user/:id', removeUser);

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

export default router;