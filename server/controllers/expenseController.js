const Expense = require('../models/Expense');

exports.addExpense = async (req, res) => {
  try {
    const { date, dailyExpense, otherExpenses, notes } = req.body;

    const totalExpense = dailyExpense + (otherExpenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0);

    const expense = new Expense({
      date: date || new Date(),
      dailyExpense,
      otherExpenses,
      totalExpense,
      notes
    });

    await expense.save();
    res.status(201).json({ message: 'Expense added successfully', expense });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getExpensesByDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = {};
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const expenses = await Expense.find(query).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDailyExpenseReport = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = new Date(date || new Date());
    
    const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999);

    const expenses = await Expense.find({
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    let totalDaily = 0, totalOther = 0, grandTotal = 0;
    expenses.forEach(exp => {
      totalDaily += exp.dailyExpense;
      exp.otherExpenses?.forEach(oe => {
        totalOther += oe.amount;
      });
      grandTotal += exp.totalExpense;
    });

    res.json({
      date: targetDate.toISOString().split('T')[0],
      totalDailyExpense: totalDaily,
      totalOtherExpense: totalOther,
      grandTotal,
      expenses
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMonthlyExpenseReport = async (req, res) => {
  try {
    const { year, month } = req.query;
    const currentDate = new Date();
    const targetYear = year || currentDate.getFullYear();
    const targetMonth = month || currentDate.getMonth() + 1;

    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    const expenses = await Expense.find({
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 });

    let totalDaily = 0, totalOther = 0, grandTotal = 0;
    expenses.forEach(exp => {
      totalDaily += exp.dailyExpense;
      exp.otherExpenses?.forEach(oe => {
        totalOther += oe.amount;
      });
      grandTotal += exp.totalExpense;
    });

    res.json({
      month: targetMonth,
      year: targetYear,
      totalDailyExpense: totalDaily,
      totalOtherExpense: totalOther,
      grandTotal,
      expenseCount: expenses.length,
      expenses
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.updatedAt = new Date();

    const expense = await Expense.findByIdAndUpdate(id, updates, { new: true });
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json({ message: 'Expense updated successfully', expense });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
