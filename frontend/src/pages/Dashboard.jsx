import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import Charts from "../components/Charts";
import MetricsCards from "../components/MetricsCards";
import RecentActivity from "../components/RecentActivity";

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function fetchDashboard() {
      if (isMounted) {
        setLoading(true);
        setError("");
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/api/dashboard/");
        if (!isMounted) return;

        if (response.data?.success) {
          setData(response.data.data);
        } else {
          setError(response.data?.error || "Unable to fetch dashboard data.");
          setData(null);
        }
      } catch (err) {
        if (!isMounted) return;
        setError(
          err.response?.data?.error ||
            "Unable to fetch dashboard data. Please check your connection and try again."
        );
        setData(null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchDashboard();

    return () => {
      isMounted = false;
    };
  }, [reloadKey]);

  if (loading) return <Loader />;
  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={() => setReloadKey((current) => current + 1)}
      />
    );
  }

  const hasDashboardData =
    data &&
    (data.total_users > 0 ||
      data.total_sales > 0 ||
      data.recent_activity?.length > 0 ||
      data.user_growth?.values?.length > 0 ||
      data.sales_data?.values?.length > 0);

  if (!hasDashboardData) {
    return <h2 className="state-message">No dashboard data available</h2>;
  }

  return (
    <main className="container">
      <div className="page-header">
        <h1>Dashboard</h1>
        {/* <p>Live metrics, charts, and recent activity from external APIs.</p> */}
      </div>

      <MetricsCards data={data} />
      <Charts data={data} />
      <RecentActivity data={data.recent_activity} />
    </main>
  );
}

export default Dashboard;
