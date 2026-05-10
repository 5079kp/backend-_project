export default function Slidebar({ active, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-logo">R</span>
        <div>
          <div className="sidebar-title">Rocker</div>
          <div className="sidebar-subtitle">Admin</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button className={active === 'dashboard' ? 'nav-item active' : 'nav-item'} onClick={() => onNavigate('dashboard')}>
          Dashboard
        </button>
        <button className={active === 'users' ? 'nav-item active' : 'nav-item'} onClick={() => onNavigate('users')}>
          User Management
        </button>
        <button className={active === 'products' ? 'nav-item active' : 'nav-item'} onClick={() => onNavigate('products')}>
          Product Management
        </button>
        <button className={active === 'reports' ? 'nav-item active' : 'nav-item'} onClick={() => onNavigate('reports')}>
          Reports
        </button>
      </nav>

      <div className="sidebar-footer">Total users, products and reports at a glance.</div>
    </aside>
  )
}
