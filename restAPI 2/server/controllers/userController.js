import User from "../models/User.js";
import Order from "../models/Order.js";
import bcrypt from "bcryptjs"; 
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    
    // Fixed: Add additional user info
    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      success: false,
      message: error.message
    });
  }
};
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    
    // Fixed: Validate email if being updated
    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists) {
        res.status(400);
        throw new Error("Email already in use");
      }
      user.email = req.body.email;
    }
    
    // Fixed: Validate name
    if (req.body.name) {
      if (req.body.name.trim().length < 2) {
        res.status(400);
        throw new Error("Name must be at least 2 characters");
      }
      user.name = req.body.name.trim();
    }
    
    // Fixed: Validate password strength
    if (req.body.password) {
      if (req.body.password.length < 6) {
        res.status(400);
        throw new Error("Password must be at least 6 characters");
      }
      
      // Optional: Check if new password is different from old
      const isSamePassword = await user.matchPassword(req.body.password);
      if (isSamePassword) {
        res.status(400);
        throw new Error("New password must be different from current password");
      }
      
      user.password = req.body.password;
    }
    
    const updatedUser = await user.save();
    
    // Fixed: Return updated user without password
    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        isVerified: updatedUser.isVerified
      },
      message: "Profile updated successfully"
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      success: false,
      message: error.message
    });
  }
};

const getUsers = async (req, res) => {
  try {
    // Fixed: Add pagination support
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1;
    
    // Fixed: Add search/filter functionality
    const searchTerm = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } }
          ]
        }
      : {};
    
    // Fixed: Add role filter
    const roleFilter = req.query.role
      ? { role: req.query.role }
      : {};
    
    const query = { ...searchTerm, ...roleFilter };
    
    const totalUsers = await User.countDocuments(query);
    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    
    // Fixed: Get user statistics
    const adminCount = await User.countDocuments({ role: "admin" });
    const verifiedCount = await User.countDocuments({ isVerified: true });
    
    res.json({
      success: true,
      data: users,
      pagination: {
        page,
        pageSize,
        totalPages: Math.ceil(totalUsers / pageSize),
        totalUsers
      },
      stats: {
        totalUsers,
        adminCount,
        verifiedCount,
        regularUsers: totalUsers - adminCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    
    // Fixed: Get user order statistics
    const orderCount = await Order.countDocuments({ user: user._id });
    const totalSpent = await Order.aggregate([
      { $match: { user: user._id, isPaid: true } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    
    res.json({
      success: true,
      data: {
        ...user.toObject(),
        orderStats: {
          totalOrders: orderCount,
          totalSpent: totalSpent[0]?.total || 0
        }
      }
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      success: false,
      message: error.message
    });
  }
};
const updateUserByAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    
    // Fixed: Prevent admin from changing their own role
    if (user._id.toString() === req.user._id.toString() && req.body.role && req.body.role !== user.role) {
      res.status(400);
      throw new Error("Admin cannot change their own role");
    }
    
    // Update fields with validation
    if (req.body.name) {
      if (req.body.name.trim().length < 2) {
        res.status(400);
        throw new Error("Name must be at least 2 characters");
      }
      user.name = req.body.name.trim();
    }
    
    if (req.body.email) {
      const emailExists = await User.findOne({ 
        email: req.body.email,
        _id: { $ne: user._id }
      });
      if (emailExists) {
        res.status(400);
        throw new Error("Email already in use");
      }
      user.email = req.body.email;
    }
    
    if (req.body.role) {
      if (!["user", "admin"].includes(req.body.role)) {
        res.status(400);
        throw new Error("Invalid role");
      }
      user.role = req.body.role;
    }
    
    if (req.body.isVerified !== undefined) {
      user.isVerified = req.body.isVerified;
    }
    
    const updatedUser = await user.save();
    
    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        isVerified: updatedUser.isVerified
      },
      message: "User updated successfully"
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      success: false,
      message: error.message
    });
  }
};
const deleteUser = async (req, res) => {
  try {
    // Fixed: Prevent self-deletion
    if (req.params.id === req.user._id.toString()) {
      res.status(400);
      throw new Error("Admin cannot delete their own account");
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    
    // Fixed: Check if user is admin
    if (user.role === "admin") {
      // Check if there's at least one other admin
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        res.status(400);
        throw new Error("Cannot delete the only admin user");
      }
    }
    
    // Fixed: Check if user has active orders
    const activeOrders = await Order.findOne({
      user: user._id,
      isDelivered: false,
      isCancelled: { $ne: true }
    });
    
    if (activeOrders) {
      res.status(400);
      throw new Error("Cannot delete user with active orders");
    }
    // Or hard delete
    await user.deleteOne();
    
    res.json({
      success: true,
      message: `User ${user.name} (${user.email}) has been removed successfully`
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      success: false,
      message: error.message
    });
  }
};
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      res.status(400);
      throw new Error("Current password and new password are required");
    }
    
    if (newPassword.length < 6) {
      res.status(400);
      throw new Error("New password must be at least 6 characters");
    }
    
    const user = await User.findById(req.user._id).select("+password");
    
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    
    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      res.status(401);
      throw new Error("Current password is incorrect");
    }
    
    // Check if new password is different from current
    const isSamePassword = await user.matchPassword(newPassword);
    if (isSamePassword) {
      res.status(400);
      throw new Error("New password must be different from current password");
    }
    
    user.password = newPassword;
    await user.save();
    
    res.json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      success: false,
      message: error.message
    });
  }
};
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: "admin" });
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const unverifiedUsers = await User.countDocuments({ isVerified: false });
    
    // Get users registered in last 30 days
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    const newUsers = await User.countDocuments({
      createdAt: { $gte: last30Days }
    });
    
    // Get registration trends by month
    const registrationTrends = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 6 }
    ]);
    
    res.json({
      success: true,
      stats: {
        totalUsers,
        adminCount,
        verifiedUsers,
        unverifiedUsers,
        newUsersLast30Days: newUsers,
        registrationTrends: registrationTrends.map(trend => ({
          month: `${trend._id.year}-${trend._id.month}`,
          count: trend.count
        }))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export {
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,           
  updateUserByAdmin,     
  deleteUser,
  changePassword,       
  getUserStats,         
};