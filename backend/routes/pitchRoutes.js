import express from 'express';
import {
  createPitch,
  getPitches,
  getPitchById,
  updatePitch,
  deletePitch,
  createPitchComment,
  getUserPitches,
} from '../controllers/pitchController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getPitches)
  .post(protect, createPitch);

router.route('/:id')
  .get(getPitchById)
  .put(protect, updatePitch)
  .delete(protect, deletePitch);

router.route('/:id/comments').post(protect, createPitchComment);
router.route('/user/:userId').get(getUserPitches);

export default router;