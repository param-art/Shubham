const Sale = require('../models/Sale');
const Expense = require('../models/Expense');
const Purchase = require('../models/Purchase');

exports.getComprehensiveReport = async (req, res) => {
  try {
    const { year, month } = req.query;
    const currentDate = new Date();
    const targetYear = year || currentDate.getFullYear();
    const targetMonth = month || currentDate.getMonth() + 1;

    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    // Get sales data
    const sales = await Sale.find({
      date: { $gte: startDate, $lte: endDate }
    });

    // Get expense data
    const expenses = await Expense.find({
      date: { $gte: startDate, $lte: endDate }
    });

    // Get purchase data
    const purchases = await Purchase.find({
      date: { $gte: startDate, $lte: endDate }
    });

    let totalSale = 0, totalCash = 0, totalOnline = 0;
    sales.forEach(sale => {
      totalSale += sale.totalSale;
      totalCash += sale.cashSale;
      totalOnline += sale.onlineSale;
    });

    let totalExpense = 0, totalDailyExpense = 0, totalOtherExpense = 0;
    expenses.forEach(exp => {
      totalExpense += exp.totalExpense;
      totalDailyExpense += exp.dailyExpense;
      exp.otherExpenses?.forEach(oe => {
        totalOtherExpense += oe.amount;
      });
    });

    let totalPurchase = 0;
    purchases.forEach(purchase => {
      totalPurchase += purchase.totalPurchase;
    });

    const profit = totalSale - totalExpense - totalPurchase;
    const profitMargin = totalSale > 0 ? ((profit / totalSale) * 100).toFixed(2) : 0;

    res.json({
      period: {
        month: targetMonth,
        year: targetYear
      },
      sales: {
        total: totalSale,
        cash: totalCash,
        online: totalOnline,
        count: sales.length
      },
      expenses: {
        total: totalExpense,
        daily: totalDailyExpense,
        other: totalOtherExpense,
        count: expenses.length
      },
      purchases: {
        total: totalPurchase,
        count: purchases.length
      },
      profitLoss: {
        grossProfit: totalSale - totalPurchase,
        netProfit: profit,
        profitMargin: parseFloat(profitMargin)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDashboardData = async (req, res) => {
  try {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const [sales, expenses, purchases] = await Promise.all([
      Sale.find({ date: { $gte: startDate, $lte: endDate } }),
      Expense.find({ date: { $gte: startDate, $lte: endDate } }),
      Purchase.find({ date: { $gte: startDate, $lte: endDate } })
    ]);

    let totalSale = 0, totalCash = 0, totalOnline = 0;
    let dailySales = {};
    
    sales.forEach(sale => {
      totalSale += sale.totalSale;
      totalCash += sale.cashSale;
      totalOnline += sale.onlineSale;
      
      const dateKey = sale.date.toISOString().split('T')[0];
      dailySales[dateKey] = (dailySales[dateKey] || 0) + sale.totalSale;
    });

    let totalExpense = 0;
    expenses.forEach(exp => {
      totalExpense += exp.totalExpense;
    });

    let totalPurchase = 0;
    purchases.forEach(purchase => {
      totalPurchase += purchase.totalPurchase;
    });

    res.json({
      currentMonth: {
        month,
        year
      },
      summary: {
        totalSale,
        totalCash,
        totalOnline,
        totalExpense,
        totalPurchase,
        netProfit: totalSale - totalExpense - totalPurchase
      },
      dailySales,
      chartData: {
        salesCount: sales.length,
        expenseCount: expenses.length,
        purchaseCount: purchases.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
