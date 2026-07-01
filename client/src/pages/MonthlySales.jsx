import React, { useEffect, useMemo, useState } from 'react'
import { api } from '../utils/api'
import { formatCurrency, formatDate } from '../utils/helpers'
import './Sales.css'

function MonthlySales() {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'))
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())

  useEffect(() => {
    fetchMonthlySales(selectedYear, selectedMonth)
  }, [selectedMonth, selectedYear])

  const fetchMonthlySales = async (year, month) => {
    try {
      setLoading(true)
      const response = await api.getMonthlySalesReport(year, month)
      setSales(response.data.sales || [])
    } catch (error) {
      console.error('Error fetching monthly sales:', error)
    } finally {
      setLoading(false)
    }
  }

  const dailySales = useMemo(() => {
    const grouped = sales.reduce((acc, sale) => {
      const dateKey = sale.date ? new Date(sale.date).toISOString().split('T')[0] : 'Unknown'
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: dateKey,
          totalSale: 0,
          cashSale: 0,
          onlineSale: 0,
          transactions: 0
        }
      }

      acc[dateKey].totalSale += Number(sale.totalSale || 0)
      acc[dateKey].cashSale += Number(sale.cashSale || 0)
      acc[dateKey].onlineSale += Number(sale.onlineSale || 0)
      acc[dateKey].transactions += 1
      return acc
    }, {})

    return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [sales])

  const totals = useMemo(() => {
    return dailySales.reduce(
      (acc, day) => ({
        totalSale: acc.totalSale + day.totalSale,
        cashSale: acc.cashSale + day.cashSale,
        onlineSale: acc.onlineSale + day.onlineSale,
        transactions: acc.transactions + day.transactions
      }),
      { totalSale: 0, cashSale: 0, onlineSale: 0, transactions: 0 }
    )
  }, [dailySales])

  return (
    <div className="sales-page">
      <div className="page-header">
        <div>
          <h1>📅 Monthly Sales Overview</h1>
          <p className="subtitle">All sales for the selected month, grouped by date.</p>
        </div>
        <div className="filters">
          <div className="filter-group">
            <label>Month</label>
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
              {Array.from({ length: 12 }, (_, index) => (
                <option key={index + 1} value={(index + 1).toString().padStart(2, '0')}>
                  {(index + 1).toString().padStart(2, '0')}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Year</label>
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              {Array.from({ length: 6 }, (_, index) => {
                const year = new Date().getFullYear() - index
                return <option key={year} value={year}>{year}</option>
              })}
            </select>
          </div>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <h4>Total Sales</h4>
          <p className="value">{formatCurrency(totals.totalSale)}</p>
        </div>
        <div className="summary-card">
          <h4>Cash Sales</h4>
          <p className="value">{formatCurrency(totals.cashSale)}</p>
        </div>
        <div className="summary-card">
          <h4>Online Sales</h4>
          <p className="value">{formatCurrency(totals.onlineSale)}</p>
        </div>
        <div className="summary-card">
          <h4>Transactions</h4>
          <p className="value">{totals.transactions}</p>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading monthly sales...</div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Total Sale</th>
                <th>Cash Sale</th>
                <th>Online Sale</th>
                <th>Transactions</th>
              </tr>
            </thead>
            <tbody>
              {dailySales.map((day) => (
                <tr key={day.date}>
                  <td>{formatDate(day.date)}</td>
                  <td>{formatCurrency(day.totalSale)}</td>
                  <td>{formatCurrency(day.cashSale)}</td>
                  <td>{formatCurrency(day.onlineSale)}</td>
                  <td>{day.transactions}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {dailySales.length === 0 && <div className="no-data">No sales found for this month</div>}
        </div>
      )}
    </div>
  )
}

export default MonthlySales
