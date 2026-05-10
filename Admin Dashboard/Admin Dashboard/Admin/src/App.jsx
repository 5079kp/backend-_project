import { useEffect, useState } from 'react'
import './App.css'
import Header from './Header.jsx'
import Slidebar from './Slidebar.jsx'
import Home from './Home.jsx'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'

function App() {
  const [token, setToken] = useState(localStorage.getItem('dashboard_token') || '')
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('dashboard_user') || 'null'))
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [page, setPage] = useState('dashboard')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function fetchDashboard() {
    if (!token) return
    setLoading(true)
    try {
      const [statsRes, usersRes, productsRes] = await Promise.all([
        fetch(`${API_URL}/api/users/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/products`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      if (!statsRes.ok || !usersRes.ok || !productsRes.ok) {
        logout()
        return
      }

      const statsData = await statsRes.json()
      const usersData = await usersRes.json()
      const productsData = await productsRes.json()
      setStats(statsData)
      setUsers(usersData)
      setProducts(productsData)
    } catch (err) {
      setError('Unable to connect to the backend.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchDashboard()
    }
  }, [token])

  async function handleLogin(email, password) {
    setError('')
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data.message || 'Login failed')
        return
      }

      localStorage.setItem('dashboard_token', data.token)
      localStorage.setItem('dashboard_user', JSON.stringify(data.user))
      setToken(data.token)
      setUser(data.user)
      setPage('dashboard')
    } catch (err) {
      setError('Unable to connect to the server.')
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    localStorage.removeItem('dashboard_token')
    localStorage.removeItem('dashboard_user')
    setToken('')
    setUser(null)
    setStats(null)
    setUsers([])
    setProducts([])
    setPage('dashboard')
  }

  async function handleDeleteUser(id) {
    setError('')
    try {
      const response = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!response.ok) {
        const data = await response.json()
        setError(data.message || 'Unable to delete user')
        return
      }
      setUsers(users.filter((userItem) => userItem._id !== id))
    } catch (err) {
      setError('Unable to delete user')
    }
  }

  async function handleAddProduct(product) {
    try {
      const response = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(product)
      })
      if (response.ok) {
        const data = await response.json()
        setProducts([data, ...products])
        fetchDashboard()
      }
    } catch (err) {
      setError('Unable to add product')
    }
  }

  async function handleUpdateProduct(id, product) {
    try {
      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(product)
      })
      if (response.ok) {
        const data = await response.json()
        setProducts(products.map(p => p._id === id ? data : p))
      }
    } catch (err) {
      setError('Unable to update product')
    }
  }

  async function handleDeleteProduct(id) {
    try {
      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        setProducts(products.filter(p => p._id !== id))
        fetchDashboard()
      }
    } catch (err) {
      setError('Unable to delete product')
    }
  }

  if (!token) {
    return (
      <div className="login-shell">
        <div className="login-card">
          <h1>Admin Dashboard</h1>
          <p>Use prayagkansara05@gmail.com / Prayag05@ to login.</p>
          <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <Slidebar active={page} onNavigate={setPage} />
      <div className="main-panel">
        <Header user={user} onLogout={logout} />
        <Home
          stats={stats}
          users={users}
          products={products}
          page={page}
          onDeleteUser={handleDeleteUser}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  )
}

function LoginForm({ onSubmit, loading, error }) {
  const [email, setEmail] = useState('prayagkansara05@gmail.com')
  const [password, setPassword] = useState('Prayag05@')

  return (
    <form className="login-form" onSubmit={(event) => {
      event.preventDefault()
      onSubmit(email, password)
    }}>
      <label>
        Email
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
      </label>
      <label>
        Password
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
      </label>
      {error && <div className="form-error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}

export default App
