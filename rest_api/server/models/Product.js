import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a product name"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Please add a description"],
    },

    price: {
      type: Number,
      required: [true, "Please add a price"],
      default: 0,
    },

    category: {
      type: String,
      required: [true, "Please add a category"],
    },

    stock: {
      type: Number,
      required: [true, "Please add stock quantity"],
      default: 0,
    },

    images: [
      {
        type: String,
        required: true,
      },
    ],

    rating: {
      type: Number,
      default: 0,
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;