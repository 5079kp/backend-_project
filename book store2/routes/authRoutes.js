const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const router = express.Router();

// Login GET
router.get('/login', (req, res) => {
  res.render('login', { errors: [] });
});

// Login POST
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
return res.render('login', { errors: errors.array(), email: req.body.email });
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.render('login', { errors: [{ msg: 'Invalid credentials' }] });
    }

    req.session.userId = user._id;
    req.session.user = { email: user.email, isAdmin: user.isAdmin };

    if (user.isAdmin) {
      res.redirect('/admin');
    } else {
      res.redirect('/');
    }
  } catch (err) {
    res.status(500).render('error', { message: 'Login failed' });
  }
});

// Register GET
router.get('/register', (req, res) => {
  res.render('register', { errors: [] });
});

// Register POST
router.post('/register', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords must match');
    }
    return true;
  })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
return res.render('register', { errors: errors.array(), email: req.body.email });
  }

  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
return res.render('register', { errors: [{ msg: 'Email already registered' }], email: req.body.email });
    }

    const user = new User({
      email: req.body.email,
      password: req.body.password,
      isAdmin: req.body.email === 'admin@bookstore.com' || req.body.email === '5079kuldeeppatel@gmail.com' // Auto-admin for default + new admin
    });
    await user.save();
    req.session.userId = user._id;
    req.session.user = { email: user.email, isAdmin: user.isAdmin };
    res.redirect(user.isAdmin ? '/admin' : '/');
  } catch (err) {
    res.status(500).render('error', { message: 'Registration failed' });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/');
    }
    res.redirect('/');
  });
});

module.exports = router;
