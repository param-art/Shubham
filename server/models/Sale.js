const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  totalSale: {
    type: Number,
    required: true
  },
  cashSale: {
    type: Number,
    required: true,
    default: 0
  },
  onlineSale: {
    type: Number,
    required: true,
    default: 0
  },
  items: [{
    name: String,
    quantity: Number,
    price: Number,
    total: Number
  }],
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

saleSchema.index({ date: 1 });

module.exports = mongoose.model('Sale', saleSchema);
