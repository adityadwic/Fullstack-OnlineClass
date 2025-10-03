'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  level: string;
  category: string;
  price: number;
  rating: number;
  totalStudents: number;
  totalDuration: number;
  isPublished: boolean;
  instructor: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  videos: Array<{
    id: string;
    title: string;
    description: string;
    duration: number;
    order: number;
  }>;
  reviews: Array<{
    id: string;
    rating: number;
    comment: string;
    user: {
      id: string;
      name: string;
      avatar?: string;
    };
  }>;
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchCourse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:4000/api/courses/${params.id}`);
      
      if (response.data.success) {
        setCourse(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching course:', err);
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      // Show message and redirect to login
      const confirmed = confirm('You need to login first to purchase this course. Redirect to login page?');
      if (confirmed) {
        router.push(`/login?redirect=/courses/${params.id}`);
      }
      return;
    }

    // Check if already enrolled
    try {
      setEnrolling(true);
      const response = await axios.get(
        `http://localhost:4000/api/courses/my-courses`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        const enrolledCourses = response.data.data;
        const isEnrolled = enrolledCourses.some((e: { course: { id: string } }) => e.course.id === params.id);
        
        if (isEnrolled) {
          alert('ℹ️ You are already enrolled in this course!\n\nRedirecting to your dashboard...');
          router.push('/dashboard');
          return;
        }
      }
    } catch (err) {
      console.error('Error checking enrollment:', err);
    } finally {
      setEnrolling(false);
    }

    // Redirect to checkout page
    router.push(`/checkout/${params.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The course you are looking for does not exist.'}</p>
          <Link
            href="/courses"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const totalVideoDuration = course.videos.reduce((acc, video) => acc + video.duration, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/courses"
            data-qa="course-detail-back-link"
            className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
          >
            ← Back to Courses
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold">
                  {course.category}
                </span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold">
                  {course.level}
                </span>
              </div>

              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-white/90 mb-6">{course.description}</p>

              <div className="flex items-center gap-6">
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-2">⭐</span>
                  <span className="font-semibold">{course.rating.toFixed(1)}</span>
                  <span className="ml-2 text-white/80">({course.reviews.length} reviews)</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">👥</span>
                  <span>{course.totalStudents} students</span>
                </div>
              </div>

              <div className="mt-6 flex items-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl mr-3">
                  👨‍🏫
                </div>
                <div>
                  <p className="text-sm text-white/80">Instructor</p>
                  <p className="font-semibold">{course.instructor.name}</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-2xl p-6 sticky top-6">
                <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-4 overflow-hidden">
                  {course.thumbnail ? (
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      width={400}
                      height={225}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-6xl">
                      📚
                    </div>
                  )}
                </div>

                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    ${course.price.toFixed(2)}
                  </div>
                  <p className="text-gray-600">One-time payment</p>
                </div>

                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  data-qa="course-detail-buy-button"
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {enrolling ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Checking...</span>
                    </>
                  ) : (
                    <>
                      <span>🛒</span>
                      <span>Buy Course - ${course.price.toFixed(2)}</span>
                    </>
                  )}
                </button>

                <div className="mt-6 space-y-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="mr-3">⏱️</span>
                    <span>{Math.floor(totalVideoDuration / 3600)}h {Math.floor((totalVideoDuration % 3600) / 60)}m total duration</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-3">🎥</span>
                    <span>{course.videos.length} video lessons</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-3">📱</span>
                    <span>Access on mobile and desktop</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-3">🏆</span>
                    <span>Certificate of completion</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Course Content */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Content</h2>
              <div className="space-y-2">
                {course.videos.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No videos available yet</p>
                ) : (
                  course.videos.map((video, index) => (
                    <div
                      key={video.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold mr-4">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{video.title}</h3>
                          {video.description && (
                            <p className="text-sm text-gray-600">{video.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Reviews</h2>
              {course.reviews.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No reviews yet</p>
              ) : (
                <div className="space-y-6">
                  {course.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                      <div className="flex items-start mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                          {review.user.name[0].toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{review.user.name}</h4>
                            <div className="flex items-center">
                              <span className="text-yellow-500 mr-1">⭐</span>
                              <span className="font-semibold">{review.rating}</span>
                            </div>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            {/* Instructor Info */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">About the Instructor</h3>
              <div className="text-center mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-3">
                  👨‍🏫
                </div>
                <h4 className="font-semibold text-gray-900">{course.instructor.name}</h4>
                <p className="text-sm text-gray-600">{course.instructor.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
