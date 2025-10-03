const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload video to Cloudinary
const uploadVideo = async (filePath, options = {}) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'video',
      folder: 'online-learning/videos',
      use_filename: true,
      unique_filename: false,
      overwrite: false,
      ...options
    });
    
    return {
      success: true,
      url: result.secure_url,
      cloudinaryId: result.public_id,
      duration: result.duration,
      format: result.format,
      bytes: result.bytes
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Upload image to Cloudinary
const uploadImage = async (filePath, options = {}) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'image',
      folder: 'online-learning/images',
      use_filename: true,
      unique_filename: false,
      overwrite: false,
      transformation: [
        { width: 1280, height: 720, crop: 'limit' },
        { quality: 'auto' }
      ],
      ...options
    });
    
    return {
      success: true,
      url: result.secure_url,
      cloudinaryId: result.public_id
    };
  } catch (error) {
    console.error('Cloudinary image upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Delete file from Cloudinary
const deleteFile = async (cloudinaryId, resourceType = 'video') => {
  try {
    const result = await cloudinary.uploader.destroy(cloudinaryId, {
      resource_type: resourceType
    });
    
    return {
      success: result.result === 'ok',
      result: result.result
    };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Generate signed URL for secure video access
const generateSignedUrl = (cloudinaryId, options = {}) => {
  try {
    const signedUrl = cloudinary.url(cloudinaryId, {
      resource_type: 'video',
      sign_url: true,
      type: 'authenticated',
      expires_at: Math.floor(Date.now() / 1000) + (3600 * 2), // 2 hours
      ...options
    });
    
    return signedUrl;
  } catch (error) {
    console.error('Cloudinary signed URL error:', error);
    return null;
  }
};

// Get video info
const getVideoInfo = async (cloudinaryId) => {
  try {
    const result = await cloudinary.api.resource(cloudinaryId, {
      resource_type: 'video'
    });
    
    return {
      success: true,
      data: {
        duration: result.duration,
        format: result.format,
        bytes: result.bytes,
        width: result.width,
        height: result.height,
        url: result.secure_url
      }
    };
  } catch (error) {
    console.error('Cloudinary get video info error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  uploadVideo,
  uploadImage,
  deleteFile,
  generateSignedUrl,
  getVideoInfo
};