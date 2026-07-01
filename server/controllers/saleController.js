const Sale = require('../models/Sale');

exports.addSale = async (req, res) => {
  try {
    const { date, totalSale, cashSale, onlineSale, items, notes } = req.body;

    const sale = new Sale({
      date: date || new Date(),
      totalSale,
      cashSale,
      onlineSale,
      items,
      notes
    });

    await sale.save();
    res.status(201).json({ message: 'Sale added successfully', sale });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSalesByDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = {};
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const sales = await Sale.find(query).sort({ date: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }
    res.json(sale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSale = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.updatedAt = new Date();

    const sale = await Sale.findByIdAndUpdate(id, updates, { new: true });
    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }
    res.json({ message: 'Sale updated successfully', sale });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndDelete(req.params.id);
    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }
    res.json({ message: 'Sale deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDailySalesReport = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = new Date(date || new Date());
    
    const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999);

    const sales = await Sale.find({
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    let totalCash = 0, totalOnline = 0, totalSale = 0;
    sales.forEach(sale => {
      totalCash += sale.cashSale;
      totalOnline += sale.onlineSale;
      totalSale += sale.totalSale;
    });

    res.json({
      date: targetDate.toISOString().split('T')[0],
      totalSale,
      totalCash,
      totalOnline,
      salesCount: sales.length,
      sales
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMonthlySalesReport = async (req, res) => {
  try {
    const { year, month } = req.query;
    const currentDate = new Date();
    const targetYear = year || currentDate.getFullYear();
    const targetMonth = month || currentDate.getMonth() + 1;

    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    const sales = await Sale.find({
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 });

    let totalCash = 0, totalOnline = 0, totalSale = 0;
    sales.forEach(sale => {
      totalCash += sale.cashSale;
      totalOnline += sale.onlineSale;
      totalSale += sale.totalSale;
    });

    res.json({
      month: targetMonth,
      year: targetYear,
      totalSale,
      totalCash,
      totalOnline,
      salesCount: sales.length,
      sales
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
