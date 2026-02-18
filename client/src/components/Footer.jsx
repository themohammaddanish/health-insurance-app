import { Link } from 'react-router-dom';
import { HiShieldCheck } from 'react-icons/hi';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  const footerLinks = {
    Company: [
      { label: 'About Us', to: '/about' },
      { label: 'Insurance Plans', to: '/plans' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Contact', to: '/contact' },
    ],
    Services: [
      { label: 'AI Premium Prediction' },
      { label: 'Health Coverage' },
      { label: 'Family Plans' },
      { label: 'Senior Care' },
    ],
  };

  return (
    <footer className="relative border-t border-slate-800/50">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-950/80 pointer-events-none"></div>
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center">
                <HiShieldCheck className="text-lg text-white" />
              </div>
              <span className="text-lg font-bold">
                <span className="text-white">Health</span>
                <span className="gradient-text">Guard</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-5">
              Protecting your health with AI-powered insurance solutions. Smart coverage for a smarter future.
            </p>
            <div className="flex gap-2.5">
              {[FaFacebook, FaTwitter, FaLinkedin, FaInstagram].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-slate-800/80 flex items-center justify-center text-slate-500 hover:text-sky-400 hover:bg-slate-800 hover:scale-110 transition-all">
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-5">Company</h4>
            <ul className="space-y-3">
              {footerLinks.Company.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-slate-500 hover:text-sky-400 text-sm transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-5">Services</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              {footerLinks.Services.map((item) => (
                <li key={item.label}>{item.label}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-5">Contact</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li className="hover:text-slate-400 transition-colors">support@healthguard.com</li>
              <li className="hover:text-slate-400 transition-colors">+1 (800) 555-0199</li>
              <li>123 Insurance Ave, Suite 100</li>
              <li>New York, NY 10001</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-600 text-sm">&copy; {new Date().getFullYear()} HealthGuard. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-600 hover:text-slate-400 text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-600 hover:text-slate-400 text-sm transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
