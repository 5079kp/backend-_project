const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  sessionId: String,
  bookId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Book',
    required: true 
  },
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: String,
  quantity: {
    type: Number,
    default: 1,
    min: 1
  }
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
