'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

interface EnrolledCourse {
  id: string
  enrolledAt: string
  progress: number
  course: {
    id: string
    title: string
    description: string
    thumbnail: string
    level: string
    category: string
    instructor: {
      name: string
    }
  }
}

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([])
  const [loadingCourses, setLoadingCourses] = useState(true)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    } else if (isAuthenticated && user) {
      fetchEnrolledCourses()
    }
  }, [isAuthenticated, loading, router, user])

  const fetchEnrolledCourses = async () => {
    try {
      setLoadingCourses(true)
      const token = localStorage.getItem('token')
      
      const response = await axios.get('http://localhost:4000/api/courses/my-courses', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.data.success) {
        setEnrolledCourses(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching enrolled courses:', error)
    } finally {
      setLoadingCourses(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center ring-4 ring-white/30">
              <span className="text-white font-bold text-2xl">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-1">
                Welcome back, {user.name}!
              </h1>
              <p className="text-blue-100 capitalize text-lg">
                {user.role === 'student' ? 'Student Dashboard' : `${user.role} Dashboard`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {enrolledCourses.length}
            </div>
            <div className="text-gray-600 font-medium">Courses Enrolled</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {enrolledCourses.length > 0 
                ? Math.round(enrolledCourses.reduce((acc, e) => acc + e.progress, 0) / enrolledCourses.length)
                : 0
              }%
            </div>
            <div className="text-gray-600 font-medium">Average Progress</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {enrolledCourses.filter(e => e.progress === 100).length}
            </div>
            <div className="text-gray-600 font-medium">Completed Courses</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {user.role === 'student' ? 'My Courses' : 'Course Management'}
            </h2>
            <button 
              onClick={() => router.push(user.role === 'student' ? '/courses' : '/instructor/courses/new')}
              data-qa="dashboard-browse-more-button"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              {user.role === 'student' ? '+ Browse More' : '+ Create Course'}
            </button>
          </div>
          <div className="p-6">
            {loadingCourses ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading courses...</p>
              </div>
            ) : enrolledCourses.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {user.role === 'student' ? 'No courses enrolled yet' : 'No courses created yet'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {user.role === 'student' 
                    ? 'Start your learning journey by enrolling in a course'
                    : 'Create your first course to start teaching'
                  }
                </p>
                <button 
                  onClick={() => router.push(user.role === 'student' ? '/courses' : '/instructor/courses/new')}
                  data-qa="dashboard-empty-state-browse-button"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {user.role === 'student' ? 'Browse Courses' : 'Create Course'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map((enrollment) => (
                  <div 
                    key={enrollment.id}
                    className="group bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    <div className="relative h-40 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600">
                      <div className="absolute inset-0 flex items-center justify-center text-white text-5xl opacity-50">
                        📚
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="bg-white text-gray-800 px-2 py-1 rounded-full text-xs font-semibold">
                          {enrollment.course.level}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {enrollment.course.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {enrollment.course.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>👨‍🏫 {enrollment.course.instructor.name}</span>
                        <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded">
                          {enrollment.course.category}
                        </span>
                      </div>

                      <div className="mb-2">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span className="font-semibold">{enrollment.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${enrollment.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <Link 
                        href={`/learn/${enrollment.course.id}`}
                        data-qa={`dashboard-continue-learning-${enrollment.course.id}`}
                        className="block w-full mt-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium text-center"
                      >
                        Continue Learning
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}