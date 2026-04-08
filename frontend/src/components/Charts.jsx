import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip
);

function Charts({ data }) {
  const userGrowthLabels = data?.user_growth?.labels || [];
  const userGrowthValues = data?.user_growth?.values || [];
  const salesLabels = data?.sales_data?.labels || [];
  const salesValues = data?.sales_data?.values || [];

  const lineData = {
    labels: userGrowthLabels,
    datasets: [
      {
        label: "Users",
        data: userGrowthValues,
        borderColor: "#111111",
        backgroundColor: "rgba(17, 17, 17, 0.08)",
        fill: true,
        tension: 0.35,
        pointRadius: 3,
        pointHoverRadius: 4,
        pointBackgroundColor: "#111111",
      },
    ],
  };

  const barData = {
    labels: salesLabels,
    datasets: [
      {
        label: "Sales",
        data: salesValues,
        backgroundColor: ["#111111", "#2f2f2f", "#555555", "#7a7a7a", "#a0a0a0"],
        borderRadius: 10,
        borderSkipped: false,
      },
    ],
  };

  const sharedOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#111111",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        displayColors: false,
      },
    },
  };

  const lineOptions = {
    ...sharedOptions,
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: "#666666" },
      },
      y: {
        grid: { color: "#e6e6e6" },
        border: { display: false },
        ticks: { color: "#666666", precision: 0 },
        beginAtZero: true,
      },
    },
  };

  const barOptions = {
    ...sharedOptions,
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: "#666666" },
      },
      y: {
        grid: { color: "#e6e6e6" },
        border: { display: false },
        ticks: { color: "#666666" },
        beginAtZero: true,
      },
    },
  };

  return (
    <section className="charts">
      <article className="chart-box">
        <div className="chart-head">
          <h3>User Growth</h3>
          <p>Dynamic data from users API</p>
        </div>
        <div className="chart-canvas">
          {userGrowthValues.length ? (
            <Line data={lineData} options={lineOptions} />
          ) : (
            <p className="empty-state">No user growth data available.</p>
          )}
        </div>
      </article>

      <article className="chart-box">
        <div className="chart-head">
          <h3>Sales Figures</h3>
          <p>Dynamic data from products API</p>
        </div>
        <div className="chart-canvas">
          {salesValues.length ? (
            <Bar data={barData} options={barOptions} />
          ) : (
            <p className="empty-state">No sales data available.</p>
          )}
        </div>
      </article>
    </section>
  );
}

export default Charts;
