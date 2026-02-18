import { HiLightningBolt, HiShieldCheck, HiHeart, HiGlobe, HiStar, HiUserGroup } from 'react-icons/hi';

export default function AboutPage() {
  const values = [
    { icon: HiLightningBolt, title: 'Innovation', desc: 'We use cutting-edge AI and machine learning to revolutionize how insurance premiums are calculated and personalized.', color: 'from-sky-500 to-blue-600' },
    { icon: HiShieldCheck, title: 'Trust', desc: 'Built on transparency and reliability. Every prediction is backed by robust data science and actuarial models.', color: 'from-indigo-500 to-purple-600' },
    { icon: HiHeart, title: 'Care', desc: 'Your health is our priority. We design every plan and feature with your well-being at the center.', color: 'from-rose-500 to-pink-600' },
    { icon: HiGlobe, title: 'Accessibility', desc: 'Making quality health insurance available and understandable for everyone, regardless of background.', color: 'from-emerald-500 to-teal-600' },
  ];

  const timeline = [
    { year: '2020', title: 'Founded', desc: 'HealthGuard was born with a vision to democratize health insurance through AI technology.' },
    { year: '2021', title: 'AI Engine Launched', desc: 'Deployed our first machine learning model for premium prediction with 95% accuracy.' },
    { year: '2022', title: '10K Users', desc: 'Reached 10,000 users and processed over $100M in insurance coverage applications.' },
    { year: '2023', title: 'National Expansion', desc: 'Expanded coverage to all 50 states with region-specific plans and pricing models.' },
    { year: '2024', title: 'Family Plans', desc: 'Introduced comprehensive family coverage plans with multi-member AI predictions.' },
    { year: '2025', title: '50K+ Users', desc: 'Surpassed 50,000 users with an industry-leading 99.5% customer satisfaction rate.' },
  ];

  return (
    <div className="pt-24 pb-16">
      {/* Hero */}
      <section className="relative pb-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-indigo-500/6 rounded-full blur-[120px]"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold mb-8 animate-fadeInUp">
            <HiStar /> Our Story
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            Redefining Health Insurance<br />
            with <span className="gradient-text">Artificial Intelligence</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            We believe everyone deserves transparent, personalized health coverage. Our AI analyzes your unique profile to recommend the perfect plan at the fairest price.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Core <span className="gradient-text">Values</span></h2>
            <p className="text-slate-400 max-w-xl mx-auto">The principles that guide every decision we make</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <div key={i} className="card group !p-7 flex gap-5 animate-fadeInUp" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={`w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br ${v.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <v.icon className="text-2xl text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">{v.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Stats */}
      <section className="py-16 border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: HiUserGroup, value: '120+', label: 'Team Members' },
              { icon: HiGlobe, value: '50', label: 'States Covered' },
              { icon: HiShieldCheck, value: '4', label: 'Plan Types' },
              { icon: HiStar, value: '4.9/5', label: 'User Rating' },
            ].map((s, i) => (
              <div key={i} className="text-center group">
                <s.icon className="text-2xl text-sky-400 mx-auto mb-3" />
                <p className="text-3xl font-extrabold gradient-text mb-1">{s.value}</p>
                <p className="text-slate-500 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">Our <span className="gradient-text">Journey</span></h2>
          <div className="space-y-0 relative">
            <div className="absolute left-[27px] top-4 bottom-4 w-px bg-gradient-to-b from-sky-500/50 via-indigo-500/50 to-transparent"></div>
            {timeline.map((item, i) => (
              <div key={i} className="flex gap-6 animate-fadeInUp pb-10 last:pb-0" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 border border-sky-500/20 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-sky-400">{item.year}</span>
                  </div>
                </div>
                <div className="pt-2">
                  <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
