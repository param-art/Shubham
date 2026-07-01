import axios from 'axios'

const API_BASE = 'http://localhost:5000/api'

export const api = {
  // Sales
  addSale: (data) => axios.post(`${API_BASE}/sales`, data),
  getSales: (startDate, endDate) => axios.get(`${API_BASE}/sales`, { 
    params: { startDate, endDate } 
  }),
  getDailySalesReport: (date) => axios.get(`${API_BASE}/sales/daily-report`, { 
    params: { date } 
  }),
  getMonthlySalesReport: (year, month) => axios.get(`${API_BASE}/sales/monthly-report`, { 
    params: { year, month } 
  }),
  updateSale: (id, data) => axios.put(`${API_BASE}/sales/${id}`, data),
  deleteSale: (id) => axios.delete(`${API_BASE}/sales/${id}`),

  // Expenses
  addExpense: (data) => axios.post(`${API_BASE}/expenses`, data),
  getExpenses: (startDate, endDate) => axios.get(`${API_BASE}/expenses`, { 
    params: { startDate, endDate } 
  }),
  getDailyExpenseReport: (date) => axios.get(`${API_BASE}/expenses/daily-report`, { 
    params: { date } 
  }),
  getMonthlyExpenseReport: (year, month) => axios.get(`${API_BASE}/expenses/monthly-report`, { 
    params: { year, month } 
  }),
  updateExpense: (id, data) => axios.put(`${API_BASE}/expenses/${id}`, data),
  deleteExpense: (id) => axios.delete(`${API_BASE}/expenses/${id}`),

  // Purchases
  addPurchase: (data) => axios.post(`${API_BASE}/purchases`, data),
  getPurchases: (startDate, endDate) => axios.get(`${API_BASE}/purchases`, { 
    params: { startDate, endDate } 
  }),
  getDailyPurchaseReport: (date) => axios.get(`${API_BASE}/purchases/daily-report`, { 
    params: { date } 
  }),
  getMonthlyPurchaseReport: (year, month) => axios.get(`${API_BASE}/purchases/monthly-report`, { 
    params: { year, month } 
  }),
  updatePurchase: (id, data) => axios.put(`${API_BASE}/purchases/${id}`, data),
  deletePurchase: (id) => axios.delete(`${API_BASE}/purchases/${id}`),

  // Reports
  getComprehensiveReport: (year, month) => axios.get(`${API_BASE}/reports/comprehensive`, { 
    params: { year, month } 
  }),
  getDashboardData: () => axios.get(`${API_BASE}/reports/dashboard`)
}
