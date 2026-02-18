import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { HiCheck, HiArrowRight, HiSparkles } from 'react-icons/hi';
import { Link } from 'react-router-dom';

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await API.get('/admin/plans');
        setPlans(res.data.plans);
      } catch {
        setPlans([
          { id: 1, plan_name: 'Basic Shield', coverage_amount: 100000, base_price: 2500, description: 'Essential coverage for individuals. Includes basic hospitalization, outpatient care, and emergency services.' },
          { id: 2, plan_name: 'Family Guardian', coverage_amount: 500000, base_price: 7500, description: 'Comprehensive family coverage. Covers hospitalization, maternity, dental, and vision for up to 5 family members.' },
          { id: 3, plan_name: 'Premium Elite', coverage_amount: 1000000, base_price: 15000, description: 'Our best plan with unlimited coverage. Includes international treatment, specialist consultations, and wellness programs.' },
          { id: 4, plan_name: 'Senior Care Plus', coverage_amount: 300000, base_price: 5000, description: 'Tailored for individuals aged 55+. Covers chronic conditions, physiotherapy, home nursing, and prescription drugs.' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const planFeatures = {
    'Basic Shield': ['Hospitalization', 'Emergency Care', 'Outpatient Visits', 'Prescription Drugs'],
    'Family Guardian': ['Everything in Basic', 'Maternity Coverage', 'Dental & Vision', 'Up to 5 Members'],
    'Premium Elite': ['Everything in Family', 'International Coverage', 'Wellness Programs', 'Dedicated Advisor'],
    'Senior Care Plus': ['Chronic Conditions', 'Physiotherapy', 'Home Nursing', 'Rx Drug Coverage'],
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full"></div></div>;
  }

  const popular = 'Premium Elite';

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fadeInUp">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold mb-8">
            <HiSparkles /> Transparent Pricing
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-5 tracking-tight">
            Choose Your <span className="gradient-text">Perfect Plan</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Flexible coverage options designed for every stage of life. All plans include our AI-powered premium prediction.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map((plan, i) => {
            const isPopular = plan.plan_name === popular;
            const features = planFeatures[plan.plan_name] || ['Full Coverage', 'AI Prediction', '24/7 Support', 'No Hidden Fees'];

            return (
              <div
                key={plan.id}
                className={`card !p-6 flex flex-col animate-fadeInUp relative ${isPopular ? '!border-sky-500/40 ring-1 ring-sky-500/20' : ''}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full text-xs font-bold text-white shadow-lg shadow-sky-500/30">
                    Most Popular
                  </div>
                )}

                <div className="mb-5">
                  <h3 className="text-lg font-bold mb-1">{plan.plan_name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{plan.description}</p>
                </div>

                <div className="mb-5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold gradient-text">NPR {parseFloat(plan.base_price).toLocaleString()}</span>
                    <span className="text-sm text-slate-500">/year</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">Up to NPR {parseFloat(plan.coverage_amount).toLocaleString()} coverage</p>
                </div>

                <div className="space-y-2.5 mb-6 flex-1">
                  {features.map((f, j) => (
                    <div key={j} className="flex items-center gap-2.5">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center ${isPopular ? 'bg-sky-500/15 text-sky-400' : 'bg-slate-800 text-slate-400'}`}>
                        <HiCheck className="text-xs" />
                      </div>
                      <span className="text-sm text-slate-300">{f}</span>
                    </div>
                  ))}
                </div>

                <Link to="/signup" className={`${isPopular ? 'btn-primary' : 'btn-secondary'} w-full justify-center !py-3 group`}>
                  <span>Get Started</span>
                  <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 animate-fadeInUp">
          <p className="text-slate-400 mb-4">Need a custom plan for your organization?</p>
          <Link to="/contact" className="text-sky-400 hover:text-sky-300 font-semibold transition-colors inline-flex items-center gap-2">
            Contact our sales team <HiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}
