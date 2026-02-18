import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";
import toast from "react-hot-toast";
import {
  HiLightningBolt,
  HiChartBar,
  HiShieldCheck,
  HiCheck,
  HiX,
  HiShoppingCart,
} from "react-icons/hi";

const PLANS = [
  {
    name: "Basic Shield",
    coverage: 100000,
    description:
      "Essential coverage — hospitalization, outpatient & emergency.",
  },
  {
    name: "Family Guardian",
    coverage: 500000,
    description:
      "Family coverage — maternity, dental, vision for up to 5 members.",
  },
  {
    name: "Premium Elite",
    coverage: 1000000,
    description:
      "Unlimited coverage — international treatment & wellness programs.",
  },
  {
    name: "Senior Care Plus",
    coverage: 300000,
    description: "For 55+ — chronic conditions, physiotherapy & home nursing.",
  },
];

export default function PredictionPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showPurchase, setShowPurchase] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchased, setPurchased] = useState(null);
  const [form, setForm] = useState({
    age: "",
    gender: "male",
    bmi: "",
    smoker: "0",
    num_dependents: "0",
    region: "northeast",
    existing_conditions: "",
    income_lakhs: "",
    genetical_risk: "0",
    insurance_plan: "1",
    employment_status: "salaried",
    marital_status: "married",
    medical_history: [],
  });

  const MEDICAL_CONDITIONS = [
    "Diabetes",
    "Heart Disease",
    "High Blood Pressure",
    "Thyroid",
    "Asthma",
    "No Disease",
  ];

  const toggleCondition = (condition) => {
    setForm((prev) => {
      if (condition === "No Disease") {
        return {
          ...prev,
          medical_history: ["No Disease"],
          existing_conditions: "",
        };
      }
      let updated = prev.medical_history.filter((c) => c !== "No Disease");
      if (updated.includes(condition)) {
        updated = updated.filter((c) => c !== condition);
      } else {
        updated = [...updated, condition];
      }
      return {
        ...prev,
        medical_history: updated,
        existing_conditions: updated.join(", "),
      };
    });
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePurchase = async () => {
    if (!selectedPlan) {
      toast.error("Please select a plan");
      return;
    }
    setPurchaseLoading(true);
    try {
      const res = await API.post("/user/purchase", {
        prediction_id: result?.id || null,
        plan_name: selectedPlan.name,
        coverage_amount: selectedPlan.coverage,
        premium_amount: parseFloat(result.predicted_premium),
        duration_years: 1,
      });
      setPurchased(res.data.purchase);
      setShowPurchase(false);
      toast.success("Insurance purchased successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Purchase failed");
    } finally {
      setPurchaseLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.age || !form.bmi || !form.income_lakhs) {
      toast.error("Age, BMI, and Income are required");
      return;
    }
    setLoading(true);
    setResult(null);
    setShowPurchase(false);
    setSelectedPlan(null);
    setPurchased(null);
    try {
      const res = await API.post("/user/predict", {
        age: parseInt(form.age),
        gender: form.gender,
        bmi: parseFloat(form.bmi),
        smoker: parseInt(form.smoker),
        num_dependents: parseInt(form.num_dependents),
        region: form.region,
        existing_conditions: form.existing_conditions,
        income_lakhs: parseFloat(form.income_lakhs),
        genetical_risk: parseInt(form.genetical_risk),
        insurance_plan: parseInt(form.insurance_plan),
        employment_status: form.employment_status,
        marital_status: form.marital_status,
      });
      setResult(res.data.prediction);
      toast.success("Premium predicted!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 animate-fadeInUp">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-semibold mb-5">
            <HiLightningBolt /> AI Engine
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Premium <span className="gradient-text">Prediction</span>
          </h1>
          <p className="text-slate-400 mt-1">
            Enter your health information to get an AI-powered estimate
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-3 card !p-8 animate-fadeInUp"
          >
            <h2 className="text-lg font-bold mb-6">Health Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  name="age"
                  className="input-field"
                  placeholder="e.g., 28"
                  value={form.age}
                  onChange={handleChange}
                  min="1"
                  max="120"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  className="input-field"
                  value={form.gender}
                  onChange={handleChange}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  BMI *
                </label>
                <input
                  type="number"
                  name="bmi"
                  className="input-field"
                  placeholder="e.g., 24.5"
                  value={form.bmi}
                  onChange={handleChange}
                  step="0.1"
                  min="10"
                  max="60"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Smoking Status
                </label>
                <select
                  name="smoker"
                  className="input-field"
                  value={form.smoker}
                  onChange={handleChange}
                >
                  <option value="0">No Smoking</option>
                  <option value="1">Occasional</option>
                  <option value="2">Regular</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Dependents
                </label>
                <input
                  type="number"
                  name="num_dependents"
                  className="input-field"
                  placeholder="0"
                  value={form.num_dependents}
                  onChange={handleChange}
                  min="0"
                  max="10"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Income (in Lakhs) *
                </label>
                <input
                  type="number"
                  name="income_lakhs"
                  className="input-field"
                  placeholder="e.g., 5"
                  value={form.income_lakhs}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  max="200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Genetical Risk (0-5)
                </label>
                <input
                  type="number"
                  name="genetical_risk"
                  className="input-field"
                  placeholder="0"
                  value={form.genetical_risk}
                  onChange={handleChange}
                  min="0"
                  max="5"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Insurance Plan
                </label>
                <select
                  name="insurance_plan"
                  className="input-field"
                  value={form.insurance_plan}
                  onChange={handleChange}
                >
                  <option value="1">Bronze</option>
                  <option value="2">Silver</option>
                  <option value="3">Gold</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Employment Status
                </label>
                <select
                  name="employment_status"
                  className="input-field"
                  value={form.employment_status}
                  onChange={handleChange}
                >
                  <option value="salaried">Salaried</option>
                  <option value="self-employed">Self-Employed</option>
                  <option value="freelancer">Freelancer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Marital Status
                </label>
                <select
                  name="marital_status"
                  className="input-field"
                  value={form.marital_status}
                  onChange={handleChange}
                >
                  <option value="married">Married</option>
                  <option value="unmarried">Unmarried</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Region
                </label>
                <select
                  name="region"
                  className="input-field"
                  value={form.region}
                  onChange={handleChange}
                >
                  <option value="northeast">Northeast</option>
                  <option value="southeast">Southeast</option>
                  <option value="southwest">Southwest</option>
                  <option value="northwest">Northwest</option>
                </select>
              </div>
            </div>

            {/* Medical History */}
            <div className="mt-5">
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                Medical History
              </label>
              <div className="flex flex-wrap gap-2">
                {MEDICAL_CONDITIONS.map((condition) => (
                  <button
                    key={condition}
                    type="button"
                    onClick={() => toggleCondition(condition)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                      form.medical_history.includes(condition)
                        ? "bg-sky-500/20 border-sky-500/50 text-sky-300"
                        : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    {form.medical_history.includes(condition) ? "✓ " : ""}
                    {condition}
                  </button>
                ))}
              </div>
              <input
                name="existing_conditions"
                className="input-field mt-3"
                placeholder="Other conditions (optional)"
                value={
                  form.medical_history.includes("No Disease")
                    ? ""
                    : form.existing_conditions
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    existing_conditions: e.target.value,
                    medical_history: form.medical_history.filter(
                      (c) =>
                        !MEDICAL_CONDITIONS.includes(c) || c === "No Disease",
                    ),
                  })
                }
                disabled={form.medical_history.includes("No Disease")}
              />
            </div>
            <button
              type="submit"
              className="btn-primary w-full !py-3.5 mt-8 group"
              disabled={loading}
            >
              <HiLightningBolt />
              <span>{loading ? "Analyzing..." : "Predict Premium"}</span>
            </button>
          </form>

          {/* Result / Placeholder */}
          <div className="lg:col-span-2 space-y-5">
            {result ? (
              <div className="card !p-8 text-center animate-fadeInUp animate-pulse-glow">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center mx-auto mb-5 shadow-xl shadow-sky-500/25">
                  <HiChartBar className="text-3xl text-white" />
                </div>
                <p className="text-sm text-slate-400 mb-1">
                  Predicted Annual Premium
                </p>
                <p className="text-4xl font-extrabold gradient-text mb-4">
                  NPR {parseFloat(result.predicted_premium).toLocaleString()}
                </p>
                <div className="inline-block mb-6">
                  <span
                    className={`badge-${result.risk_category.toLowerCase()} text-sm px-4 py-1.5 rounded-lg`}
                  >
                    {result.risk_category} Risk
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-left">
                  <div className="bg-slate-800/50 rounded-xl p-3">
                    <p className="text-xs text-slate-500">Age</p>
                    <p className="font-semibold">{form.age}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-3">
                    <p className="text-xs text-slate-500">BMI</p>
                    <p className="font-semibold">{form.bmi}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-3">
                    <p className="text-xs text-slate-500">Smoking</p>
                    <p className="font-semibold">
                      {form.smoker === "0"
                        ? "None"
                        : form.smoker === "1"
                          ? "Occasional"
                          : "Regular"}
                    </p>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-3">
                    <p className="text-xs text-slate-500">Income</p>
                    <p className="font-semibold">{form.income_lakhs}L</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-3">
                    <p className="text-xs text-slate-500">Genetical Risk</p>
                    <p className="font-semibold">{form.genetical_risk}/5</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-3">
                    <p className="text-xs text-slate-500">Plan</p>
                    <p className="font-semibold">
                      {form.insurance_plan === "1"
                        ? "Bronze"
                        : form.insurance_plan === "2"
                          ? "Silver"
                          : "Gold"}
                    </p>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-3">
                    <p className="text-xs text-slate-500">Employment</p>
                    <p className="font-semibold capitalize">
                      {form.employment_status}
                    </p>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-3">
                    <p className="text-xs text-slate-500">Marital Status</p>
                    <p className="font-semibold capitalize">
                      {form.marital_status}
                    </p>
                  </div>
                </div>

                {/* Why this premium */}
                {result.explanation && (
                  <div className="bg-slate-800/50 rounded-xl p-4 mt-4 text-left">
                    <h4 className="text-sm font-bold text-sky-400 mb-2 flex items-center gap-1.5">
                      📊 Why this premium?
                    </h4>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {result.explanation}
                    </p>
                  </div>
                )}

                {/* Why you should get insured */}
                {result.recommendation && (
                  <div className="bg-gradient-to-br from-sky-500/10 to-indigo-500/10 border border-sky-500/20 rounded-xl p-4 mt-3 text-left">
                    <h4 className="text-sm font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
                      💡 Why you should get insured
                    </h4>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {result.recommendation}
                    </p>
                  </div>
                )}

                {/* Buy Insurance Button */}
                {!purchased && (
                  <button
                    onClick={() => setShowPurchase(true)}
                    className="btn-primary w-full !py-3.5 mt-5 group"
                  >
                    <HiShoppingCart className="text-lg" />
                    <span>Buy Insurance Now</span>
                  </button>
                )}

                {/* Purchase Success */}
                {purchased && (
                  <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-xl p-5 mt-5 text-left animate-fadeInUp">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <HiCheck className="text-emerald-400 text-lg" />
                      </div>
                      <h4 className="font-bold text-emerald-400">
                        Purchase Confirmed!
                      </h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Plan</span>
                        <span className="font-semibold text-white">
                          {purchased.plan_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Coverage</span>
                        <span className="font-semibold text-white">
                          NPR{" "}
                          {parseFloat(
                            purchased.coverage_amount,
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Annual Premium</span>
                        <span className="font-semibold text-sky-400">
                          NPR{" "}
                          {parseFloat(
                            purchased.premium_amount,
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Duration</span>
                        <span className="font-semibold text-white">
                          {purchased.duration_years} Year
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Status</span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase">
                          {purchased.status}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="card !p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-5">
                  <HiShieldCheck className="text-3xl text-slate-600" />
                </div>
                <h3 className="font-bold mb-2 text-slate-300">
                  Your Prediction
                </h3>
                <p className="text-sm text-slate-500">
                  Fill in your health details and click "Predict Premium" to get
                  your AI-powered insurance estimate.
                </p>
              </div>
            )}

            {/* Info box */}
            <div className="card !p-5 !bg-sky-500/5 !border-sky-500/15">
              <h4 className="text-sm font-bold text-sky-400 mb-2">
                How it works
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-sky-400 mt-0.5">•</span>
                  Our AI analyzes your health profile
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-400 mt-0.5">•</span>
                  Selects the right model based on your age
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-400 mt-0.5">•</span>
                  Predictions are saved to your history
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {showPurchase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowPurchase(false)}
          />
          <div className="relative bg-slate-900 border border-slate-700/50 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 animate-fadeInUp shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold">Choose a Plan</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Your predicted premium:{" "}
                  <span className="text-sky-400 font-semibold">
                    NPR {parseFloat(result.predicted_premium).toLocaleString()}
                  </span>
                  /year
                </p>
              </div>
              <button
                onClick={() => setShowPurchase(false)}
                className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <HiX className="text-xl text-slate-400" />
              </button>
            </div>

            {/* Plan Cards */}
            <div className="space-y-3 mb-6">
              {PLANS.map((plan) => (
                <div
                  key={plan.name}
                  onClick={() => setSelectedPlan(plan)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedPlan?.name === plan.name
                      ? "border-sky-500 bg-sky-500/10 shadow-lg shadow-sky-500/10"
                      : "border-slate-700/50 bg-slate-800/50 hover:border-slate-600"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-white">{plan.name}</h4>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPlan?.name === plan.name
                          ? "border-sky-500 bg-sky-500"
                          : "border-slate-600"
                      }`}
                    >
                      {selectedPlan?.name === plan.name && (
                        <HiCheck className="text-xs text-white" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mb-2">
                    {plan.description}
                  </p>
                  <p className="text-sm font-semibold text-sky-400">
                    Coverage: NPR {plan.coverage.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Summary & Confirm */}
            {selectedPlan && (
              <div className="bg-slate-800/50 rounded-xl p-4 mb-4 animate-fadeInUp">
                <h4 className="text-sm font-bold text-slate-300 mb-3">
                  Order Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Plan</span>
                    <span className="font-semibold">{selectedPlan.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Coverage</span>
                    <span className="font-semibold">
                      NPR {selectedPlan.coverage.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Annual Premium</span>
                    <span className="font-semibold text-sky-400">
                      NPR{" "}
                      {parseFloat(result.predicted_premium).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Duration</span>
                    <span className="font-semibold">1 Year</span>
                  </div>
                  <hr className="border-slate-700 my-2" />
                  <div className="flex justify-between text-base">
                    <span className="font-bold">Total</span>
                    <span className="font-extrabold gradient-text">
                      NPR{" "}
                      {parseFloat(result.predicted_premium).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handlePurchase}
              disabled={!selectedPlan || purchaseLoading}
              className="btn-primary w-full !py-3.5 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <HiShoppingCart className="text-lg" />
              <span>
                {purchaseLoading ? "Processing..." : "Confirm Purchase"}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
