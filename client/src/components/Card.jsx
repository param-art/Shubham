import React from 'react'
import './Card.css'

function Card({ title, value, subtitle, icon, color = 'green' }) {
  return (
    <div className={`card card-${color}`}>
      <div className="card-header">
        <span className="card-icon">{icon}</span>
        <h3>{title}</h3>
      </div>
      <div className="card-value">
        <p className="value">{value}</p>
        {subtitle && <p className="subtitle">{subtitle}</p>}
      </div>
    </div>
  )
}

export default Card
