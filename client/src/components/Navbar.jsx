import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiMenu, HiX, HiShieldCheck } from 'react-icons/hi';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const publicLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/plans', label: 'Plans' },
    { to: '/faq', label: 'FAQ' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:shadow-sky-500/40 transition-shadow">
                <HiShieldCheck className="text-xl text-white" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-white">Health</span>
              <span className="gradient-text">Guard</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {publicLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive(link.to)
                    ? 'text-sky-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {link.label}
                {isActive(link.to) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-gradient-to-r from-sky-400 to-indigo-400 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to={isAdmin ? '/admin' : '/dashboard'}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <div className="w-px h-5 bg-slate-700" />
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium rounded-lg text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary !text-sm !py-2.5 !px-5">
                  <span>Get Started</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-2xl text-slate-300 hover:text-white transition-colors" onClick={() => setOpen(!open)}>
            {open ? <HiX /> : <HiMenu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden py-4 border-t border-slate-800/50 animate-slideDown">
            <div className="space-y-1">
              {publicLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.to) ? 'text-sky-400 bg-sky-400/5' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link to={isAdmin ? '/admin' : '/dashboard'} onClick={() => setOpen(false)}
                    className="block px-4 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white">
                    Dashboard
                  </Link>
                  <button onClick={() => { logout(); setOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-lg">
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-3 pt-3 px-4">
                  <Link to="/login" onClick={() => setOpen(false)} className="btn-secondary !text-sm !py-2.5 flex-1 justify-center">Login</Link>
                  <Link to="/signup" onClick={() => setOpen(false)} className="btn-primary !text-sm !py-2.5 flex-1"><span>Get Started</span></Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
