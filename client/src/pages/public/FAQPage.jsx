import { useState } from 'react';
import { HiChevronDown, HiQuestionMarkCircle } from 'react-icons/hi';

export default function FAQPage() {
  const [open, setOpen] = useState(null);

  const faqs = [
    { q: 'How does the AI premium prediction work?', a: 'Our machine learning algorithm analyzes your health data including age, BMI, smoking status, number of dependents, and region. It uses trained models on real insurance data to predict your personalized premium with high accuracy.' },
    { q: 'Is my personal health data secure?', a: 'Absolutely. We use industry-standard encryption (AES-256) and JWT-based authentication. Your data is never shared with third parties and is stored in secure, encrypted databases with regular backups.' },
    { q: 'What payment methods do you accept?', a: 'We accept all major credit/debit cards, bank transfers, digital wallets (Apple Pay, Google Pay), and offer monthly or annual payment plans with automatic billing.' },
    { q: 'Can I change my plan after purchasing?', a: 'Yes, you can upgrade or downgrade your plan at any time from your dashboard. Changes take effect at the start of your next billing cycle, and any price differences are prorated.' },
    { q: 'How accurate are the AI predictions?', a: 'Our models achieve 95%+ accuracy based on validation data. However, predictions are estimates and your actual premium may vary based on additional underwriting factors and medical history review.' },
    { q: 'Do you cover pre-existing conditions?', a: 'Yes, all our plans cover pre-existing conditions after a standard waiting period. The Premium Elite plan offers immediate coverage with no waiting period for most conditions.' },
    { q: 'How do I file a claim?', a: 'Claims can be filed directly through your dashboard. Upload required documents, and our team processes claims within 24 hours. We also support direct hospital billing for network hospitals.' },
    { q: 'Is there a family discount?', a: 'Yes! Our Family Guardian plan offers multi-member coverage at a discounted group rate. Adding additional family members is significantly cheaper than individual plans.' },
  ];

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16 animate-fadeInUp">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-semibold mb-8">
            <HiQuestionMarkCircle /> Help Center
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-5 tracking-tight">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h1>
          <p className="text-lg text-slate-400">Quick answers to common questions about HealthGuard</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className={`card !p-0 overflow-hidden animate-fadeInUp ${open === i ? '!border-sky-500/25' : ''}`}
              style={{ animationDelay: `${i * 0.05}s` }}>
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left group"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className={`font-semibold text-sm pr-4 transition-colors ${open === i ? 'text-sky-400' : 'text-slate-200 group-hover:text-white'}`}>
                  {faq.q}
                </span>
                <HiChevronDown className={`text-lg shrink-0 text-slate-500 transition-transform duration-300 ${open === i ? 'rotate-180 text-sky-400' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${open === i ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="px-6 pb-5 text-sm text-slate-400 leading-relaxed border-t border-slate-800/50 pt-4">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
