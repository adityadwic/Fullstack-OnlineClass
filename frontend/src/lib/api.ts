import axios from 'axios'
import type {
  ProfileUpdateData,
  CourseFormData,
  CourseQueryParams,
  VideoFormData,
  QuizFormData,
  UserQueryParams,
  ReviewQueryParams,
  EnrollmentQueryParams,
} from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

// Configure axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (name: string, email: string, password: string, role = 'student') =>
    api.post('/auth/register', { name, email, password, role }),
  me: () => api.get('/auth/me'),
  updateProfile: (data: ProfileUpdateData) => api.put('/auth/profile', data),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/auth/password', { currentPassword, newPassword }),
  logout: () => api.post('/auth/logout'),
}

// Course API
export const courseAPI = {
  getCourses: (params?: CourseQueryParams) => api.get('/courses', { params }),
  getCourse: (id: string) => api.get(`/courses/${id}`),
  createCourse: (data: CourseFormData) => api.post('/courses', data),
  updateCourse: (id: string, data: Partial<CourseFormData>) => api.put(`/courses/${id}`, data),
  deleteCourse: (id: string) => api.delete(`/courses/${id}`),
  getInstructorCourses: (params?: CourseQueryParams) => api.get('/courses/instructor/my-courses', { params }),
  togglePublish: (id: string) => api.patch(`/courses/${id}/publish`),
}

// Video API
export const videoAPI = {
  getCourseVideos: (courseId: string) => api.get(`/videos/course/${courseId}`),
  getVideoStream: (videoId: string) => api.get(`/videos/${videoId}/stream`),
  uploadVideo: (courseId: string, formData: FormData) =>
    api.post(`/videos/upload/${courseId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateVideo: (id: string, data: Partial<VideoFormData>) => api.put(`/videos/${id}`, data),
  deleteVideo: (id: string) => api.delete(`/videos/${id}`),
}

// Quiz API
export const quizAPI = {
  getCourseQuizzes: (courseId: string) => api.get(`/quiz/course/${courseId}`),
  getQuiz: (id: string) => api.get(`/quiz/${id}`),
  createQuiz: (courseId: string, data: QuizFormData) => api.post(`/quiz/${courseId}`, data),
  updateQuiz: (id: string, data: Partial<QuizFormData>) => api.put(`/quiz/${id}`, data),
  deleteQuiz: (id: string) => api.delete(`/quiz/${id}`),
  submitQuiz: (id: string, answers: number[]) => api.post(`/quiz/${id}/submit`, { answers }),
}

// Progress API
export const progressAPI = {
  enrollInCourse: (courseId: string) => api.post(`/progress/enroll/${courseId}`),
  getCourseProgress: (courseId: string) => api.get(`/progress/course/${courseId}`),
  markVideoCompleted: (videoId: string, watchTime?: number) =>
    api.post(`/progress/video/${videoId}/complete`, { watchTime }),
  getMyEnrollments: (params?: EnrollmentQueryParams) => api.get('/progress/my-enrollments', { params }),
  updateLastAccessed: (courseId: string) => api.patch(`/progress/course/${courseId}/access`),
  getCourseStats: (courseId: string) => api.get(`/progress/course/${courseId}/stats`),
}

// Review API
export const reviewAPI = {
  createReview: (courseId: string, rating: number, comment?: string) =>
    api.post(`/reviews/${courseId}`, { rating, comment }),
  getCourseReviews: (courseId: string, params?: ReviewQueryParams) =>
    api.get(`/reviews/course/${courseId}`, { params }),
  updateReview: (id: string, rating: number, comment?: string) =>
    api.put(`/reviews/${id}`, { rating, comment }),
  deleteReview: (id: string) => api.delete(`/reviews/${id}`),
  reportReview: (id: string, reason: string) => api.patch(`/reviews/${id}/report`, { reason }),
  markHelpful: (id: string) => api.patch(`/reviews/${id}/helpful`),
  getMyReviews: (params?: ReviewQueryParams) => api.get('/reviews/my-reviews', { params }),
}

// Admin API
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getUsers: (params?: UserQueryParams) => api.get('/admin/users', { params }),
  updateUserRole: (id: string, role: string) => api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  getCourses: (params?: CourseQueryParams) => api.get('/admin/courses', { params }),
  getReportedReviews: (params?: ReviewQueryParams) => api.get('/admin/reviews/reported', { params }),
  moderateReview: (id: string, action: 'approve' | 'reject') =>
    api.patch(`/admin/reviews/${id}/moderate`, { action }),
}

export default api