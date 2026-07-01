const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  supplierName: {
    type: String,
    required: true
  },
  totalPurchase: {
    type: Number,
    required: true
  },
  items: [{
    name: String,
    quantity: Number,
    unitPrice: Number,
    total: Number
  }],
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Check', 'Online Transfer', 'Other'],
    default: 'Cash'
  },
  invoiceNumber: String,
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

purchaseSchema.index({ date: 1 });
purchaseSchema.index({ supplierName: 1 });

module.exports = mongoose.model('Purchase', purchaseSchema);
