import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { HiShieldCheck, HiMail, HiLockClosed } from 'react-icons/hi';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      const res = await API.post('/auth/login', form);
      login(res.data.token, res.data.user);
      toast.success('Welcome back!');
      navigate(res.data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 relative">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-sky-500/6 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-indigo-500/6 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative w-full max-w-md animate-fadeInUp">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-18 h-18 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 mb-5 shadow-xl shadow-sky-500/20">
            <HiShieldCheck className="text-4xl text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome <span className="gradient-text">Back</span>
          </h1>
          <p className="text-slate-500 mt-2">Sign in to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="card !p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Email</label>
            <div className="relative">
              <HiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="email" className="input-field !pl-10" placeholder="you@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
            <div className="relative">
              <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="password" className="input-field !pl-10" placeholder="••••••••"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="btn-primary w-full !py-3.5 text-base" disabled={loading}>
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
          </button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
            <div className="relative flex justify-center text-xs"><span className="px-3 bg-dark-card text-slate-600">or</span></div>
          </div>

          <p className="text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-sky-400 hover:text-sky-300 font-semibold transition-colors">Sign Up</Link>
          </p>
        </form>

        {/* Demo credentials */}
        <div className="mt-6 card !p-4 !bg-sky-500/5 !border-sky-500/15">
          <p className="text-xs font-semibold text-sky-400 mb-2">Demo Credentials</p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-slate-500 mb-0.5">Admin</p>
              <p className="text-slate-300 font-mono">admin@healthinsure.com</p>
              <p className="text-slate-400 font-mono">admin123</p>
            </div>
            <div>
              <p className="text-slate-500 mb-0.5">User</p>
              <p className="text-slate-300 font-mono">user@healthinsure.com</p>
              <p className="text-slate-400 font-mono">user123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
