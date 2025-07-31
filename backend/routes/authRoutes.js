import express from 'express';
import { login, logout, register, validate } from '../controllers/authController.js';
import { addGuardianHeaders } from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/register',addGuardianHeaders, register);         
router.post('/login',addGuardianHeaders, login); 
router.post('/validate',addGuardianHeaders, validate)          
router.post("/logout", addGuardianHeaders, logout)    

export default router;