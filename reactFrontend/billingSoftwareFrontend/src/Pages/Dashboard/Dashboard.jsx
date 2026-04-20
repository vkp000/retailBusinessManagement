import toast from "react-hot-toast";
import "./Dashboard.css";
import { useEffect, useState } from "react";
import { fetchDashboardData } from "../../Service/Dashboard";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchDashboardData();
        setData(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Unable to view the data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner-border text-primary" role="status" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!data) {
    return <div className="dashboard-error">Failed to load dashboard data.</div>;
  }

  return (
    <div className="dashboard-wrapper">
      {/* Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon sales-icon">
            <i className="bi bi-currency-rupee"></i>
          </div>
          <div className="stat-content">
            <p className="stat-label">Today's Sales</p>
            <h2 className="stat-value">₹{data.todaySales ? data.todaySales.toFixed(2) : "0.00"}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orders-icon">
            <i className="bi bi-cart-check"></i>
          </div>
          <div className="stat-content">
            <p className="stat-label">Today's Orders</p>
            <h2 className="stat-value">{data.todayOrderCount ?? 0}</h2>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="recent-orders-card">
        <h5 className="recent-orders-title">
          <i className="bi bi-clock-history me-2"></i>
          Recent Orders
        </h5>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {data.recentOrders && data.recentOrders.length > 0 ? (
                data.recentOrders.map((order) => (
                  <tr key={order.orderId}>
                    <td className="order-id-cell">
                      <span className="badge bg-secondary font-monospace">
                        {order.orderId.substring(0, 10)}...
                      </span>
                    </td>
                    <td>{order.customerName}</td>
                    <td className="fw-semibold">
                      ₹{order.grandTotal ? order.grandTotal.toFixed(2) : "0.00"}
                    </td>
                    <td>
                      <span className={`badge ${order.paymentMethod === "UPI" ? "bg-primary" : "bg-success"}`}>
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${order.paymentDetails.status === "COMPLETED" ? "bg-success" : "bg-warning text-dark"}`}>
                        {order.paymentDetails.status}
                      </span>
                    </td>
                    <td className="text-muted small">
                      {new Date(order.createdAt).toLocaleString([], {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-4">
                    No recent orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;