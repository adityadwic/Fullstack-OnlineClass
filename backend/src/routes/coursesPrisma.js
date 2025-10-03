const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  getMyCourses
} = require('../controllers/courseControllerPrisma');
const { auth, authorize } = require('../middleware/authPrisma');

// Public routes
router.get('/', getCourses);

// Protected routes - put specific routes before :id routes
router.get('/my-courses', auth, getMyCourses);
router.post('/:id/enroll', auth, enrollCourse);

// Course CRUD
router.post('/', auth, authorize('INSTRUCTOR', 'ADMIN'), createCourse);
router.get('/:id', getCourse);
router.put('/:id', auth, authorize('INSTRUCTOR', 'ADMIN'), updateCourse);
router.delete('/:id', auth, authorize('INSTRUCTOR', 'ADMIN'), deleteCourse);

module.exports = router;
