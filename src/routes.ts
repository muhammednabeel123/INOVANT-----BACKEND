import {createProduct,deleteProduct, getAllProducts, getProductById, deleteProductImage, updateProductById, topPicksToggle, todaySpclToggle, getTopPicksProducts, getTodaySpecialProducts,} from './controller/ProductController';
import express, { Request, Response } from "express";
const router = express.Router();
import { upload } from "./config/multer";
import { getAdminById, getAllAdmins, removeAdmin, saveAdmin, adminSendOtp, adminVerifyOtp } from "./controller/AdminController";
import { createType, deleteType, getAllTypes } from "./controller/TypeController";
import { getAllUsers, removeUser, updateUser, sendOtp, verifyOtp } from './controller/UserController';
import { addItemToOrder, cancelOrder, checkout, createOrder, getAllOrders, getOrderDetails, getOrdersByUserId } from './controller/OrderController';

  
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
router.post('/delete-type',deleteType)

router.get('/admins', getAllAdmins);
router.post('/admin', saveAdmin);
router.get('/admin/:id', getAdminById);
router.post('/admin/send-otp', adminSendOtp);
router.post('/admin/verify-otp', adminVerifyOtp);
router.delete('/admins/:id', removeAdmin);

router.get('/users', getAllUsers);
router.patch('/user', updateUser);
router.delete('/user/:id', removeUser);

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

router.post('/add-to-cart', createOrder);
router.post('/order/item', addItemToOrder);
router.get('/order/:orderId', getOrderDetails);
router.post('/order/checkout',checkout);
router.delete('/order/:orderId', cancelOrder);
router.get('/orders', getAllOrders);
router.get('/orders/:userId', getOrdersByUserId);

export default router;