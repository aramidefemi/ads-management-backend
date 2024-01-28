const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');

// User registration
router.post('/register', async (req, res, next) => {
  try {
    const { fullname, businessName, email, phoneNumber, businessAddress, password, businessNiche } = req.body;
    const user = new User({
      fullname,
      businessName,
      email,
      phoneNumber,
      businessAddress,
      password,
      businessNiche,
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    next(error);
  }
});

// User login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const token = jwt.sign({user_id: user.id}, '818afad8732918ce6c8910939ca903f76a3ecc5fef7ab75e22f9adaaa4c8e9dc', { expiresIn: '72h' });

    res.status(200).json({ token, expiresIn: 3600, user });
  } catch (error) {
    next(error);
  }
});


  // Get authenticated user profile
  router.get('/profile', checkAuth, async (req, res, next) => {
    try {
      const userId = req.userData.userId;
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Here, you can customize what user data you want to send back
      const userProfile = {
        fullname: user.fullname,
        businessName: user.businessName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        businessAddress: user.businessAddress,
        businessNiche: user.businessNiche,
      };
  
      res.status(200).json({ message: 'Authenticated user profile', user: userProfile });
    } catch (error) {
      next(error);
    }
  });
  
// Logout (Not really needed for JWT, as it's token-based)
router.post('/logout', (req, res, next) => {
  // Perform any logout-related actions (e.g., token invalidation on the client-side)
  res.status(200).json({ message: 'Logout successful' });
});

module.exports = router;
