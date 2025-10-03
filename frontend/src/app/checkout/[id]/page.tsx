'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import axios from 'axios'
import Image from 'next/image'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface Course {
  id: string
  title: string
  description: string
  thumbnail: string
  price: number
  level: string
  category: string
  instructor: {
    id: string
    name: string
    email: string
  }
  videos: Array<{
    id: string
    title: string
    duration: number
  }>
}

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer')
  const [agreed, setAgreed] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/checkout/${params.id}`)
      return
    }
    
    fetchCourse()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, params.id])

  const fetchCourse = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/courses/${params.id}`)
      
      if (response.data.success) {
        setCourse(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching course:', error)
      alert('Failed to load course details')
      router.push('/courses')
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    if (!agreed) {
      alert('Please agree to the terms and conditions')
      return
    }

    try {
      setProcessing(true)
      const token = localStorage.getItem('token')
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Enroll in course after "payment"
      const response = await axios.post(
        `${API_BASE_URL}/courses/${params.id}/enroll`,
        {
          paymentMethod,
          amount: course?.price
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.data.success) {
        // Show success message
        alert(`🎉 Payment Successful!\n\nYou are now enrolled in "${course?.title}".\n\nRedirecting to your courses...`)
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Payment error:', error)
      const err = error as { response?: { data?: { message?: string } } }
      
      if (err.response?.data?.message?.includes('Already enrolled')) {
        alert('ℹ️ You are already enrolled in this course!\n\nRedirecting to your dashboard...')
        router.push('/dashboard')
      } else {
        alert('❌ Payment failed. Please try again.')
      }
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading checkout...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return null
  }

  const totalVideoDuration = course.videos.reduce((acc, video) => acc + video.duration, 0)
  const hours = Math.floor(totalVideoDuration / 3600)
  const minutes = Math.floor((totalVideoDuration % 3600) / 60)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              data-qa="checkout-back-button"
              className="mr-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-3xl font-bold">Checkout</h1>
              <p className="text-blue-100 mt-1">Complete your purchase</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Student Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Student Information</h2>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {user?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
              
              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="bank_transfer"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <div className="ml-4 flex-1">
                    <p className="font-semibold text-gray-900">Bank Transfer</p>
                    <p className="text-sm text-gray-600">Transfer to our bank account</p>
                  </div>
                  <span className="text-2xl">🏦</span>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="credit_card"
                    data-qa="checkout-payment-credit-card"
                    checked={paymentMethod === 'credit_card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <div className="ml-4 flex-1">
                    <p className="font-semibold text-gray-900">Credit Card</p>
                    <p className="text-sm text-gray-600">Pay with credit/debit card</p>
                  </div>
                  <span className="text-2xl">💳</span>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="e_wallet"
                    data-qa="checkout-payment-ewallet"
                    checked={paymentMethod === 'e_wallet'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <div className="ml-4 flex-1">
                    <p className="font-semibold text-gray-900">E-Wallet</p>
                    <p className="text-sm text-gray-600">GoPay, OVO, Dana, etc.</p>
                  </div>
                  <span className="text-2xl">📱</span>
                </label>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This is a demo payment. Click &quot;Complete Payment&quot; to simulate successful payment and enroll in the course.
                </p>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  data-qa="checkout-terms-checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-5 h-5 text-blue-600 mt-1"
                />
                <span className="ml-3 text-sm text-gray-700">
                  I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and{' '}
                  <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>. 
                  I understand that I will get immediate access to the course after payment.
                </span>
              </label>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              {/* Course Card */}
              <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                <div className="relative h-40 bg-gradient-to-br from-blue-500 to-purple-600">
                  {course.thumbnail ? (
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-5xl">
                      📚
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>👨‍🏫 {course.instructor.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>📹 {course.videos.length} videos</span>
                    <span>⏱️ {hours}h {minutes}m</span>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Course Price</span>
                  <span className="font-semibold">${course.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Discount</span>
                  <span className="font-semibold text-green-600">$0.00</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-blue-600">${course.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                data-qa="checkout-complete-payment-button"
                disabled={processing || !agreed}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>🔒</span>
                    <span>Complete Payment</span>
                  </>
                )}
              </button>

              <p className="text-xs text-center text-gray-500 mt-4">
                🔐 Secure checkout powered by LearnHub
              </p>

              {/* What You'll Get */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">What you&apos;ll get:</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-2">✅</span>
                    <span>Lifetime access to course</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✅</span>
                    <span>{course.videos.length} video lessons</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✅</span>
                    <span>Certificate of completion</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✅</span>
                    <span>Access on mobile and desktop</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✅</span>
                    <span>30-day money-back guarantee</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
