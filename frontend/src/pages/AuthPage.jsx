import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, register } from '../redux/slices/authSlice';
import ThreeBackground from '../components/ui/ThreeBackground';

const palette = ['#F75A5A', '#FFA955', '#FFD63A', '#6DE1D2'];

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector(state => state.auth);

  React.useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      await dispatch(login({ email: form.email, password: form.password }));
    } else {
      await dispatch(register({ name: form.name, email: form.email, password: form.password }));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <ThreeBackground/>
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl w-full max-w-md relative z-10">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold text-white" style={{background: `linear-gradient(135deg, ${palette[0]}, ${palette[1]})`}}>
          K
        </div>
        <h1 className="text-3xl font-bold text-center mb-2" style={{color: palette[2]}}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-white/70 text-center mb-6">
          {isLogin ? 'Sign in to your account' : 'Join KanbanFlow today'}
        </p>
        {error && <div className="text-red-400 text-center mb-4">{error}</div>}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#6DE1D2]"
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#6DE1D2]"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#6DE1D2]"
            required
          />
          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold text-white text-lg transition-all disabled:opacity-60"
            style={{background: `linear-gradient(90deg, ${palette[0]}, ${palette[1]}, ${palette[2]}, ${palette[3]})`}}
            disabled={loading}
          >
            {loading ? (isLogin ? 'Signing In...' : 'Creating Account...') : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>
        <div className="text-center mt-6">
          <p className="text-white/70">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
          </p>
          <button
            onClick={() => setIsLogin(l => !l)}
            className="text-[#6DE1D2] hover:text-[#F75A5A] font-medium transition-colors duration-200"
          >
            {isLogin ? 'Sign up here' : 'Sign in here'}
          </button>
        </div>
      </div>
    </div>
  );
} 