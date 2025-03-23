import express from 'express';
import { register, login, changePassword, getProfile, logout, sendVerification, verifyEmail } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/change-password', protect, changePassword);
router.get('/profile', protect, getProfile);
router.post('/send-verification', protect, sendVerification);
router.post('/verify', protect, verifyEmail);

export default router;
