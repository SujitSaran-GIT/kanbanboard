import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);

  const getUserInitials = (email, name) => {
    // First check if name exists and has at least 2 characters
    if (name && name.trim().length >= 2) {
      return name.substring(0, 2).toUpperCase();
    }
    
    // Then check if email exists and has at least 2 characters
    if (email && email.trim().length >= 2) {
      return email.substring(0, 2).toUpperCase();
    }
    
    // Default fallback
    return 'U';
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth');
  };

  return (
    <nav className="w-full z-20 px-4 py-3 flex items-center justify-between bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0">
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-lg text-white" style={{background: 'linear-gradient(135deg, #F75A5A 0%, #FFA955 100%)'}}>
          K
        </div>
        <span className="text-xl font-bold text-white tracking-wide" style={{color: '#FFD63A'}}>KanbanFlow</span>
      </div>
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <div className="flex items-center space-x-2 bg-[#FFD63A]/20 px-3 py-1 rounded-full">
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-white" style={{background: 'linear-gradient(135deg, #6DE1D2 0%, #FFA955 100%)'}}>
                {getUserInitials(user.email, user.name)}
              </div>
              <span className="text-white/80 text-sm font-medium hidden md:block">{user.name || user.email}</span>
            </div>
            <button onClick={handleLogout} className="bg-[#F75A5A] hover:bg-[#FFA955] text-white px-4 py-2 rounded-lg font-semibold transition-colors">Logout</button>
          </>
        ) : (
          <button onClick={() => navigate('/auth')} className="bg-[#6DE1D2] hover:bg-[#FFD63A] text-white px-4 py-2 rounded-lg font-semibold transition-colors">Login / Register</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 