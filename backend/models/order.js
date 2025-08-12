const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  id: {
    type: Number,
    
   
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  pin: {
    type: Number,
    required: true,
  },
  phone: {
   type: Number, required: true,
  },
  productname: {
    type: String,
    required: true,
    trim: true,
  },
  orderDate: {
  type: String,
  default: () => {
    const d = new Date();
    return d.toLocaleDateString(); // e.g. "8/12/2025"
  }
},
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Placed", "Shipped", "OutForDelivery", "Delivered", "Returned", "Cancelled"],// example statuses
    default: 'Placed',
  },
  Deliverable: {
  type: String,
  default: () => {
    const d = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000);
    return `${d.toLocaleDateString('en-US', { weekday: 'long' })}, ${d.toLocaleDateString()}`;
    // Example: "Saturday, 8/16/2025"
  }
}
}, {
  timestamps: true, // adds createdAt and updatedAt fields automatically
});

// Export model with collection name 'orders':
module.exports = mongoose.model('Order', orderSchema, 'orders');
