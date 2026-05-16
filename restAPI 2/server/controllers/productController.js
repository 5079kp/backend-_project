import Product from "../models/Product.js";
const getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 8;
    const page = Number(req.query.pageNumber) || 1;
    
    // Fixed: Add price range filtering
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : 0;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : Infinity;
    
    // Fixed: Add rating filter
    const minRating = req.query.minRating ? Number(req.query.minRating) : 0;
    
    // Fixed: Fix keyword search to include description and category
    const keyword = req.query.keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: "i" } },
            { description: { $regex: req.query.keyword, $options: "i" } },
            { category: { $regex: req.query.keyword, $options: "i" } }
          ]
        }
      : {};
    
    const category = req.query.category
      ? { category: req.query.category }
      : {};
    
    // Fixed: Add sorting options
    let sortOption = {};
    const sortBy = req.query.sortBy;
    
    switch(sortBy) {
      case "price_asc":
        sortOption = { price: 1 };
        break;
      case "price_desc":
        sortOption = { price: -1 };
        break;
      case "rating":
        sortOption = { rating: -1 };
        break;
      case "newest":
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }
    
    const query = {
      ...keyword,
      ...category,
      price: { $gte: minPrice, $lte: maxPrice },
      rating: { $gte: minRating }
    };
    
    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    
    // Fixed: Get unique categories for filter options
    const categories = await Product.distinct("category");
    
    res.json({
      success: true,
      products,
      page,
      pages: Math.ceil(count / pageSize),
      totalProducts: count,
      categories,
      filters: {
        minPrice,
        maxPrice,
        minRating,
        sortBy
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    
    // Fixed: Increment view count for analytics
    product.views = (product.views || 0) + 1;
    await product.save();
    
    res.json({
      success: true,
      product
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      success: false,
      message: error.message
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    await product.deleteOne();
    
    res.json({
      success: true,
      message: "Product removed successfully"
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      success: false,
      message: error.message
    });
  }
};
const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      images,
      category,
      stock, 
      countInStock, 
      brand,
      rating = 0,
      numReviews = 0
    } = req.body;
    
    // Fixed: Validate required fields
    if (!name || !price || !category) {
      res.status(400);
      throw new Error("Name, price, and category are required");
    }
    
    if (price <= 0) {
      res.status(400);
      throw new Error("Price must be greater than 0");
    }
    
    // Fixed: Handle both stock and countInStock field names
    const stockQuantity = stock || countInStock || 0;
    
    if (stockQuantity < 0) {
      res.status(400);
      throw new Error("Stock cannot be negative");
    }
    
    // Fixed: Ensure images is an array
    let productImages = images;
    if (typeof images === "string") {
      productImages = [images];
    } else if (!images || images.length === 0) {
      productImages = ["/images/default-product.jpg"];
    }
    
    const product = new Product({
      name: name.trim(),
      price: Number(price),
      description: description || "",
      images: productImages,
      category,
      countInStock: stockQuantity, 
      brand: brand || "",
      user: req.user._id,
      rating: Number(rating),
      numReviews: Number(numReviews),
      views: 0
    });
    
    const createdProduct = await product.save();
    
    res.status(201).json({
      success: true,
      product: createdProduct,
      message: "Product created successfully"
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      success: false,
      message: error.message
    });
  }
};
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      images,
      category,
      stock,
      countInStock,
      brand,
      rating,
      numReviews
    } = req.body;
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    
    // Fixed: Update only provided fields with validation
    if (name !== undefined) product.name = name.trim();
    
    if (price !== undefined) {
      if (price <= 0) {
        res.status(400);
        throw new Error("Price must be greater than 0");
      }
      product.price = Number(price);
    }
    
    if (description !== undefined) product.description = description;
    
    if (images !== undefined) {
      let productImages = images;
      if (typeof images === "string") {
        productImages = [images];
      }
      product.images = productImages;
    }
    
    if (category !== undefined) product.category = category;
    
    const stockQuantity = stock || countInStock;
    if (stockQuantity !== undefined) {
      if (stockQuantity < 0) {
        res.status(400);
        throw new Error("Stock cannot be negative");
      }
      product.countInStock = Number(stockQuantity);
    }
    
    if (brand !== undefined) product.brand = brand;
    
    if (rating !== undefined) product.rating = Number(rating);
    
    if (numReviews !== undefined) product.numReviews = Number(numReviews);
    
    const updatedProduct = await product.save();
    
    res.json({
      success: true,
      product: updatedProduct,
      message: "Product updated successfully"
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      success: false,
      message: error.message
    });
  }
};
const getTopProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 5;
    
    const products = await Product.find({})
      .sort({ rating: -1 })
      .limit(limit);
    
    res.json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const pageSize = Number(req.query.pageSize) || 8;
    const page = Number(req.query.pageNumber) || 1;
    
    const count = await Product.countDocuments({ category });
    const products = await Product.find({ category })
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    
    if (!products || products.length === 0) {
      res.status(404);
      throw new Error(`No products found in category: ${category}`);
    }
    
    res.json({
      success: true,
      products,
      page,
      pages: Math.ceil(count / pageSize),
      totalProducts: count,
      category
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      success: false,
      message: error.message
    });
  }
};
const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    
    // Fixed: Check if user already reviewed
    const alreadyReviewed = product.reviews?.find(
      (review) => review.user.toString() === req.user._id.toString()
    );
    
    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }
    
    // Fixed: Validate rating
    if (!rating || rating < 1 || rating > 5) {
      res.status(400);
      throw new Error("Rating must be between 1 and 5");
    }
    
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment: comment || "",
      createdAt: Date.now()
    };
    
    if (!product.reviews) {
      product.reviews = [];
    }
    
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
    
    await product.save();
    
    res.status(201).json({
      success: true,
      message: "Review added successfully"
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      success: false,
      message: error.message
    });
  }
};

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  getTopProducts,           
  getProductsByCategory,  
  createProductReview,     
};