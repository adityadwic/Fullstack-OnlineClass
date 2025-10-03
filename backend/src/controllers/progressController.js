const { prisma } = require('../utils/prisma');

// @desc    Get user progress for a course
// @route   GET /api/progress/:courseId
// @access  Private
const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Get all progress records for this user and course
    const progressRecords = await prisma.progress.findMany({
      where: {
        userId,
        courseId
      },
      include: {
        video: {
          select: {
            id: true,
            title: true,
            duration: true,
            order: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    // Get course to calculate total
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        _count: {
          select: {
            videos: true
          }
        }
      }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Calculate progress
    const completedVideos = progressRecords
      .filter(p => p.completed)
      .map(p => p.videoId);

    const totalVideos = course._count.videos;
    const completedCount = completedVideos.length;
    const progress = totalVideos > 0 ? Math.round((completedCount / totalVideos) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        courseId,
        completedVideos,
        completedCount,
        totalVideos,
        progress,
        lastWatched: progressRecords[0]?.video || null
      }
    });

  } catch (error) {
    console.error('Get course progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Mark video as complete
// @route   POST /api/progress/:courseId/video/:videoId/complete
// @access  Private
const markVideoComplete = async (req, res) => {
  try {
    const { courseId, videoId } = req.params;
    const userId = req.user.id;

    // Check if enrollment exists
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You are not enrolled in this course'
      });
    }

    // Check if video exists
    const video = await prisma.video.findUnique({
      where: { id: videoId }
    });

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    // Create or update progress
    const progress = await prisma.progress.upsert({
      where: {
        userId_courseId_videoId: {
          userId,
          courseId,
          videoId
        }
      },
      update: {
        completed: true,
        watchedDuration: video.duration,
        lastWatched: new Date(),
        updatedAt: new Date()
      },
      create: {
        userId,
        courseId,
        videoId,
        completed: true,
        watchedDuration: video.duration,
        lastWatched: new Date()
      }
    });

    // Update enrollment progress
    const allProgress = await prisma.progress.findMany({
      where: {
        userId,
        courseId,
        completed: true
      }
    });

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        _count: {
          select: {
            videos: true
          }
        }
      }
    });

    const totalVideos = course._count.videos;
    const completedCount = allProgress.length;
    const progressPercentage = Math.round((completedCount / totalVideos) * 100);

    // Update enrollment
    await prisma.enrollment.update({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      },
      data: {
        progressPercent: progressPercentage,
        status: progressPercentage === 100 ? 'COMPLETED' : 'ACTIVE',
        completionDate: progressPercentage === 100 ? new Date() : null
      }
    });

    res.status(200).json({
      success: true,
      message: 'Video marked as complete',
      data: {
        progress: progressPercentage,
        completedCount,
        totalVideos,
        isCompleted: progressPercentage === 100
      }
    });

  } catch (error) {
    console.error('Mark video complete error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all user progress across all courses
// @route   GET /api/progress
// @access  Private
const getAllProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId
      },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                name: true
              }
            },
            _count: {
              select: {
                videos: true
              }
            }
          }
        },
        _count: {
          select: {
            progress: {
              where: {
                watched: true
              }
            }
          }
        }
      },
      orderBy: {
        enrollmentDate: 'desc'
      }
    });

    const progressData = enrollments.map(enrollment => ({
      courseId: enrollment.courseId,
      courseTitle: enrollment.course.title,
      instructor: enrollment.course.instructor.name,
      progress: enrollment.progress,
      completedVideos: enrollment._count.progress,
      totalVideos: enrollment.course._count.videos,
      status: enrollment.status,
      enrolledAt: enrollment.enrollmentDate,
      completedAt: enrollment.completedAt
    }));

    res.status(200).json({
      success: true,
      count: progressData.length,
      data: progressData
    });

  } catch (error) {
    console.error('Get all progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getCourseProgress,
  markVideoComplete,
  getAllProgress
};
