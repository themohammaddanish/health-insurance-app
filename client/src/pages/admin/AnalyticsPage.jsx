import { useState, useEffect } from "react";
import API from "../../api/axios";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await API.get("/admin/analytics");
        setAnalytics(res.data.analytics);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const riskLabels = (analytics?.risk_distribution || []).map(
    (r) => `${r.risk_category} Risk`,
  );
  const riskCounts = (analytics?.risk_distribution || []).map((r) => r.count);

  const doughnutData = {
    labels: riskLabels,
    datasets: [
      {
        data: riskCounts,
        backgroundColor: [
          "rgba(16, 185, 129, 0.7)",
          "rgba(245, 158, 11, 0.7)",
          "rgba(239, 68, 68, 0.7)",
        ],
        borderColor: ["#10b981", "#f59e0b", "#ef4444"],
        borderWidth: 2,
      },
    ],
  };

  const monthlyLabels = (analytics?.monthly_predictions || [])
    .map((m) => m.month)
    .reverse();
  const monthlyCounts = (analytics?.monthly_predictions || [])
    .map((m) => m.count)
    .reverse();
  const monthlyAvg = (analytics?.monthly_predictions || [])
    .map((m) => Math.round(m.avg_premium))
    .reverse();

  const barData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: "Predictions",
        data: monthlyCounts,
        backgroundColor: "rgba(14, 165, 233, 0.6)",
        borderColor: "#0ea5e9",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const lineData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: "Avg Premium ($)",
        data: monthlyAvg,
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#6366f1",
        pointRadius: 5,
      },
    ],
  };

  const chartOpts = {
    responsive: true,
    plugins: {
      legend: { labels: { color: "#94a3b8", font: { family: "Inter" } } },
      tooltip: {
        backgroundColor: "#1e293b",
        borderColor: "#334155",
        borderWidth: 1,
        titleColor: "#e2e8f0",
        bodyColor: "#94a3b8",
      },
    },
    scales: {
      x: {
        ticks: { color: "#64748b" },
        grid: { color: "rgba(51, 65, 85, 0.3)" },
      },
      y: {
        ticks: { color: "#64748b" },
        grid: { color: "rgba(51, 65, 85, 0.3)" },
      },
    },
  };

  const doughnutOpts = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#94a3b8", font: { family: "Inter" }, padding: 20 },
      },
      tooltip: {
        backgroundColor: "#1e293b",
        borderColor: "#334155",
        borderWidth: 1,
        titleColor: "#e2e8f0",
        bodyColor: "#94a3b8",
      },
    },
  };

  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 animate-fadeInUp">
          <h1 className="text-3xl font-bold">
            Platform <span className="gradient-text">Analytics</span>
          </h1>
          <p className="text-slate-400 mt-1">
            Insights and trends across your insurance platform
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="card text-center !py-6">
            <p className="text-3xl font-bold gradient-text">
              {analytics?.total_users || 0}
            </p>
            <p className="text-sm text-slate-400 mt-1">Total Users</p>
          </div>
          <div className="card text-center !py-6">
            <p className="text-3xl font-bold gradient-text">
              {analytics?.total_predictions || 0}
            </p>
            <p className="text-sm text-slate-400 mt-1">Total Predictions</p>
          </div>
          <div className="card text-center !py-6">
            <p className="text-3xl font-bold gradient-text">
              NPR {Math.round(analytics?.avg_premium || 0).toLocaleString()}
            </p>
            <p className="text-sm text-slate-400 mt-1">Avg Premium</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card !p-6 animate-fadeInUp">
            <h2 className="text-lg font-semibold mb-4">Risk Distribution</h2>
            <div className="max-w-xs mx-auto">
              <Doughnut data={doughnutData} options={doughnutOpts} />
            </div>
          </div>

          <div
            className="card !p-6 animate-fadeInUp"
            style={{ animationDelay: "0.1s" }}
          >
            <h2 className="text-lg font-semibold mb-4">Monthly Predictions</h2>
            <Bar data={barData} options={chartOpts} />
          </div>
        </div>

        <div
          className="card !p-6 animate-fadeInUp"
          style={{ animationDelay: "0.2s" }}
        >
          <h2 className="text-lg font-semibold mb-4">Average Premium Trend</h2>
          <Line data={lineData} options={chartOpts} />
        </div>
      </div>
    </div>
  );
}
