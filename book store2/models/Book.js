const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title too long']
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true,
    maxlength: [50, 'Author too long']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0.01, 'Price must be positive']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description too long']
  },
  genre: {
    type: String,
    trim: true,
    maxlength: [30]
  },
  image: {
    type: String,
    default: 'default-book.jpg'
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Book', bookSchema);
