const User = require('../models/User');

// Require login
const requireLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
};

// Require admin
const requireAdmin = async (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  
  // Cache admin status in session
  if (req.session.user && req.session.user.isAdmin !== undefined) {
    req.user = { isAdmin: req.session.user.isAdmin };
    return next();
  }
  
  try {
    const user = await User.findById(req.session.userId).select('isAdmin');
    if (!user || !user.isAdmin) {
      return res.status(403).render('error', { message: 'Admin access required' });
    }
    req.session.user.isAdmin = true;
    req.user = user;
    next();
  } catch (err) {
    res.status(500).render('error', { message: 'Server error' });
  }
};

module.exports = { requireLogin, requireAdmin };
