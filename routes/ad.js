const express = require('express');
const router = express.Router();
const Ad = require('../models/ad');
const User = require('../models/user');

// Create an ad request
router.post('/create', async (req, res, next) => {
  try {
    const { audience, platform, senderId, adContent, userId } = req.body;
    
    // Calculate reach and bill based on your business logic
    // For simplicity, let's assume reach is the sum of characters in adContent
    const reach = adContent.length;
    const bill = calculateBill(reach, platform); // Implement calculateBill function
    
    const ad = new Ad({
      audience,
      reach,
      platform,
      senderId,
      adContent,
      bill,
      userId,
    });

    await ad.save();
    
//     sendEmail('olasubomifemi98@gmail.com', 'New Ad Created', `New Ad Created. Ad ID: ${ad._id},  audience: ${audience},
//     reach: ${reach},
//     platform: ${platform},
// senderId: ${senderId},
//     adContent: ${adContent},
//     bill: ${bill},
//     userId: ${userId},`);
    res.status(201).json({ message: 'Ad request created successfully', ad });
  } catch (error) {
    next(error);
  }
});

router.get('/history/:userId', async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const ads = await Ad.find({ userId }).sort({ 'timestamps.created': -1 });
  
      res.status(200).json({ ads });
    } catch (error) {
      next(error);
    }
  });

  
  router.get('/:adId', async (req, res, next) => {
    try {
      const adId = req.params.adId;
      const ad = await Ad.findById(adId);
  
      if (!ad) {
        return res.status(404).json({ message: 'Ad not found' });
      }
  
      res.status(200).json({ ad });
    } catch (error) {
      next(error);
    }
  });

  // Edit an ad
router.put('/:adId', async (req, res, next) => {
    try {
      const adId = req.params.adId;
      const { audience, platform, senderId, adContent } = req.body;
  
      const ad = await Ad.findByIdAndUpdate(
        adId,
        { audience, platform, senderId, adContent, 'timestamps.updated': Date.now() },
        { new: true }
      );
  
      if (!ad) {
        return res.status(404).json({ message: 'Ad not found' });
      }
  
      res.status(200).json({ message: 'Ad updated successfully', ad });
    } catch (error) {
      next(error);
    }
  });
  // Cancel an ad
router.delete('/:adId', async (req, res, next) => {
    try {
      const adId = req.params.adId;
  
      const ad = await Ad.findByIdAndUpdate(adId, { status: 'canceled' }, { new: true });
  
      if (!ad) {
        return res.status(404).json({ message: 'Ad not found' });
      }
  
      res.status(200).json({ message: 'Ad canceled successfully', ad });
    } catch (error) {
      next(error);
    }
  });

  // Handle Paystack webhook
router.post('/webhook', async (req, res, next) => {
    try {
      const { adId, status } = req.body; // Assuming Paystack sends adId and status in the webhook payload
  
      const ad = await Ad.findByIdAndUpdate(adId, { paid: status === 'success', 'timestamps.paid': Date.now() }, { new: true });
  
      if (!ad) {
        return res.status(404).json({ message: 'Ad not found' });
      }
  
      // Send email to user and back office
      const userEmail = await User.findById(ad.userId).select('email');
  
      sendEmail(userEmail, 'Ad Payment Confirmation', `Your ad payment has been confirmed. Ad ID: ${ad._id}`);
      sendEmail('olasubomifemi98@gmail.com', 'New Ad Payment', `New ad payment confirmed. Ad ID: ${ad._id}`);
  
      res.status(200).json({ message: 'Webhook processed successfully' });
    } catch (error) {
      next(error);
    }
  });

// Calculate bill based on reach and platform (add your business logic)
function calculateBill(reach, platform) {
  // Implement your bill calculation logic here
  // For example, let's say $0.05 per character for SMS and $0.1 per character for email
  const rate = platform === 'sms' ? 0.05 : 0.1;
  return reach * rate;
}

module.exports = router;
