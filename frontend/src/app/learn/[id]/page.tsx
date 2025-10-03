'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface Video {
  id: string
  title: string
  description: string
  videoUrl: string
  duration: number
  order: number
  isCompleted?: boolean
}

interface Course {
  id: string
  title: string
  description: string
  instructor: {
    id: string
    name: string
  }
  videos: Video[]
  totalVideos: number
  completedVideos: number
  progress: number
}

export default function CoursePlayerPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  
  const [course, setCourse] = useState<Course | null>(null)
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)
  const [markingComplete, setMarkingComplete] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/learn/${params.id}`)
      return
    }
    
    fetchCourseData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, params.id])

  const fetchCourseData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      // Fetch course with progress
      const courseResponse = await axios.get(
        `${API_BASE_URL}/courses/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (courseResponse.data.success) {
        const courseData = courseResponse.data.data
        
        // Fetch user progress
        try {
          const progressResponse = await axios.get(
            `${API_BASE_URL}/progress/${params.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )

          if (progressResponse.data.success) {
            const progressData = progressResponse.data.data
            
            // Mark completed videos
            const videosWithProgress = courseData.videos.map((video: Video) => ({
              ...video,
              isCompleted: progressData.completedVideos?.includes(video.id) || false
            }))

            setCourse({
              ...courseData,
              videos: videosWithProgress,
              totalVideos: videosWithProgress.length,
              completedVideos: progressData.completedVideos?.length || 0,
              progress: progressData.progress || 0
            })

            // Set first video or first incomplete video
            const firstIncomplete = videosWithProgress.find((v: Video) => !v.isCompleted)
            setCurrentVideo(firstIncomplete || videosWithProgress[0])
          }
        } catch {
          // No progress yet, use default
          setCourse({
            ...courseData,
            videos: courseData.videos.map((v: Video) => ({ ...v, isCompleted: false })),
            totalVideos: courseData.videos.length,
            completedVideos: 0,
            progress: 0
          })
          setCurrentVideo(courseData.videos[0])
        }
      }
    } catch (error) {
      console.error('Error fetching course:', error)
      alert('Failed to load course. Please try again.')
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkComplete = async () => {
    if (!currentVideo || markingComplete) return

    try {
      setMarkingComplete(true)
      const token = localStorage.getItem('token')

      const response = await axios.post(
        `${API_BASE_URL}/progress/${params.id}/video/${currentVideo.id}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.data.success) {
        // Update local state
        if (course) {
          const updatedVideos = course.videos.map(v =>
            v.id === currentVideo.id ? { ...v, isCompleted: true } : v
          )
          
          const completedCount = updatedVideos.filter(v => v.isCompleted).length
          const newProgress = Math.round((completedCount / course.totalVideos) * 100)

          setCourse({
            ...course,
            videos: updatedVideos,
            completedVideos: completedCount,
            progress: newProgress
          })

          setCurrentVideo({ ...currentVideo, isCompleted: true })

          // Show celebration if completed
          if (completedCount === course.totalVideos) {
            alert('🎉 Congratulations! You have completed this course!\n\nYour certificate is being generated...')
          } else {
            // Move to next video
            const currentIndex = updatedVideos.findIndex(v => v.id === currentVideo.id)
            if (currentIndex < updatedVideos.length - 1) {
              setCurrentVideo(updatedVideos[currentIndex + 1])
            }
          }
        }
      }
    } catch (error) {
      console.error('Error marking complete:', error)
      alert('Failed to mark as complete. Please try again.')
    } finally {
      setMarkingComplete(false)
    }
  }

  const handleVideoSelect = (video: Video) => {
    setCurrentVideo(video)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-white font-medium">Loading course...</p>
        </div>
      </div>
    )
  }

  if (!course || !currentVideo) {
    return null
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Top Bar */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/dashboard')}
            data-qa="learn-back-to-dashboard-button"
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Dashboard
          </button>
          <div className="border-l border-gray-700 pl-4">
            <h1 className="text-white font-semibold text-lg">{course.title}</h1>
            <p className="text-sm text-gray-400">by {course.instructor.name}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-400">
            {course.completedVideos} / {course.totalVideos} completed
          </div>
          <div className="w-32 bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
          <span className="text-white font-semibold">{course.progress}%</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Player */}
        <div className={`flex-1 flex flex-col ${sidebarOpen ? '' : 'w-full'}`}>
          {/* Video */}
          <div className="flex-1 bg-black flex items-center justify-center">
            {currentVideo.videoUrl ? (
              <video
                key={currentVideo.id}
                controls
                data-qa="learn-video-player"
                className="w-full h-full"
                src={currentVideo.videoUrl}
                onEnded={() => {
                  if (!currentVideo.isCompleted) {
                    handleMarkComplete()
                  }
                }}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="text-center">
                <div className="text-8xl mb-4">🎬</div>
                <p className="text-white text-xl mb-2">{currentVideo.title}</p>
                <p className="text-gray-400">Video will be available soon</p>
              </div>
            )}
          </div>

          {/* Video Info & Actions */}
          <div className="bg-gray-800 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-bold text-white">{currentVideo.title}</h2>
                  {currentVideo.isCompleted && (
                    <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full flex items-center">
                      ✓ Completed
                    </span>
                  )}
                </div>
                <p className="text-gray-400 mb-4">{currentVideo.description || 'No description available.'}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>⏱️ {formatDuration(currentVideo.duration)}</span>
                  <span>•</span>
                  <span>Lesson {currentVideo.order} of {course.totalVideos}</span>
                </div>
              </div>

              {!currentVideo.isCompleted && (
                <button
                  onClick={handleMarkComplete}
                  data-qa="learn-mark-complete-button"
                  disabled={markingComplete}
                  className="ml-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {markingComplete ? 'Saving...' : 'Mark as Complete'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Course Content */}
        {sidebarOpen && (
          <div className="w-96 bg-gray-800 border-l border-gray-700 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-white font-semibold">Course Content</h3>
              <button
                onClick={() => setSidebarOpen(false)}
                data-qa="learn-close-sidebar-button"
                className="text-gray-400 hover:text-white"
              >
                →
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {course.videos.map((video, index) => (
                <button
                  key={video.id}
                  onClick={() => handleVideoSelect(video)}
                  data-qa={`learn-video-item-${video.id}`}
                  className={`w-full p-4 text-left border-b border-gray-700 hover:bg-gray-700 transition-colors ${
                    currentVideo.id === video.id ? 'bg-gray-700' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      video.isCompleted
                        ? 'bg-green-600 text-white'
                        : currentVideo.id === video.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-600 text-gray-300'
                    }`}>
                      {video.isCompleted ? '✓' : index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium ${
                        currentVideo.id === video.id ? 'text-blue-400' : 'text-white'
                      }`}>
                        {video.title}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        {formatDuration(video.duration)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sidebar Toggle (when closed) */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            data-qa="learn-open-sidebar-button"
            className="absolute right-4 top-24 bg-gray-800 text-white p-3 rounded-lg shadow-lg hover:bg-gray-700 transition-colors"
          >
            ← Course Content
          </button>
        )}
      </div>
    </div>
  )
}
