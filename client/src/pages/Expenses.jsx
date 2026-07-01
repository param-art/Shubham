import React, { useState, useEffect } from 'react'
import Modal from '../components/Modal'
import Table from '../components/Table'
import { api } from '../utils/api'
import { formatCurrency, formatDate } from '../utils/helpers'
import './Sales.css'

function Expenses() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'))
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    dailyExpense: '',
    otherExpenses: [],
    notes: ''
  })
  const [newOtherExpense, setNewOtherExpense] = useState({ name: '', amount: '' })

  useEffect(() => {
    fetchExpenses()
  }, [selectedMonth, selectedYear])

  const fetchExpenses = async () => {
    try {
      setLoading(true)
      const response = await api.getMonthlyExpenseReport(selectedYear, selectedMonth)
      setExpenses(response.data.expenses || [])
    } catch (error) {
      console.error('Error fetching expenses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.updateExpense(editingId, formData)
        console.log('Expense updated successfully')
      } else {
        await api.addExpense(formData)
        console.log('Expense added successfully')
      }
      resetForm()
      setModalOpen(false)
      fetchExpenses()
    } catch (error) {
      console.error('Error saving expense:', error)
    }
  }

  const handleEdit = (expense) => {
    setEditingId(expense._id)
    setFormData({
      ...expense,
      date: new Date(expense.date).toISOString().split('T')[0]
    })
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
    try {
      await api.deleteExpense(id)
      console.log('Expense deleted successfully')
      fetchExpenses()
    } catch (error) {
      console.error('Error deleting expense:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      dailyExpense: '',
      otherExpenses: [],
      notes: ''
    })
    setNewOtherExpense({ name: '', amount: '' })
    setEditingId(null)
  }

  const addOtherExpense = () => {
    if (newOtherExpense.name && newOtherExpense.amount) {
      setFormData({
        ...formData,
        otherExpenses: [...formData.otherExpenses, { ...newOtherExpense, amount: parseFloat(newOtherExpense.amount) }]
      })
      setNewOtherExpense({ name: '', amount: '' })
    }
  }

  const removeOtherExpense = (index) => {
    setFormData({
      ...formData,
      otherExpenses: formData.otherExpenses.filter((_, i) => i !== index)
    })
  }

  const startEditingOtherExpense = (index) => {
    const expenseToEdit = formData.otherExpenses[index]
    setNewOtherExpense({
      name: expenseToEdit.name,
      amount: expenseToEdit.amount
    })
    setFormData({
      ...formData,
      otherExpenses: formData.otherExpenses.filter((_, i) => i !== index)
    })
  }

  const displayData = expenses.map(expense => ({
    ...expense,
    date: formatDate(expense.date),
    dailyExpense: formatCurrency(expense.dailyExpense),
    totalExpense: formatCurrency(expense.totalExpense)
  }))

  const totalDaily = expenses.reduce((sum, e) => sum + e.dailyExpense, 0)
  const totalOther = expenses.reduce((sum, e) => sum + (e.otherExpenses?.reduce((s, oe) => s + oe.amount, 0) || 0), 0)
  const grandTotal = expenses.reduce((sum, e) => sum + e.totalExpense, 0)

  return (
    <div className="expenses-page">
      <div className="page-header">
        <h1>💸 Expenses Management</h1>
        <button className="btn-primary" onClick={() => {
          resetForm()
          setModalOpen(true)
        }}>
          ➕ Add New Expense
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
          <h4>Daily Expense</h4>
          <p className="value">{formatCurrency(totalDaily)}</p>
        </div>
        <div className="summary-card">
          <h4>Other Expense</h4>
          <p className="value">{formatCurrency(totalOther)}</p>
        </div>
        <div className="summary-card">
          <h4>Total Expense</h4>
          <p className="value">{formatCurrency(grandTotal)}</p>
        </div>
        <div className="summary-card">
          <h4>Entries</h4>
          <p className="value">{expenses.length}</p>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <Table 
            columns={['date', 'dailyExpense', 'totalExpense']}
            data={displayData}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <div className="detailed-breakdown" style={{ marginTop: '20px' }}>
            <h3>Other Expense Breakdown</h3>
            {expenses.some(expense => expense.otherExpenses?.length) ? (
              <div className="breakdown-items">
                {expenses.flatMap((expense) =>
                  (expense.otherExpenses || []).map((item, index) => ({
                    ...item,
                    expenseDate: expense.date,
                    expenseId: `${expense._id}-${index}`
                  }))
                ).map((item) => (
                  <div key={item.expenseId} className="breakdown-item">
                    <span>{formatDate(item.expenseDate)} • {item.name}</span>
                    <strong>{formatCurrency(item.amount)}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">No other expenses found</div>
            )}
          </div>
        </>
      )}

      <Modal isOpen={modalOpen} title={editingId ? 'Edit Expense' : 'Add New Expense'} onClose={() => setModalOpen(false)}>
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
            <label>Daily Expense *</label>
            <input 
              type="number"
              step="0.01"
              inputMode="decimal"
              value={formData.dailyExpense}
              onChange={(e) => setFormData({...formData, dailyExpense: parseFloat(e.target.value) || 0})}
              required
            />
          </div>

          <div className="form-group">
            <label>Other Expenses</label>
            <div style={{ marginBottom: '10px', padding: '10px', backgroundColor: 'rgba(57, 255, 20, 0.05)', borderRadius: '4px' }}>
              {formData.otherExpenses.length === 0 ? (
                <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>No other expenses added yet.</div>
              ) : (
                formData.otherExpenses.map((exp, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', gap: '10px' }}>
                    <span>{exp.name} - {formatCurrency(exp.amount)}</span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button 
                        type="button"
                        onClick={() => startEditingOtherExpense(index)}
                        style={{ padding: '4px 8px', background: 'rgba(57, 255, 20, 0.15)', color: 'var(--neon-green)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Edit
                      </button>
                      <button 
                        type="button"
                        onClick={() => removeOtherExpense(index)}
                        style={{ padding: '4px 8px', background: 'rgba(255, 23, 68, 0.2)', color: 'var(--danger-color)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <input 
                type="text"
                placeholder="Expense name"
                value={newOtherExpense.name}
                onChange={(e) => setNewOtherExpense({...newOtherExpense, name: e.target.value})}
              />
              <input 
                type="number"
                step="0.01"
                inputMode="decimal"
                placeholder="Amount"
                value={newOtherExpense.amount}
                onChange={(e) => setNewOtherExpense({...newOtherExpense, amount: e.target.value})}
              />
              <button 
                type="button"
                onClick={addOtherExpense}
                className="btn-primary"
              >
                {newOtherExpense.name || newOtherExpense.amount ? 'Save Entry' : 'Add'}
              </button>
            </div>
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
            <button type="submit" className="btn-primary">Save Expense</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Expenses
