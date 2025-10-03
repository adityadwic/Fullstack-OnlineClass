export interface User {
  id: string
  name: string
  email: string
  role: 'student' | 'instructor' | 'admin'
  avatar?: string
  isVerified: boolean
  enrolledCourses: string[]
  createdCourses?: string[]
  createdAt: string
  updatedAt: string
}

export interface Course {
  _id: string
  title: string
  description: string
  category: string
  instructor: User | string
  thumbnail?: string
  price: number
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: number
  videos: Video[] | string[]
  quizzes: Quiz[] | string[]
  rating: number
  numReviews: number
  enrollmentCount: number
  isPublished: boolean
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export interface Video {
  _id: string
  title: string
  description?: string
  course: string | Course
  url: string
  cloudinaryId: string
  duration: number
  thumbnail?: string
  order: number
  isPreview: boolean
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export interface Quiz {
  _id: string
  title: string
  course: string | Course
  questions: QuizQuestion[]
  order: number
  passingScore: number
  timeLimit?: number
  isRequired: boolean
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer?: number
  explanation?: string
}

export interface Progress {
  _id: string
  user: string | User
  course: string | Course
  enrolledAt: string
  completedVideos: CompletedVideo[]
  quizResults: QuizResult[]
  percentage: number
  isCompleted: boolean
  completedAt?: string
  lastAccessedAt: string
  createdAt: string
  updatedAt: string
}

export interface CompletedVideo {
  video: string | Video
  completedAt: string
  watchTime: number
}

export interface QuizResult {
  quiz: string | Quiz
  score: number
  answers: QuizAnswer[]
  attempts: number
  completedAt: string
  passed: boolean
}

export interface QuizAnswer {
  questionIndex: number
  selectedAnswer: number
  isCorrect: boolean
  correctAnswer?: number
  explanation?: string
}

export interface Review {
  _id: string
  course: string | Course
  user: string | User
  rating: number
  comment?: string
  isApproved: boolean
  isReported: boolean
  reportReason?: 'spam' | 'inappropriate' | 'fake' | 'other'
  helpfulCount: number
  createdAt: string
  updatedAt: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  count: number
  total: number
  totalPages: number
  currentPage: number
  data: T[]
}

// Form Data Types
export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  role?: 'student' | 'instructor'
}

export interface CourseFormData {
  title: string
  description: string
  category: string
  level?: 'Beginner' | 'Intermediate' | 'Advanced'
  price?: number
  thumbnail?: string
}

export interface VideoFormData {
  title: string
  description?: string
  order?: number
  isPreview?: boolean
}

export interface QuizFormData {
  title: string
  questions: QuizQuestion[]
  passingScore?: number
  timeLimit?: number
  isRequired?: boolean
  order?: number
}

export interface ProfileUpdateData {
  name?: string
  email?: string
  avatar?: string
}

export interface PasswordChangeData {
  currentPassword: string
  newPassword: string
}

// Query Parameters
export interface CourseQueryParams {
  category?: string
  level?: string
  search?: string
  page?: number
  limit?: number
  sort?: string
}

export interface UserQueryParams {
  search?: string
  role?: string
  page?: number
  limit?: number
  sort?: string
}

export interface ReviewQueryParams {
  page?: number
  limit?: number
  sort?: string
}

export interface EnrollmentQueryParams {
  status?: 'completed' | 'in-progress' | 'not-started'
  page?: number
  limit?: number
}

// Dashboard Stats
export interface DashboardStats {
  users: {
    total: number
    students: number
    instructors: number
    newThisMonth: number
  }
  courses: {
    total: number
    published: number
    draft: number
    newThisMonth: number
  }
  enrollments: {
    total: number
    completed: number
    completionRate: number
    newThisMonth: number
  }
  reviews: {
    total: number
    reported: number
  }
  recentActivity: {
    users: User[]
    courses: Course[]
  }
}

export interface CourseStats {
  totalEnrollments: number
  completedStudents: number
  averageProgress: number
  activeStudents: number
  progressDistribution: Array<{
    _id: number
    count: number
  }>
  completionRate: number
}