import axios from 'axios';

const GUARDIAN_BASE_URL = process.env.GUARDIAN_BASE_URL || 'http://localhost:8084/api/auth';

const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    console.log(email,firstName,lastName,password)
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Email, password, first name, and last name are required'
      });
    }

    const response = await axios.post(`${GUARDIAN_BASE_URL}/signup`, {
      email,
      password,
      firstName,
      lastName
    }, {
      headers: req.guardianHeaders,
      timeout: 10000
    });

    res.status(200).json({
      firstName: firstName,
      lastName: lastName,
      email: email,
      token: response.data,
      message: 'Registration successful'
    });
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data || 'Registration failed';

    if (status === 429) {
      res.set('Retry-After', error.response.headers['retry-after'] || '60');
    }

    res.status(status).json({
      error: 'Registration failed',
      message,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing credentials',
        message: 'Email and password are required'
      });
    }

    const response = await axios.post(`${GUARDIAN_BASE_URL}/login`, {
      email,
      password
    }, {
      headers: req.guardianHeaders,
      timeout: 10000
    });

    res.status(200).json({
      email: email,
      token: response.data,
      message: 'Login successful'
    });
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data || 'Login failed';

    if (status === 429) {
      res.set('Retry-After', error.response.headers['retry-after'] || '60');
    }

    res.status(status).json({
      error: 'Authentication failed',
      message,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


const validate = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        error: 'Missing token',
        message: 'Token is required for validation'
      });
    }

    const response = await axios.post(`${GUARDIAN_BASE_URL}/validate`, {
      token
    }, {
      headers: {
        ...req.guardianHeaders,
        'Authorization': `Bearer ${token}`
      },
      timeout: 10000
    });

    res.status(200).json(response.data);
  } catch (error) {
    const status = error.response?.status || 401;
    const message = error.response?.data || 'Token validation failed';
    
    if (status === 429) {
      res.set('Retry-After', error.response.headers['retry-after'] || '60');
    }
    
    res.status(status).json({ 
      error: 'Validation failed',
      message,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(400).json({
        error: 'Missing token',
        message: 'Authorization token is required'
      });
    }

    await axios.post(`${GUARDIAN_BASE_URL}/logout`, {}, {
      headers: {
        ...req.guardianHeaders,
        'Authorization': `Bearer ${token}`
      },
      timeout: 10000
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data || 'Logout failed';
    
    res.status(status).json({ 
      error: 'Logout failed',
      message,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export { register, login, validate, logout };