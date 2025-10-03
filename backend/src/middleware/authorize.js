// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please login first.'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. This route is restricted to ${roles.join(', ')} only.`
      });
    }
    
    next();
  };
};

// Check if user is instructor or admin
const isInstructorOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Please login first.'
    });
  }
  
  if (!['instructor', 'admin'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Instructor or Admin access required.'
    });
  }
  
  next();
};

// Check if user owns the resource or is admin
const checkOwnershipOrAdmin = (resourceField = 'instructor') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please login first.'
      });
    }
    
    // Admins can access everything
    if (req.user.role === 'admin') {
      return next();
    }
    
    // Check if user owns the resource
    if (req.resource && req.resource[resourceField]) {
      if (req.resource[resourceField].toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only modify your own resources.'
        });
      }
    }
    
    next();
  };
};

module.exports = {
  authorize,
  isInstructorOrAdmin,
  checkOwnershipOrAdmin
};