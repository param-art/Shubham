import React, { useState, useEffect } from 'react'
import Modal from '../components/Modal'
import Table from '../components/Table'
import { api } from '../utils/api'
import { formatCurrency, formatDate } from '../utils/helpers'
import './Sales.css'

function Purchases() {
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'))
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    supplierName: '',
    totalPurchase: '',
    items: [],
    paymentMethod: 'Cash',
    invoiceNumber: '',
    notes: ''
  })

  useEffect(() => {
    fetchPurchases()
  }, [selectedMonth, selectedYear])

  const fetchPurchases = async () => {
    try {
      setLoading(true)
      const response = await api.getMonthlyPurchaseReport(selectedYear, selectedMonth)
      setPurchases(response.data.purchases || [])
    } catch (error) {
      console.error('Error fetching purchases:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.updatePurchase(editingId, formData)
        console.log('Purchase updated successfully')
      } else {
        await api.addPurchase(formData)
        console.log('Purchase added successfully')
      }
      resetForm()
      setModalOpen(false)
      fetchPurchases()
    } catch (error) {
      console.error('Error saving purchase:', error)
    }
  }

  const handleEdit = (purchase) => {
    setEditingId(purchase._id)
    setFormData({
      ...purchase,
      date: new Date(purchase.date).toISOString().split('T')[0]
    })
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
    try {
      await api.deletePurchase(id)
      console.log('Purchase deleted successfully')
      fetchPurchases()
    } catch (error) {
      console.error('Error deleting purchase:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      supplierName: '',
      totalPurchase: '',
      items: [],
      paymentMethod: 'Cash',
      invoiceNumber: '',
      notes: ''
    })
    setEditingId(null)
  }

  const displayData = purchases.map(purchase => ({
    ...purchase,
    date: formatDate(purchase.date),
    totalPurchase: formatCurrency(purchase.totalPurchase)
  }))

  const totalPurchase = purchases.reduce((sum, p) => sum + p.totalPurchase, 0)
  const suppliers = new Set(purchases.map(p => p.supplierName))

  return (
    <div className="purchases-page">
      <div className="page-header">
        <h1>📦 Purchases Management</h1>
        <button className="btn-primary" onClick={() => {
          resetForm()
          setModalOpen(true)
        }}>
          ➕ Add New Purchase
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
          <h4>Total Purchase</h4>
          <p className="value">{formatCurrency(totalPurchase)}</p>
        </div>
        <div className="summary-card">
          <h4>Suppliers</h4>
          <p className="value">{suppliers.size}</p>
        </div>
        <div className="summary-card">
          <h4>Transactions</h4>
          <p className="value">{purchases.length}</p>
        </div>
        <div className="summary-card">
          <h4>Avg Purchase</h4>
          <p className="value">{formatCurrency(totalPurchase / (purchases.length || 1))}</p>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <Table 
          columns={['date', 'supplierName', 'totalPurchase', 'paymentMethod']}
          data={displayData}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <Modal isOpen={modalOpen} title={editingId ? 'Edit Purchase' : 'Add New Purchase'} onClose={() => setModalOpen(false)}>
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
            <label>Supplier Name *</label>
            <input 
              type="text"
              value={formData.supplierName}
              onChange={(e) => setFormData({...formData, supplierName: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Total Purchase Amount *</label>
            <input 
              type="number"
              step="0.01"
              inputMode="decimal"
              value={formData.totalPurchase}
              onChange={(e) => setFormData({...formData, totalPurchase: parseFloat(e.target.value)})}
              required
            />
          </div>

          <div className="form-group">
            <label>Payment Method</label>
            <select 
              value={formData.paymentMethod}
              onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
            >
              <option>Cash</option>
              <option>Check</option>
              <option>Online Transfer</option>
              <option>Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Invoice Number</label>
            <input 
              type="text"
              value={formData.invoiceNumber}
              onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
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
            <button type="submit" className="btn-primary">Save Purchase</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Purchases
