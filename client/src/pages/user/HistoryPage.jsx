import { useState, useEffect } from "react";
import API from "../../api/axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
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
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export default function HistoryPage() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const res = await API.get("/user/predictions");
        setPredictions(res.data.predictions);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPredictions();
  }, []);

  const chartData = {
    labels: predictions
      .slice()
      .reverse()
      .map((p) => new Date(p.created_at).toLocaleDateString()),
    datasets: [
      {
        label: "Predicted Premium (NPR)",
        data: predictions
          .slice()
          .reverse()
          .map((p) => parseFloat(p.predicted_premium)),
        borderColor: "#0ea5e9",
        backgroundColor: "rgba(14, 165, 233, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#0ea5e9",
        pointBorderColor: "#0ea5e9",
        pointRadius: 5,
        pointHoverRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: "#94a3b8", font: { family: "Inter" } } },
      tooltip: {
        backgroundColor: "#1e293b",
        borderColor: "#334155",
        borderWidth: 1,
        titleColor: "#e2e8f0",
        bodyColor: "#94a3b8",
        callbacks: {
          label: (ctx) => `Premium: NPR ${ctx.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#64748b" },
        grid: { color: "rgba(51, 65, 85, 0.3)" },
      },
      y: {
        ticks: { color: "#64748b", callback: (v) => `NPR ${v.toLocaleString()}` },
        grid: { color: "rgba(51, 65, 85, 0.3)" },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 animate-fadeInUp">
          <h1 className="text-3xl font-bold">
            Prediction <span className="gradient-text">History</span>
          </h1>
          <p className="text-slate-400 mt-1">
            Track how your predicted premiums change over time
          </p>
        </div>

        {predictions.length > 0 ? (
          <>
            {/* Chart */}
            <div className="card mb-8 !p-6 animate-fadeInUp">
              <h2 className="text-lg font-semibold mb-4">Premium Trend</h2>
              <Line data={chartData} options={chartOptions} />
            </div>

            {/* Table */}
            <div
              className="card overflow-hidden animate-fadeInUp"
              style={{ animationDelay: "0.1s" }}
            >
              <h2 className="text-lg font-semibold mb-4 px-2">
                All Predictions
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-400">
                      <th className="text-left py-3 px-3">#</th>
                      <th className="text-left py-3 px-3">Date</th>
                      <th className="text-left py-3 px-3">Age</th>
                      <th className="text-left py-3 px-3">Gender</th>
                      <th className="text-left py-3 px-3">BMI</th>
                      <th className="text-left py-3 px-3">Smoker</th>
                      <th className="text-left py-3 px-3">Region</th>
                      <th className="text-left py-3 px-3">Premium</th>
                      <th className="text-left py-3 px-3">Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {predictions.map((p, i) => (
                      <tr
                        key={p.id}
                        className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="py-3 px-3 text-slate-500">{i + 1}</td>
                        <td className="py-3 px-3 text-slate-300">
                          {new Date(p.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-3">{p.age}</td>
                        <td className="py-3 px-3 capitalize">{p.gender}</td>
                        <td className="py-3 px-3">{p.bmi}</td>
                        <td className="py-3 px-3">
                          {p.smoker ? "🚬 Yes" : "No"}
                        </td>
                        <td className="py-3 px-3 capitalize">{p.region}</td>
                        <td className="py-3 px-3 font-semibold text-sky-400">
                          NPR {parseFloat(p.predicted_premium).toLocaleString()}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-1 rounded-lg text-xs font-medium badge-${p.risk_category.toLowerCase()}`}
                          >
                            {p.risk_category}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="card text-center !p-12">
            <p className="text-slate-400 text-lg">
              No predictions yet. Make your first prediction!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
