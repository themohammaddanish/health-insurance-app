import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { HiUserAdd, HiUser, HiMail, HiLockClosed } from 'react-icons/hi';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill all fields');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await API.post('/auth/register', { name: form.name, email: form.email, password: form.password });
      login(res.data.token, res.data.user);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-indigo-500/6 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-sky-500/6 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative w-full max-w-md animate-fadeInUp">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-18 h-18 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-5 shadow-xl shadow-indigo-500/20">
            <HiUserAdd className="text-4xl text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Create <span className="gradient-text">Account</span>
          </h1>
          <p className="text-slate-500 mt-2">Join HealthGuard for AI-powered insurance</p>
        </div>

        <form onSubmit={handleSubmit} className="card !p-8 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Full Name</label>
            <div className="relative">
              <HiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="text" className="input-field !pl-10" placeholder="John Doe"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
          </div>
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
              <input type="password" className="input-field !pl-10" placeholder="Minimum 6 characters"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Confirm Password</label>
            <div className="relative">
              <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="password" className="input-field !pl-10" placeholder="••••••••"
                value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="btn-primary w-full !py-3.5 text-base" disabled={loading}>
            <span>{loading ? 'Creating account...' : 'Create Account'}</span>
          </button>
          <p className="text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-sky-400 hover:text-sky-300 font-semibold transition-colors">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
