import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
  PieChart, Pie, Cell,
  ComposedChart,
} from 'recharts';

const COLORS = ['#4361ee', '#3a0ca3', '#7209b7', '#f72585', '#4cc9f0'];

export default function AdminAnalytics() {
  const [overview, setOverview] = useState(null);
  const [salesOverTime, setSalesOverTime] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          overviewRes,
          salesOverTimeRes,
          topProductsRes,
          userGrowthRes,
          categoryRes
        ] = await Promise.all([
          axios.get('/api/analytics/overview'),
          axios.get('/api/analytics/over-time?period=monthly'),
          axios.get('/api/analytics/top-products?limit=5'),
          axios.get('/api/analytics/user-growth?period=monthly'),
          axios.get('/api/analytics/category-distribution')
        ]);

        setOverview(overviewRes.data);
        setSalesOverTime(salesOverTimeRes.data);
        setTopProducts(topProductsRes.data);
        setUserGrowth(userGrowthRes.data);
        setCategoryDistribution(categoryRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch analytics data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading analytics...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: 24, fontFamily: 'Poppins, sans-serif' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>
        Analytics Dashboard
      </h1>

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#f8f9ff', borderRadius: 12, padding: 16 }}>
          <h3 style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>Total Sales</h3>
          <p style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>
            Rs. {overview?.totalSales?.toLocaleString() || '0'}
          </p>
        </div>
        <div style={{ background: '#f8f9ff', borderRadius: 12, padding: 16 }}>
          <h3 style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>Total Orders</h3>
          <p style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>
            {overview?.totalOrders?.toLocaleString() || '0'}
          </p>
        </div>
        <div style={{ background: '#f8f9ff', borderRadius: 12, padding: 16 }}>
          <h3 style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>Avg Order Value</h3>
          <p style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>
            Rs. {overview?.avgOrderValue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
          </p>
        </div>
        <div style={{ background: '#f8f9ff', borderRadius: 12, padding: 16 }}>
          <h3 style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>Revenue This Month</h3>
          <p style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>
            Rs. {overview?.totalSales?.toLocaleString() || '0'}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginBottom: 24 }}>
        {/* Sales Over Time */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
            Sales Over Time (Monthly)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="totalSales" stroke="#4361ee" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
            Top Products by Quantity Sold
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalSold" barSize="60%" fill="#4361ee" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
        {/* User Growth */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
            User Growth (Monthly)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#3a0ca3" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
            Orders by Category
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryDistribution}
                dataKey="count"
                nameKey="_id"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                labelLine={false}
                label={{
                  position: 'inside',
                  fill: '#fff',
                  fontSize: 12,
                }}
              >
                {categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}