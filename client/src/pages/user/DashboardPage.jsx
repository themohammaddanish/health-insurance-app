import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";
import {
  HiLightningBolt,
  HiClipboardList,
  HiChartBar,
  HiUser,
  HiArrowRight,
} from "react-icons/hi";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    avgPremium: 0,
    lastRisk: "N/A",
  });
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/user/predictions");
        const preds = res.data.predictions || [];
        setPredictions(preds.slice(0, 5));
        if (preds.length > 0) {
          const avg =
            preds.reduce((a, p) => a + parseFloat(p.predicted_premium), 0) /
            preds.length;
          setStats({
            total: preds.length,
            avgPremium: Math.round(avg),
            lastRisk: preds[0].risk_category,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const statCards = [
    {
      icon: HiClipboardList,
      label: "Predictions",
      value: stats.total,
      color: "from-sky-500 to-blue-600",
    },
    {
      icon: HiChartBar,
      label: "Avg Premium",
      value: `NPR ${stats.avgPremium.toLocaleString()}`,
      color: "from-indigo-500 to-purple-600",
    },
    {
      icon: HiLightningBolt,
      label: "Last Risk",
      value: stats.lastRisk,
      color: "from-amber-500 to-orange-600",
    },
  ];

  const quickActions = [
    {
      to: "/predict",
      icon: HiLightningBolt,
      label: "New Prediction",
      desc: "Get an AI premium estimate",
      color: "from-sky-500 to-blue-600",
    },
    {
      to: "/history",
      icon: HiChartBar,
      label: "View History",
      desc: "See your past predictions",
      color: "from-indigo-500 to-purple-600",
    },
    {
      to: "/profile",
      icon: HiUser,
      label: "My Profile",
      desc: "Manage your account",
      color: "from-emerald-500 to-teal-600",
    },
  ];

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Welcome */}
        <div className="mb-10 animate-fadeInUp">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back,{" "}
            <span className="gradient-text">{user?.name || "User"}</span>
          </h1>
          <p className="text-slate-400 mt-1">
            Here's your health insurance overview
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          {statCards.map((s, i) => (
            <div
              key={i}
              className="card !p-5 animate-fadeInUp"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg`}
                >
                  <s.icon className="text-xl text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                    {s.label}
                  </p>
                  <p className="text-2xl font-bold mt-0.5">{s.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {quickActions.map((a, i) => (
            <Link
              key={i}
              to={a.to}
              className="card group !p-6 flex items-center gap-4 hover:!border-sky-500/30 animate-fadeInUp"
              style={{ animationDelay: `${i * 0.1 + 0.3}s` }}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
              >
                <a.icon className="text-xl text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{a.label}</h3>
                <p className="text-xs text-slate-500">{a.desc}</p>
              </div>
              <HiArrowRight className="text-slate-600 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>

        {/* Recent Predictions */}
        <div
          className="card animate-fadeInUp"
          style={{ animationDelay: "0.5s" }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold">Recent Predictions</h2>
            {predictions.length > 0 && (
              <Link
                to="/history"
                className="text-sm text-sky-400 hover:text-sky-300 font-medium transition-colors inline-flex items-center gap-1"
              >
                View all <HiArrowRight />
              </Link>
            )}
          </div>
          {predictions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800/80 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="text-left py-3 px-3">Date</th>
                    <th className="text-left py-3 px-3">Age</th>
                    <th className="text-left py-3 px-3">BMI</th>
                    <th className="text-left py-3 px-3">Smoker</th>
                    <th className="text-left py-3 px-3">Premium</th>
                    <th className="text-left py-3 px-3">Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-slate-800/40 hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-3 px-3 text-slate-400">
                        {new Date(p.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3">{p.age}</td>
                      <td className="py-3 px-3">{p.bmi}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-xs font-medium ${p.smoker ? "text-red-400" : "text-emerald-400"}`}
                        >
                          {p.smoker ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-sky-400">
                        NPR {parseFloat(p.predicted_premium).toLocaleString()}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`badge-${p.risk_category.toLowerCase()} text-xs rounded-lg px-2.5 py-1`}
                        >
                          {p.risk_category}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <HiLightningBolt className="text-4xl text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500 mb-4">No predictions yet</p>
              <Link to="/predict" className="btn-primary !text-sm">
                <span>Make Your First Prediction</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
