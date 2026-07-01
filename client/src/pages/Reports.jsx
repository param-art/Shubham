import React, { useState, useEffect } from 'react'
import { Bar } from 'react-chartjs-2'
import { api } from '../utils/api'
import { formatCurrency, getMonthName } from '../utils/helpers'
import Card from '../components/Card'
import './Sales.css'
import './Reports.css'

function Reports() {
  const [reportData, setReportData] = useState(null)
  const [comparisonData, setComparisonData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const getPreviousMonth = (year, month) => {
    if (month === 1) {
      return { year: year - 1, month: 12 }
    }
    return { year, month: month - 1 }
  }

  useEffect(() => {
    fetchReportData()
  }, [selectedMonth, selectedYear])

  const fetchReportData = async () => {
    try {
      setLoading(true)
      const previousPeriod = getPreviousMonth(selectedYear, selectedMonth)
      const [currentResponse, previousResponse] = await Promise.all([
        api.getComprehensiveReport(selectedYear, selectedMonth),
        api.getComprehensiveReport(previousPeriod.year, previousPeriod.month)
      ])
      setReportData(currentResponse.data)
      setComparisonData({
        current: currentResponse.data,
        previous: previousResponse.data,
        previousPeriod
      })
    } catch (error) {
      console.error('Error fetching report:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="reports-page"><div className="loading">Loading Report...</div></div>
  }

  if (!reportData) {
    return <div className="reports-page"><div className="loading">No data available</div></div>
  }

  const { sales, expenses, purchases, profitLoss, period } = reportData
  const months = Array.from({ length: 12 }, (_, i) => i + 1)

  const getComparisonSummary = (currentValue, previousValue) => {
    if (!previousValue) {
      return { change: 0, percentage: 0, direction: 'neutral' }
    }

    const diff = currentValue - previousValue
    const percentage = previousValue === 0 ? 0 : ((diff / previousValue) * 100).toFixed(1)
    return {
      change: diff,
      percentage: parseFloat(percentage),
      direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral'
    }
  }

  const salesComparison = comparisonData ? getComparisonSummary(sales.total, comparisonData.previous.sales.total) : null
  const purchaseComparison = comparisonData ? getComparisonSummary(purchases.total, comparisonData.previous.purchases.total) : null
  const expenseComparison = comparisonData ? getComparisonSummary(expenses.total, comparisonData.previous.expenses.total) : null

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

  const chartColors = {
    green: 'rgba(57, 255, 20, 0.8)',
    greenBg: 'rgba(57, 255, 20, 0.1)',
    red: 'rgba(255, 23, 68, 0.8)',
    redBg: 'rgba(255, 23, 68, 0.1)',
    blue: 'rgba(33, 150, 243, 0.8)',
    blueBg: 'rgba(33, 150, 243, 0.1)'
  }

  const profitLossChartData = {
    labels: ['Gross Profit', 'Net Profit'],
    datasets: [
      {
        label: 'Amount (₹)',
        data: [profitLoss.grossProfit, profitLoss.netProfit],
        backgroundColor: [
          chartColors.green,
          profitLoss.netProfit >= 0 ? chartColors.green : chartColors.red
        ],
        borderColor: [
          'rgba(57, 255, 20, 1)',
          profitLoss.netProfit >= 0 ? 'rgba(57, 255, 20, 1)' : 'rgba(255, 23, 68, 1)'
        ],
        borderWidth: 2
      }
    ]
  }

  const revenueVsExpenseData = {
    labels: ['Sales', 'Purchases', 'Expenses'],
    datasets: [
      {
        label: 'Amount (₹)',
        data: [sales.total, purchases.total, expenses.total],
        backgroundColor: [
          chartColors.green,
          chartColors.blue,
          chartColors.red
        ],
        borderColor: [
          'rgba(57, 255, 20, 1)',
          'rgba(33, 150, 243, 1)',
          'rgba(255, 23, 68, 1)'
        ],
        borderWidth: 2
      }
    ]
  }

  const salesBreakdownData = {
    labels: ['Cash', 'Online'],
    datasets: [
      {
        label: 'Amount (₹)',
        data: [sales.cash, sales.online],
        backgroundColor: [
          chartColors.green,
          chartColors.blue
        ],
        borderColor: [
          'rgba(57, 255, 20, 1)',
          'rgba(33, 150, 243, 1)'
        ],
        borderWidth: 2
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          color: '#ffffff',
          usePointStyle: true
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#b0b0b0'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#b0b0b0'
        }
      }
    }
  }

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>📈 Reports & Analytics</h1>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label>Month:</label>
          <select 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            {months.map(m => (
              <option key={m} value={m}>{getMonthName(m)}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Year:</label>
          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="report-title">
        <h2>{getMonthName(period.month)} {period.year} - Comprehensive Report</h2>
      </div>

      <div className="cards-grid">
        <Card 
          title="Total Sales" 
          value={formatCurrency(sales.total)} 
          subtitle={`${sales.count} transactions`}
          icon="💰"
          color="green"
        />
        <Card 
          title="Total Purchases" 
          value={formatCurrency(purchases.total)} 
          subtitle={`${purchases.count} transactions`}
          icon="📦"
          color="blue"
        />
        <Card 
          title="Total Expenses" 
          value={formatCurrency(expenses.total)} 
          subtitle={`Daily: ${formatCurrency(expenses.daily)}`}
          icon="💸"
          color="red"
        />
        <Card 
          title="Gross Profit" 
          value={formatCurrency(profitLoss.grossProfit)} 
          subtitle="Before Expenses"
          icon="📊"
          color="green"
        />
        <Card 
          title="Net Profit" 
          value={formatCurrency(profitLoss.netProfit)} 
          subtitle={`Margin: ${profitLoss.profitMargin}%`}
          icon={profitLoss.netProfit >= 0 ? '📈' : '📉'}
          color={profitLoss.netProfit >= 0 ? 'green' : 'red'}
        />
      </div>

      <div className="detailed-breakdown">
        <h3>Sales Breakdown</h3>
        <div className="breakdown-items">
          <div className="breakdown-item">
            <span>Total Sales:</span>
            <strong>{formatCurrency(sales.total)}</strong>
          </div>
          <div className="breakdown-item">
            <span>Cash Sales:</span>
            <strong>{formatCurrency(sales.cash)} ({sales.total ? ((sales.cash / sales.total) * 100).toFixed(1) : '0'}%)</strong>
          </div>
          <div className="breakdown-item">
            <span>Online Sales:</span>
            <strong>{formatCurrency(sales.online)} ({sales.total ? ((sales.online / sales.total) * 100).toFixed(1) : '0'}%)</strong>
          </div>
        </div>
      </div>

      {comparisonData && (
        <div className="detailed-breakdown">
          <h3>Month-to-Month Comparison</h3>
          <div className="comparison-grid">
            <div className="comparison-card">
              <span className="comparison-label">Sales</span>
              <strong className="comparison-value">{formatCurrency(sales.total)}</strong>
              <span className={`comparison-change ${salesComparison?.direction}`}>
                {salesComparison?.direction === 'up' ? '▲' : salesComparison?.direction === 'down' ? '▼' : '●'}{' '}
                {salesComparison ? `${salesComparison.percentage >= 0 ? '+' : ''}${salesComparison.percentage}% vs ${getMonthName(comparisonData.previousPeriod.month)} ${comparisonData.previousPeriod.year}` : 'No comparison'}
              </span>
            </div>
            <div className="comparison-card">
              <span className="comparison-label">Purchases</span>
              <strong className="comparison-value">{formatCurrency(purchases.total)}</strong>
              <span className={`comparison-change ${purchaseComparison?.direction}`}>
                {purchaseComparison?.direction === 'up' ? '▲' : purchaseComparison?.direction === 'down' ? '▼' : '●'}{' '}
                {purchaseComparison ? `${purchaseComparison.percentage >= 0 ? '+' : ''}${purchaseComparison.percentage}% vs ${getMonthName(comparisonData.previousPeriod.month)} ${comparisonData.previousPeriod.year}` : 'No comparison'}
              </span>
            </div>
            <div className="comparison-card">
              <span className="comparison-label">Expenses</span>
              <strong className="comparison-value">{formatCurrency(expenses.total)}</strong>
              <span className={`comparison-change ${expenseComparison?.direction}`}>
                {expenseComparison?.direction === 'up' ? '▲' : expenseComparison?.direction === 'down' ? '▼' : '●'}{' '}
                {expenseComparison ? `${expenseComparison.percentage >= 0 ? '+' : ''}${expenseComparison.percentage}% vs ${getMonthName(comparisonData.previousPeriod.month)} ${comparisonData.previousPeriod.year}` : 'No comparison'}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="detailed-breakdown">
        <h3>Expense Breakdown</h3>
        <div className="breakdown-items">
          <div className="breakdown-item">
            <span>Total Expenses:</span>
            <strong>{formatCurrency(expenses.total)}</strong>
          </div>
          <div className="breakdown-item">
            <span>Daily Expenses:</span>
            <strong>{formatCurrency(expenses.daily)}</strong>
          </div>
          <div className="breakdown-item">
            <span>Other Expenses:</span>
            <strong>{formatCurrency(expenses.other)}</strong>
          </div>
          <div className="breakdown-item">
            <span>Expense Ratio:</span>
            <strong>{sales.total ? ((expenses.total / sales.total) * 100).toFixed(2) : '0'}% of Sales</strong>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>Profit & Loss Analysis</h3>
          <Bar data={profitLossChartData} options={chartOptions} />
        </div>

        <div className="chart-container">
          <h3>Revenue vs Expenses vs Purchases</h3>
          <Bar data={revenueVsExpenseData} options={chartOptions} />
        </div>

        <div className="chart-container">
          <h3>Sales by Payment Method</h3>
          <Bar data={salesBreakdownData} options={chartOptions} />
        </div>
      </div>

      <div className="summary-section">
        <h3>Financial Summary</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <p>Revenue</p>
            <h4>{formatCurrency(sales.total)}</h4>
          </div>
          <div className="summary-item">
            <p>Cost of Goods</p>
            <h4>{formatCurrency(purchases.total)}</h4>
          </div>
          <div className="summary-item">
            <p>Operating Expenses</p>
            <h4>{formatCurrency(expenses.total)}</h4>
          </div>
          <div className="summary-item">
            <p>Gross Profit</p>
            <h4>{formatCurrency(profitLoss.grossProfit)}</h4>
          </div>
          <div className="summary-item">
            <p>Net Profit</p>
            <h4>{formatCurrency(profitLoss.netProfit)}</h4>
          </div>
          <div className="summary-item">
            <p>Profit Margin</p>
            <h4>{profitLoss.profitMargin}%</h4>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports
