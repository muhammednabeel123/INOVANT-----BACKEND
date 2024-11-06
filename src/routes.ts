import {createProduct,deleteProduct, getAllProducts, getProductById, deleteProductImage, updateProductById, topPicksToggle, todaySpclToggle, getTopPicksProducts, getTodaySpecialProducts, getAllProductsByUserId,} from './controller/ProductController';
import express, { Request, Response } from "express";
const router = express.Router();
import { upload, uploadSingle } from "./config/multer";
import { getAdminById, getAllAdmins, removeAdmin, saveAdmin, adminSendOtp, adminVerifyOtp } from "./controller/AdminController";
import { createType, deleteType, getAllTypes } from "./controller/TypeController";
import { getAllUsers, removeUser, updateUser, sendOtp, verifyOtp } from './controller/UserController';
import { addItemToOrder, cancelOrder, checkout, createOrder, getAllOrders, getOrderDetails, getOrdersByUserId, updateOrder, listStatus, removeItemFromCart } from './controller/OrderController';
import { changeServiceStatus, createService, getActiveServices, getAllServices, updateService } from './controller/ServiceController';
import { acceptBookingByAdmin, createBooking, deleteBooking, editBooking, getAllBookings, updateVisitedStatus } from './controller/BookingController';
import { getAllBranches, getBranchById, getBranchesByAdminId, removeBranch, saveBranch, updateBranch } from './controller/BranchController';

  
router.get('/products',getAllProducts);
router.get('/products/:id',getProductById);
router.post('/add-products',upload,createProduct);
router.delete('/products/:id', deleteProduct);
router.delete('/products/:id/images/:imageId', deleteProductImage);
router.put('/edit-products/:id',upload,updateProductById);
router.post('/add-type',upload,createType);
router.get('/products/user/:userId', getAllProductsByUserId);
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
router.delete('/order/item/:orderItemId', removeItemFromCart);
router.get('/orders', getAllOrders);
router.get('/orders/:userId', getOrdersByUserId);
router.post('/orders/:orderId', updateOrder);

router.get('/get-status',listStatus)

router.post('/add-service',uploadSingle,createService);
router.put('/change-service-status/:id',changeServiceStatus);
router.get('/services',getAllServices);
router.get('/active-services',getActiveServices);
router.put('/edit-service/:id', uploadSingle, updateService);

router.post('/add-booking',createBooking);
router.put('/edit-booking/:id',editBooking);
router.delete('/delete-booking/:id',deleteBooking);
router.get('/bookings',getAllBookings);
router.put('/accept-booking/:id',acceptBookingByAdmin);
router.put('/visited-booking/:id',updateVisitedStatus);

router.get('/branches', getAllBranches);
router.post('/branch', saveBranch); // Create a new branch
router.get('/branch/:id', getBranchById); // Get branch by ID
router.put('/branch/:id', updateBranch); // Update a branch by ID
router.delete('/branch/:id', removeBranch); // Remove a branch (soft delete)
router.get('/branches/admin/:adminId', getBranchesByAdminId);



export default router;
 
