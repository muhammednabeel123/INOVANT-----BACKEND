import { createProduct, deleteProduct, getAllProducts, getProductById, deleteProductImage, updateProductById, topPicksToggle, todaySpclToggle, getTopPicksProducts, getTodaySpecialProducts, getAllProductsByUserId, } from './controller/ProductController';
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
import { verifyToken, verifyRole } from './config/auth.middleware'

router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);

router.post('/add-products', verifyToken, verifyRole('admin'), upload, createProduct);
router.delete('/products/:id', verifyToken, verifyRole('admin'), deleteProduct);
router.delete('/products/:id/images/:imageId', verifyToken, verifyRole('admin'), deleteProductImage);
router.put('/edit-products/:id', verifyToken, verifyRole('admin'), upload, updateProductById);

router.post('/add-type', verifyToken, verifyRole('admin'), upload, createType);
router.post('/delete-type', verifyToken, verifyRole('admin'), deleteType);

router.get('/admins', verifyToken, verifyRole('admin'), getAllAdmins);
router.post('/admin', verifyToken, verifyRole('admin'), saveAdmin);
router.get('/admin/:id', verifyToken, verifyRole('admin'), getAdminById);
router.delete('/admins/:id', verifyToken, verifyRole('admin'), removeAdmin);

router.delete('/user/:id', verifyToken, verifyRole('admin'), removeUser);
router.get('/users',verifyToken, verifyRole('admin'), getAllUsers);
router.patch('/user',verifyToken, verifyRole('admin'), updateUser);

router.post('/admin/send-otp', adminSendOtp);
router.post('/admin/verify-otp', adminVerifyOtp);

router.get('/products/user/:userId', getAllProductsByUserId);
router.put('/top-picks-toggle/:id', topPicksToggle);
router.put('/today-spcl-toggle/:id', todaySpclToggle);
router.get('/top-picks', getTopPicksProducts);
router.get('/today-spcl', getTodaySpecialProducts);
router.get('/types', getAllTypes);

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

router.post('/add-to-cart',verifyToken, verifyRole('user'), createOrder);
router.post('/order/item',verifyToken, verifyRole('user'), addItemToOrder);
router.get('/order/:orderId',verifyToken, verifyRole('user'),  getOrderDetails);
router.post('/order/checkout',verifyToken, verifyRole('user'), checkout);
router.delete('/order/:orderId',verifyToken, verifyRole('user'), cancelOrder);
router.delete('/order/item/:orderItemId',verifyToken, verifyRole('user'), removeItemFromCart);
router.get('/orders',verifyToken, verifyRole('admin'), getAllOrders);
router.get('/orders/:userId',verifyToken, verifyRole('user'), getOrdersByUserId);
router.post('/orders/:orderId',verifyToken, verifyRole('user'), updateOrder);

router.get('/get-status',verifyToken, verifyRole('admin'), listStatus)

router.post('/add-service', verifyToken, verifyRole('admin'), uploadSingle, createService);
router.put('/change-service-status/:id', verifyToken, verifyRole('admin'), changeServiceStatus);
router.get('/services', verifyToken, verifyRole('admin'), getAllServices);
router.get('/active-services', verifyToken, verifyRole('admin'), getActiveServices);
router.put('/edit-service/:id', verifyToken, verifyRole('admin'), uploadSingle, updateService);

router.post('/add-booking', verifyToken, verifyRole('user'), createBooking);
router.put('/edit-booking/:id', verifyToken, verifyRole('admin'), editBooking);
router.delete('/delete-booking/:id', verifyToken, verifyRole('admin'), deleteBooking);
router.get('/bookings', verifyToken, verifyRole('admin'), getAllBookings);
router.put('/accept-booking/:id', verifyToken, verifyRole('admin'), acceptBookingByAdmin);
router.put('/visited-booking/:id', verifyToken, verifyRole('admin'), updateVisitedStatus);

router.get('/branches', verifyToken, verifyRole('admin'), getAllBranches);
router.post('/branch', verifyToken, verifyRole('admin'), saveBranch);
router.get('/branch/:id', verifyToken, verifyRole('admin'), getBranchById);
router.put('/branch/:id', verifyToken, verifyRole('admin'), updateBranch); 
router.delete('/branch/:id', verifyToken, verifyRole('admin'), removeBranch); 
router.get('/branches/admin/:adminId', verifyToken, verifyRole('admin'), getBranchesByAdminId);



export default router;
