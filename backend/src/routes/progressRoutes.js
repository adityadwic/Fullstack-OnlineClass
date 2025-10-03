const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authPrisma');
const {
  getCourseProgress,
  markVideoComplete,
  getAllProgress
} = require('../controllers/progressController');

// All routes are protected
router.use(auth);

// Get all user progress across all courses
router.get('/', getAllProgress);

// Get progress for specific course
router.get('/:courseId', getCourseProgress);

// Mark video as complete
router.post('/:courseId/video/:videoId/complete', markVideoComplete);

module.exports = router;
