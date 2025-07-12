const express = require('express');
const { body, validationResult } = require('express-validator');
const Item = require('../models/Item');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { uploadMultiple } = require('../middleware/upload');

const router = express.Router();

// @route   GET /api/items
// @desc    Get all items with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      category,
      condition,
      minPrice,
      maxPrice,
      search,
      sort = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 12
    } = req.query;

    // Build filter object
    const filter = { isAvailable: true };
    
    if (category) filter.category = category;
    if (condition) filter.condition = condition;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Search functionality
    if (search) {
      filter.$text = { $search: search };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;

    const items = await Item.find(filter)
      .populate('seller', 'name avatar location')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Item.countDocuments(filter);

    res.json({
      items,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Get items error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/items/featured
// @desc    Get featured items
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const items = await Item.find({ isFeatured: true, isAvailable: true })
      .populate('seller', 'name avatar location')
      .limit(6)
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    console.error('Get featured items error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/items/:id
// @desc    Get item by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('seller', 'name avatar location bio')
      .populate('wishlistedBy', 'name');

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Increment views
    item.views += 1;
    await item.save();

    res.json(item);
  } catch (error) {
    console.error('Get item error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/items
// @desc    Create a new item
// @access  Private
router.post('/', auth, uploadMultiple, [
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('category').isIn(['Shirts', 'Pants', 'Dresses', 'Shoes', 'Accessories', 'Outerwear', 'Other']).withMessage('Invalid category'),
  body('condition').isIn(['New', 'Like New', 'Excellent', 'Good', 'Fair', 'Poor']).withMessage('Invalid condition'),
  body('size').trim().notEmpty().withMessage('Size is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('points').isInt({ min: 0 }).withMessage('Points must be a positive integer'),
  body('location').trim().notEmpty().withMessage('Location is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);

    const item = new Item({
      ...req.body,
      seller: req.user._id,
      images: imageUrls
    });

    await item.save();

    // Add item to user's listed items
    await User.findByIdAndUpdate(req.user._id, {
      $push: { itemsListed: item._id }
    });

    const populatedItem = await Item.findById(item._id)
      .populate('seller', 'name avatar location');

    res.status(201).json({
      message: 'Item created successfully',
      item: populatedItem
    });
  } catch (error) {
    console.error('Create item error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/items/:id
// @desc    Update an item
// @access  Private
router.put('/:id', auth, [
  body('title').optional().trim().isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('description').optional().trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('points').optional().isInt({ min: 0 }).withMessage('Points must be a positive integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if user owns the item
    if (item.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('seller', 'name avatar location');

    res.json({
      message: 'Item updated successfully',
      item: updatedItem
    });
  } catch (error) {
    console.error('Update item error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/items/:id
// @desc    Delete an item
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if user owns the item
    if (item.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Item.findByIdAndDelete(req.params.id);

    // Remove item from user's listed items
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { itemsListed: req.params.id }
    });

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete item error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/items/:id/wishlist
// @desc    Add/remove item from wishlist
// @access  Private
router.post('/:id/wishlist', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const isWishlisted = item.wishlistedBy.includes(req.user._id);

    if (isWishlisted) {
      // Remove from wishlist
      item.wishlistedBy = item.wishlistedBy.filter(id => id.toString() !== req.user._id.toString());
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { itemsWishlisted: req.params.id }
      });
    } else {
      // Add to wishlist
      item.wishlistedBy.push(req.user._id);
      await User.findByIdAndUpdate(req.user._id, {
        $push: { itemsWishlisted: req.params.id }
      });
    }

    await item.save();

    res.json({
      message: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
      isWishlisted: !isWishlisted
    });
  } catch (error) {
    console.error('Wishlist error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 