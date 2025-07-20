import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, className = '', ...props }) => (
  <motion.button
    whileHover={{ scale: 1.07, backgroundColor: '#6DE1D2', color: '#fff' }}
    whileTap={{ scale: 0.96 }}
    className={`px-5 py-2 rounded-xl font-semibold bg-[#FFA955] text-white shadow-lg border border-white/30 backdrop-blur-lg transition-all ${className}`}
    style={{
      background: 'linear-gradient(90deg, #F75A5A 0%, #FFA955 100%)',
      boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.18)',
    }}
    onClick={onClick}
    {...props}
  >
    {children}
  </motion.button>
);

export default Button; 