import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Sidebar.css'

function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation()

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/sales', label: 'Sales', icon: '💰' },
    { path: '/monthly-sales', label: 'Monthly Sales', icon: '📅' },
    { path: '/expenses', label: 'Expenses', icon: '💸' },
    { path: '/purchases', label: 'Purchases', icon: '📦' },
    { path: '/reports', label: 'Reports', icon: '📈' }
  ]

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">🏪</span>
          <span className="logo-text">Shubham</span>
        </div>
        <button className="close-btn" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p className="business-name">© 2024 Shubham Garments</p>
      </div>
    </aside>
  )
}

export default Sidebar
