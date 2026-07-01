import React, { useState, useEffect } from 'react'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import Card from '../components/Card'
import { api } from '../utils/api'
import { formatCurrency } from '../utils/helpers'
import './Dashboard.css'

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await api.getDashboardData()
      setDashboardData(response.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="dashboard-loading">Loading Dashboard...</div>
  }

  if (!dashboardData) {
    return <div className="dashboard-error">Failed to load dashboard data</div>
  }

  const { summary, dailySales, chartData } = dashboardData

  const chartColors = {
    green: 'rgba(57, 255, 20, 0.8)',
    greenBg: 'rgba(57, 255, 20, 0.1)',
    red: 'rgba(255, 23, 68, 0.8)',
    redBg: 'rgba(255, 23, 68, 0.1)',
    blue: 'rgba(33, 150, 243, 0.8)',
    blueBg: 'rgba(33, 150, 243, 0.1)'
  }

  const salesData = {
    labels: Object.keys(dailySales).slice(-7),
    datasets: [
      {
        label: 'Daily Sales',
        data: Object.values(dailySales).slice(-7),
        borderColor: chartColors.green,
        backgroundColor: chartColors.greenBg,
        fill: true,
        tension: 0.4
      }
    ]
  }

  const sourceData = {
    labels: ['Cash', 'Online'],
    datasets: [
      {
        label: 'Sales by Source',
        data: [summary.totalCash, summary.totalOnline],
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

  const profitLoss = summary.netProfit >= 0 ? summary.netProfit : 0
  const loss = summary.netProfit < 0 ? Math.abs(summary.netProfit) : 0

  const categoryData = {
    labels: ['Sales', 'Purchases', 'Expenses'],
    datasets: [
      {
        label: 'Amount',
        data: [summary.totalSale, summary.totalPurchase, summary.totalExpense],
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
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>📊 Dashboard</h1>
        <p className="subtitle">Welcome to Shubham Garments Management System</p>
      </div>

      <div className="cards-grid">
        <Card 
          title="Total Sales" 
          value={formatCurrency(summary.totalSale)} 
          subtitle="This Month"
          icon="💰"
          color="green"
        />
        <Card 
          title="Cash Sales" 
          value={formatCurrency(summary.totalCash)} 
          subtitle={`${summary.totalSale ? ((summary.totalCash / summary.totalSale) * 100).toFixed(0) : '0'}% of total`}
          icon="💵"
          color="green"
        />
        <Card 
          title="Online Sales" 
          value={formatCurrency(summary.totalOnline)} 
          subtitle={`${summary.totalSale ? ((summary.totalOnline / summary.totalSale) * 100).toFixed(0) : '0'}% of total`}
          icon="🛒"
          color="blue"
        />
        <Card 
          title="Total Expenses" 
          value={formatCurrency(summary.totalExpense)} 
          subtitle="This Month"
          icon="💸"
          color="red"
        />
        <Card 
          title="Total Purchases" 
          value={formatCurrency(summary.totalPurchase)} 
          subtitle="This Month"
          icon="📦"
          color="blue"
        />
        <Card 
          title="Net Profit" 
          value={formatCurrency(summary.netProfit)} 
          subtitle={summary.netProfit > 0 ? 'Positive' : 'Negative'}
          icon={summary.netProfit > 0 ? '📈' : '📉'}
          color={summary.netProfit > 0 ? 'green' : 'red'}
        />
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>Daily Sales Trend</h3>
          <Line data={salesData} options={chartOptions} />
        </div>

        <div className="chart-container">
          <h3>Sales by Source</h3>
          <Doughnut data={sourceData} options={chartOptions} />
        </div>

        <div className="chart-container">
          <h3>Financial Overview</h3>
          <Bar data={categoryData} options={chartOptions} />
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-item">
          <h4>📋 Transactions</h4>
          <div className="stat-value">
            <div>Sales: {chartData.salesCount}</div>
            <div>Purchases: {chartData.purchaseCount}</div>
            <div>Expenses: {chartData.expenseCount}</div>
          </div>
        </div>
        <div className="stat-item">
          <h4>📊 Metrics</h4>
          <div className="stat-value">
            <div>Profit Margin: {((summary.netProfit / summary.totalSale) * 100).toFixed(2)}%</div>
            <div>Avg Daily Sale: {formatCurrency(summary.totalSale / 30)}</div>
            <div>Cost Ratio: {((summary.totalExpense / summary.totalSale) * 100).toFixed(2)}%</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
