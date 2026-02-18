import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import { HiUser, HiMail, HiCalendar, HiShieldCheck } from 'react-icons/hi';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/user/profile');
        setProfile(res.data.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full"></div></div>;
  }

  const info = profile || user;

  return (
    <div className="py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 animate-fadeInUp">
          <h1 className="text-3xl font-bold">My <span className="gradient-text">Profile</span></h1>
          <p className="text-slate-400 mt-1">Your account information</p>
        </div>

        <div className="card !p-8 animate-fadeInUp">
          {/* Avatar */}
          <div className="flex items-center gap-5 mb-8 pb-8 border-b border-slate-700">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white">
              {info?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{info?.name}</h2>
              <span className={`inline-flex items-center gap-1 mt-1 px-3 py-1 rounded-lg text-xs font-medium ${
                info?.role === 'admin'
                  ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                  : 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
              }`}>
                <HiShieldCheck /> {info?.role?.charAt(0).toUpperCase() + info?.role?.slice(1)}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                <HiUser className="text-sky-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Full Name</p>
                <p className="font-medium">{info?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                <HiMail className="text-sky-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Email Address</p>
                <p className="font-medium">{info?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                <HiShieldCheck className="text-sky-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Role</p>
                <p className="font-medium capitalize">{info?.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                <HiCalendar className="text-sky-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Member Since</p>
                <p className="font-medium">{info?.created_at ? new Date(info.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
