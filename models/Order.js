const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  tableNo: { type: String, required: true },
  items: [
    {
      id: String,
      name: String,
      price: Number,
      qty: Number
    }
  ],
  totalPrice: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'cooking', 'ready', 'paid'], 
    default: 'pending' 
  },
  paymentMethod: { type: String, default: '' },
  waiterName: { type: String, default: 'Staff' },
  completedAt: { type: Date }
}, { timestamps: true }); 

module.exports = mongoose.model('Order', OrderSchema);