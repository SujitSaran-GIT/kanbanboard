import { verifyToken } from "../config/jwt.js";
import UserModel from "../models/UserModel.js";


const protect = async (req, res, next) => {
  try {
    let token;
    // console.log('Headers:', req.headers);

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      // console.log('Extracted token:', token);
    }

    if (!token) {
      console.log('No token found');
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided',
      });
    }

    const decoded = verifyToken(token);
    // console.log('Decoded token:', decoded);

    const user = await UserModel.findById(decoded.id).select('-password');
    // console.log('Found user:', user);

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed',
    });
  }
};


export { protect };