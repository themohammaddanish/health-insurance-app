import { Link } from 'react-router-dom';
import { HiShieldCheck, HiLightningBolt, HiChartBar, HiUserGroup, HiHeart, HiClock, HiArrowRight } from 'react-icons/hi';

export default function HomePage() {
  const features = [
    { icon: HiLightningBolt, title: 'AI-Powered Predictions', desc: 'Get instant premium estimates using our advanced machine learning algorithms trained on real health data.', color: 'from-sky-500 to-blue-600' },
    { icon: HiShieldCheck, title: 'Comprehensive Coverage', desc: 'Plans designed for individuals, families, and seniors with full hospital, dental, and vision protection.', color: 'from-indigo-500 to-purple-600' },
    { icon: HiChartBar, title: 'Smart Analytics', desc: 'Track your health metrics and predicted premiums with interactive dashboards and visual insights.', color: 'from-violet-500 to-fuchsia-600' },
    { icon: HiUserGroup, title: 'Family Plans', desc: 'Affordable group coverage for your entire family with flexible add-ons and dependent management.', color: 'from-emerald-500 to-teal-600' },
    { icon: HiHeart, title: 'Wellness Programs', desc: 'Access preventive care, wellness checkups, lifestyle coaching, and mental health support benefits.', color: 'from-rose-500 to-pink-600' },
    { icon: HiClock, title: 'Quick Claims', desc: 'Digital-first claims processing with 24-hour turnaround, real-time tracking, and direct hospital payouts.', color: 'from-amber-500 to-orange-600' },
  ];

  const stats = [
    { value: '50K+', label: 'Happy Customers' },
    { value: '$2B+', label: 'Claims Processed' },
    { value: '99.5%', label: 'Satisfaction Rate' },
    { value: '24/7', label: 'Support Available' },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sky-500/8 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/8 rounded-full blur-[120px]"></div>
          <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px]"></div>
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-32 w-full">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-semibold mb-10 animate-fadeInUp backdrop-blur-sm">
              <HiLightningBolt className="text-lg" />
              <span>AI-Powered Health Insurance Platform</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-[5rem] font-extrabold leading-[1.1] mb-8 animate-fadeInUp tracking-tight" style={{ animationDelay: '0.1s' }}>
              <span className="text-white">Smart Health</span>
              <br />
              <span className="gradient-text">Insurance</span>
              <span className="text-white"> For a</span>
              <br />
              <span className="text-white">Better </span>
              <span className="gradient-text">Future</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              Leverage artificial intelligence to get personalized premium predictions. Protect your family with intelligent plans that adapt to your unique health profile.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
              <Link to="/signup" className="btn-primary text-lg !py-4 !px-10 group">
                <span>Get Started Free</span>
                <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/plans" className="btn-secondary text-lg !py-4 !px-10">
                View Plans
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0f1e] to-transparent"></div>
      </section>

      {/* Stats */}
      <section className="relative py-20 border-y border-slate-800/50">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/3 via-transparent to-indigo-500/3"></div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="text-4xl sm:text-5xl font-extrabold gradient-text mb-2 group-hover:scale-105 transition-transform">{stat.value}</div>
                <div className="text-slate-500 text-sm font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold mb-5 tracking-tight">
              Why Choose <span className="gradient-text">HealthGuard</span>?
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              We combine cutting-edge AI technology with decades of insurance expertise to deliver the best coverage for you.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="card group cursor-default !p-7" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                  style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
                  <f.icon className="text-2xl text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2.5 text-white">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-sky-500/6 rounded-full blur-[100px]"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8">
          <div className="card !p-14 text-center animate-pulse-glow">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-sky-500/25">
              <HiLightningBolt className="text-3xl text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
              Ready to Get Your <span className="gradient-text">AI Prediction</span>?
            </h2>
            <p className="text-slate-400 mb-10 max-w-lg mx-auto text-lg">
              Sign up now and get your personalized health insurance premium prediction powered by machine learning.
            </p>
            <Link to="/signup" className="btn-primary text-lg !py-4 !px-10 group">
              <span>Start Free Prediction</span>
              <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
