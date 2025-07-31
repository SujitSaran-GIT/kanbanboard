import axios from 'axios';

const GUARDIAN_BASE_URL = process.env.GUARDIAN_BASE_URL || 'http://localhost:8084/api/auth';

const protect = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        message: 'Not authorized, no token provided',
      });
    }

    // Validate token with Guardian
    const response = await axios.post(`${GUARDIAN_BASE_URL}/validate`, {
      token
    }, {
      headers: {
        'X-Client-Id': process.env.GUARDIAN_CLIENT_ID,
        'X-Client-Key': process.env.GUARDIAN_CLIENT_KEY,
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      timeout: 10000
    });

    if (!response.data.valid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
        message: 'Not authorized, invalid token',
      });
    }

    // Attach user information to request
    req.user = {
      id: response.data.userId.toString(), // Convert to string for consistency
      clientId: response.data.clientId,
      sessionId: response.data.sessionId
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    if (error.response?.status === 429) {
      return res.status(429)
        .set('Retry-After', error.response.headers['retry-after'] || '60')
        .json({
          success: false,
          error: 'Rate limited',
          message: 'Too many authentication requests. Please try again later.',
        });
    }

    return res.status(401).json({
      success: false,
      error: 'Authentication failed',
      message: 'Unable to validate authentication token',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const addGuardianHeaders = (req, res, next) => {
  req.guardianHeaders = {
    'X-Client-Id': process.env.GUARDIAN_CLIENT_ID,
    'X-Client-Key': process.env.GUARDIAN_CLIENT_KEY,
    'Content-Type': 'application/json'
  };
  next();
};

export { protect, addGuardianHeaders };