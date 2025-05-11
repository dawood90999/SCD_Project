import asyncHandler from 'express-async-handler';
import Pitch from '../models/pitchModel.js';

// @desc    Create a new pitch
// @route   POST /api/pitches
// @access  Private
export const createPitch = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    tags,
    contactEmail,
    contactPhone,
    website,
  } = req.body;

  const pitch = new Pitch({
    user: req.user._id,
    title,
    description,
    category,
    tags: tags || [],
    contactEmail,
    contactPhone: contactPhone || '',
    website: website || '',
  });

  const createdPitch = await pitch.save();
  res.status(201).json(createdPitch);
});

// @desc    Get all pitches
// @route   GET /api/pitches
// @access  Public
export const getPitches = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  
  const keyword = req.query.keyword
    ? {
        $or: [
          { title: { $regex: req.query.keyword, $options: 'i' } },
          { description: { $regex: req.query.keyword, $options: 'i' } },
          { tags: { $regex: req.query.keyword, $options: 'i' } },
        ],
      }
    : {};

  const category = req.query.category ? { category: req.query.category } : {};
  const status = req.query.status ? { status: req.query.status } : {};

  const count = await Pitch.countDocuments({
    ...keyword,
    ...category,
    ...status,
  });
  
  const pitches = await Pitch.find({
    ...keyword,
    ...category,
    ...status,
  })
    .populate('user', 'name profileImage')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    pitches,
    page,
    pages: Math.ceil(count / pageSize),
    totalPitches: count,
  });
});

// @desc    Get pitch by ID
// @route   GET /api/pitches/:id
// @access  Public
export const getPitchById = asyncHandler(async (req, res) => {
  const pitch = await Pitch.findById(req.params.id).populate(
    'user',
    'name profileImage email bio'
  );

  if (pitch) {
    // Increment view count
    pitch.views += 1;
    await pitch.save();
    
    res.json(pitch);
  } else {
    res.status(404);
    throw new Error('Pitch not found');
  }
});

// @desc    Update a pitch
// @route   PUT /api/pitches/:id
// @access  Private
export const updatePitch = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    tags,
    contactEmail,
    contactPhone,
    website,
    status,
  } = req.body;

  const pitch = await Pitch.findById(req.params.id);

  if (pitch) {
    // Check if the user is the owner of the pitch
    if (pitch.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized to update this pitch');
    }

    pitch.title = title || pitch.title;
    pitch.description = description || pitch.description;
    pitch.category = category || pitch.category;
    pitch.tags = tags || pitch.tags;
    pitch.contactEmail = contactEmail || pitch.contactEmail;
    pitch.contactPhone = contactPhone || pitch.contactPhone;
    pitch.website = website || pitch.website;
    pitch.status = status || pitch.status;

    const updatedPitch = await pitch.save();
    res.json(updatedPitch);
  } else {
    res.status(404);
    throw new Error('Pitch not found');
  }
});

// @desc    Delete a pitch
// @route   DELETE /api/pitches/:id
// @access  Private
export const deletePitch = asyncHandler(async (req, res) => {
  const pitch = await Pitch.findById(req.params.id);

  if (pitch) {
    // Check if the user is the owner of the pitch
    if (pitch.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized to delete this pitch');
    }

    await Pitch.deleteOne({ _id: req.params.id });
    res.json({ message: 'Pitch removed' });
  } else {
    res.status(404);
    throw new Error('Pitch not found');
  }
});

// @desc    Create a new comment
// @route   POST /api/pitches/:id/comments
// @access  Private
export const createPitchComment = asyncHandler(async (req, res) => {
  const { text } = req.body;

  const pitch = await Pitch.findById(req.params.id);

  if (pitch) {
    const comment = {
      user: req.user._id,
      text,
      name: req.user.name,
    };

    pitch.comments.push(comment);
    await pitch.save();
    res.status(201).json({ message: 'Comment added' });
  } else {
    res.status(404);
    throw new Error('Pitch not found');
  }
});

// @desc    Get user pitches
// @route   GET /api/pitches/user/:userId
// @access  Public
export const getUserPitches = asyncHandler(async (req, res) => {
  const pitches = await Pitch.find({ user: req.params.userId }).sort({
    createdAt: -1,
  });
  
  res.json(pitches);
});