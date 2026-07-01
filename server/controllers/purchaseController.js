const Purchase = require('../models/Purchase');

exports.addPurchase = async (req, res) => {
  try {
    const { date, supplierName, totalPurchase, items, paymentMethod, invoiceNumber, notes } = req.body;

    const purchase = new Purchase({
      date: date || new Date(),
      supplierName,
      totalPurchase,
      items,
      paymentMethod,
      invoiceNumber,
      notes
    });

    await purchase.save();
    res.status(201).json({ message: 'Purchase added successfully', purchase });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPurchasesByDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = {};
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const purchases = await Purchase.find(query).sort({ date: -1 });
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPurchasesBySupplier = async (req, res) => {
  try {
    const { supplierName } = req.query;

    const purchases = await Purchase.find({ supplierName }).sort({ date: -1 });
    let totalPurchase = 0;
    purchases.forEach(p => {
      totalPurchase += p.totalPurchase;
    });

    res.json({
      supplier: supplierName,
      totalAmount: totalPurchase,
      purchaseCount: purchases.length,
      purchases
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDailyPurchaseReport = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = new Date(date || new Date());
    
    const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999);

    const purchases = await Purchase.find({
      date: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ date: -1 });

    let totalPurchase = 0;
    const supplierBreakdown = {};

    purchases.forEach(purchase => {
      totalPurchase += purchase.totalPurchase;
      if (!supplierBreakdown[purchase.supplierName]) {
        supplierBreakdown[purchase.supplierName] = 0;
      }
      supplierBreakdown[purchase.supplierName] += purchase.totalPurchase;
    });

    res.json({
      date: targetDate.toISOString().split('T')[0],
      totalPurchase,
      purchaseCount: purchases.length,
      supplierBreakdown,
      purchases
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMonthlyPurchaseReport = async (req, res) => {
  try {
    const { year, month } = req.query;
    const currentDate = new Date();
    const targetYear = year || currentDate.getFullYear();
    const targetMonth = month || currentDate.getMonth() + 1;

    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    const purchases = await Purchase.find({
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 });

    let totalPurchase = 0;
    const supplierBreakdown = {};

    purchases.forEach(purchase => {
      totalPurchase += purchase.totalPurchase;
      if (!supplierBreakdown[purchase.supplierName]) {
        supplierBreakdown[purchase.supplierName] = 0;
      }
      supplierBreakdown[purchase.supplierName] += purchase.totalPurchase;
    });

    res.json({
      month: targetMonth,
      year: targetYear,
      totalPurchase,
      purchaseCount: purchases.length,
      supplierBreakdown,
      purchases
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.updatedAt = new Date();

    const purchase = await Purchase.findByIdAndUpdate(id, updates, { new: true });
    if (!purchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }
    res.json({ message: 'Purchase updated successfully', purchase });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndDelete(req.params.id);
    if (!purchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }
    res.json({ message: 'Purchase deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
