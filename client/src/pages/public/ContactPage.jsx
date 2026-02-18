import { useState } from 'react';
import toast from 'react-hot-toast';
import { HiMail, HiPhone, HiLocationMarker, HiPaperAirplane } from 'react-icons/hi';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill all required fields');
      return;
    }
    toast.success('Message sent! We\'ll get back to you within 24 hours.');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    { icon: HiMail, title: 'Email', value: 'support@healthguard.com', sub: 'We respond within 24 hours', color: 'from-sky-500 to-blue-600' },
    { icon: HiPhone, title: 'Phone', value: '+1 (800) 555-0199', sub: 'Mon-Fri, 9am - 6pm EST', color: 'from-emerald-500 to-teal-600' },
    { icon: HiLocationMarker, title: 'Office', value: '123 Insurance Ave, Suite 100', sub: 'New York, NY 10001', color: 'from-indigo-500 to-purple-600' },
  ];

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fadeInUp">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-semibold mb-8">
            <HiMail /> Get in Touch
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-5 tracking-tight">
            Contact <span className="gradient-text">Us</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            Have a question? We'd love to hear from you.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {contactInfo.map((c, i) => (
            <div key={i} className="card !p-6 text-center group animate-fadeInUp" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 bg-gradient-to-br ${c.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <c.icon className="text-2xl text-white" />
              </div>
              <h3 className="font-bold mb-1">{c.title}</h3>
              <p className="text-sky-400 text-sm font-medium">{c.value}</p>
              <p className="text-xs text-slate-500 mt-1">{c.sub}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="card !p-8 space-y-5 animate-fadeInUp">
            <h2 className="text-xl font-bold mb-2">Send a <span className="gradient-text">Message</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Name *</label>
                <input className="input-field" placeholder="Your name"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Email *</label>
                <input type="email" className="input-field" placeholder="you@example.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Subject</label>
              <input className="input-field" placeholder="What's this about?"
                value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Message *</label>
              <textarea className="input-field resize-none" rows="5" placeholder="Tell us how we can help..."
                value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
            </div>
            <button type="submit" className="btn-primary w-full !py-3.5 group">
              <span>Send Message</span>
              <HiPaperAirplane className="rotate-90 group-hover:translate-y-[-2px] transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
