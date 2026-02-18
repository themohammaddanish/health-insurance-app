import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import {
  HiUsers,
  HiChartBar,
  HiClipboardList,
  HiCollection,
} from "react-icons/hi";

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/admin/analytics");
        setAnalytics(res.data.analytics);
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

  const stats = [
    {
      icon: HiUsers,
      label: "Total Users",
      value: analytics?.total_users || 0,
      color: "from-sky-500/20 to-blue-600/20",
    },
    {
      icon: HiClipboardList,
      label: "Total Predictions",
      value: analytics?.total_predictions || 0,
      color: "from-indigo-500/20 to-purple-600/20",
    },
    {
      icon: HiCollection,
      label: "Insurance Plans",
      value: analytics?.total_plans || 0,
      color: "from-emerald-500/20 to-teal-600/20",
    },
    {
      icon: HiChartBar,
      label: "Avg Premium",
      value: `NPR ${Math.round(analytics?.avg_premium || 0).toLocaleString()}`,
      color: "from-amber-500/20 to-orange-600/20",
    },
  ];

  const adminLinks = [
    {
      to: "/admin/users",
      icon: HiUsers,
      label: "Manage Users",
      desc: "View and manage all registered users",
    },
    {
      to: "/admin/plans",
      icon: HiCollection,
      label: "Insurance Plans",
      desc: "Create, edit, and delete plans",
    },
    {
      to: "/admin/analytics",
      icon: HiChartBar,
      label: "Analytics",
      desc: "Detailed charts and insights",
    },
  ];

  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 animate-fadeInUp">
          <h1 className="text-3xl font-bold">
            Admin <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-slate-400 mt-1">
            Overview of your health insurance platform
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <div
              key={i}
              className="card animate-fadeInUp"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}
                >
                  <s.icon className="text-xl text-sky-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">{s.label}</p>
                  <p className="text-2xl font-bold">{s.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {adminLinks.map((link, i) => (
            <Link
              key={i}
              to={link.to}
              className="card group !p-6 flex items-center gap-4 hover:border-sky-500/50 transition-all"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <link.icon className="text-2xl text-sky-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{link.label}</h3>
                <p className="text-sm text-slate-400">{link.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Risk Distribution */}
        {analytics?.risk_distribution?.length > 0 && (
          <div className="card animate-fadeInUp">
            <h2 className="text-lg font-semibold mb-4">Risk Distribution</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {analytics.risk_distribution.map((r, i) => (
                <div
                  key={i}
                  className={`rounded-xl p-4 text-center badge-${r.risk_category.toLowerCase()}`}
                >
                  <p className="text-2xl font-bold">{r.count}</p>
                  <p className="text-sm mt-1">{r.risk_category} Risk</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
