import React, { useState, useEffect } from 'react'
import Modal from '../components/Modal'
import Table from '../components/Table'
import { api } from '../utils/api'
import { formatCurrency, formatDate } from '../utils/helpers'
import './Sales.css'

function Sales() {
  const [sales, setSales] = useState([])
  const [filteredSales, setFilteredSales] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'))
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    totalSale: '',
    cashSale: '',
    onlineSale: '',
    items: [],
    notes: ''
  })

  useEffect(() => {
    fetchSales()
  }, [selectedMonth, selectedYear])

  const fetchSales = async () => {
    try {
      setLoading(true)
      const response = await api.getMonthlySalesReport(selectedYear, selectedMonth)
      setSales(response.data.sales || [])
      setFilteredSales(response.data.sales || [])
    } catch (error) {
      console.error('Error fetching sales:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.updateSale(editingId, formData)
        console.log('Sale updated successfully')
      } else {
        await api.addSale(formData)
        console.log('Sale added successfully')
      }
      resetForm()
      setModalOpen(false)
      fetchSales()
    } catch (error) {
      console.error('Error saving sale:', error)
    }
  }

  const handleEdit = (sale) => {
    setEditingId(sale._id)
    setFormData({
      ...sale,
      date: new Date(sale.date).toISOString().split('T')[0]
    })
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
    try {
      await api.deleteSale(id)
      console.log('Sale deleted successfully')
      fetchSales()
    } catch (error) {
      console.error('Error deleting sale:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      totalSale: '',
      cashSale: '',
      onlineSale: '',
      items: [],
      notes: ''
    })
    setEditingId(null)
  }

  const updateSaleValues = (field, value) => {
    const numericValue = value === '' ? '' : parseFloat(value)
    const nextFormData = { ...formData, [field]: numericValue }

    if (field === 'cashSale' || field === 'onlineSale') {
      const cashValue = field === 'cashSale' ? numericValue : formData.cashSale
      const onlineValue = field === 'onlineSale' ? numericValue : formData.onlineSale
      nextFormData.totalSale = (Number(cashValue || 0) + Number(onlineValue || 0)).toFixed(2)
    }

    setFormData(nextFormData)
  }

  const displayData = filteredSales.map(sale => ({
    ...sale,
    date: formatDate(sale.date),
    totalSale: formatCurrency(sale.totalSale),
    cashSale: formatCurrency(sale.cashSale),
    onlineSale: formatCurrency(sale.onlineSale)
  }))

  const totalSale = sales.reduce((sum, s) => sum + s.totalSale, 0)
  const totalCash = sales.reduce((sum, s) => sum + s.cashSale, 0)
  const totalOnline = sales.reduce((sum, s) => sum + s.onlineSale, 0)

  return (
    <div className="sales-page">
      <div className="page-header">
        <h1>💰 Sales Management</h1>
        <button className="btn-primary" onClick={() => {
          resetForm()
          setModalOpen(true)
        }}>
          ➕ Add New Sale
        </button>
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

      <div className="summary-cards">
        <div className="summary-card">
          <h4>Total Sales</h4>
          <p className="value">{formatCurrency(totalSale)}</p>
        </div>
        <div className="summary-card">
          <h4>Cash Sales</h4>
          <p className="value">{formatCurrency(totalCash)}</p>
        </div>
        <div className="summary-card">
          <h4>Online Sales</h4>
          <p className="value">{formatCurrency(totalOnline)}</p>
        </div>
        <div className="summary-card">
          <h4>Transactions</h4>
          <p className="value">{sales.length}</p>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <Table 
          columns={['date', 'totalSale', 'cashSale', 'onlineSale']}
          data={displayData}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <Modal isOpen={modalOpen} title={editingId ? 'Edit Sale' : 'Add New Sale'} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Date *</label>
            <input 
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Total Sale Amount *</label>
            <input 
              type="number"
              step="0.01"
              inputMode="decimal"
              value={formData.totalSale}
              onChange={(e) => setFormData({...formData, totalSale: e.target.value === '' ? '' : parseFloat(e.target.value)})}
              required
            />
          </div>

          <div className="form-group">
            <label>Cash Sale *</label>
            <input 
              type="number"
              step="0.01"
              inputMode="decimal"
              value={formData.cashSale}
              onChange={(e) => updateSaleValues('cashSale', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Online Sale *</label>
            <input 
              type="number"
              step="0.01"
              inputMode="decimal"
              value={formData.onlineSale}
              onChange={(e) => updateSaleValues('onlineSale', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea 
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows="3"
            ></textarea>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Save Sale</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Sales
