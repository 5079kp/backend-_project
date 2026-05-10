import Products from './Products.jsx'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

const activityData = [
  { day: 'Mo', visits: 8, sales: 5 },
  { day: 'Tu', visits: 28, sales: 18 },
  { day: 'We', visits: 26, sales: 20 },
  { day: 'Th', visits: 18, sales: 15 },
  { day: 'Fr', visits: 22, sales: 12 },
  { day: 'Sa', visits: 12, sales: 10 },
  { day: 'Su', visits: 10, sales: 8 }
]

const ordersData = [
  { month: 'Jan', orders: 8 },
  { month: 'Feb', orders: 6 },
  { month: 'Mar', orders: 14 },
  { month: 'Apr', orders: 10 },
  { month: 'May', orders: 12 },
  { month: 'Jun', orders: 8 }
]

export default function Home({ stats, users, products, onDeleteUser, onAddProduct, onUpdateProduct, onDeleteProduct, page, loading, error }) {
  if (!stats && loading) {
    return <div className="content-shell">Loading dashboard…</div>
  }

  if (page === 'users') {
    return (
      <div className="content-shell">
        <section className="section-header">
          <div>
            <h2>User Management</h2>
            <p>Manage users, see account roles, and remove stale profiles.</p>
          </div>
        </section>

        {error && <div className="content-error">{error}</div>}

        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="delete-button" onClick={() => onDeleteUser(user._id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (page === 'products') {
    return (
      <Products
        products={products}
        onAdd={onAddProduct}
        onUpdate={onUpdateProduct}
        onDelete={onDeleteProduct}
        error={error}
      />
    )
  }

  return (
    <div className="content-shell">
      <section className="section-header">
        <div>
          <h2>Sales Overview</h2>
          <p>Monitor site activity, product totals, and overall performance.</p>
        </div>
      </section>

      {error && <div className="content-error">{error}</div>}

      <div className="stat-grid">
        <div className="stat-card blue-bg">
          <span>Total Users</span>
          <strong>{stats?.totalUsers ?? 0}</strong>
        </div>
        <div className="stat-card green-bg">
          <span>Total Products</span>
          <strong>{stats?.totalProducts ?? 0}</strong>
        </div>
        <div className="stat-card orange-bg">
          <span>Total Orders</span>
          <strong>{stats?.totalOrders ?? 0}</strong>
        </div>
        <div className="stat-card red-bg">
          <span>Total Revenue</span>
          <strong>${stats?.totalRevenue ?? 0}K</strong>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="chart-card">
          <div className="chart-card-header">
            <h3>Visits vs Sales</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={activityData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2f2f3a" />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip wrapperStyle={{ background: '#111827', border: '1px solid #374151' }} />
              <Area type="monotone" dataKey="visits" stroke="#38bdf8" fillOpacity={1} fill="url(#colorVisits)" />
              <Area type="monotone" dataKey="sales" stroke="#f97316" fillOpacity={1} fill="url(#colorSales)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card orders-card">
          <div className="chart-card-header">
            <h3>Order Status</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ordersData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2f2f3a" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip wrapperStyle={{ background: '#111827', border: '1px solid #374151' }} />
              <Bar dataKey="orders" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
