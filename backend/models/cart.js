const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  
})
// Export model with collection name 'orders':
module.exports = mongoose.model('Cart', orderSchema);
