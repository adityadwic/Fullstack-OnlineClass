const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...')

    // Clear existing data
    await prisma.enrollment.deleteMany()
    await prisma.progress.deleteMany()
    await prisma.review.deleteMany()
    await prisma.quizAttempt.deleteMany()
    await prisma.quizQuestion.deleteMany()
    await prisma.quiz.deleteMany()
    await prisma.video.deleteMany()
    await prisma.course.deleteMany()
    await prisma.user.deleteMany()
    console.log('🗑️  Cleared existing data')

    // Create dummy users
    const hashedPassword = await bcrypt.hash('password123', 12)
    
    await prisma.user.createMany({
      data: [
        {
          name: 'John Student',
          email: 'student@example.com',
          password: hashedPassword,
          role: 'STUDENT',
          isVerified: true
        },
        {
          name: 'Sarah Instructor',
          email: 'instructor@example.com',
          password: hashedPassword,
          role: 'INSTRUCTOR',
          isVerified: true
        },
        {
          name: 'Mike Admin',
          email: 'admin@example.com',
          password: hashedPassword,
          role: 'ADMIN',
          isVerified: true
        },
        {
          name: 'Jane Smith',
          email: 'jane@example.com',
          password: hashedPassword,
          role: 'STUDENT',
          isVerified: true
        },
        {
          name: 'Dr. Robert Wilson',
          email: 'robert@example.com',
          password: hashedPassword,
          role: 'INSTRUCTOR',
          isVerified: true
        },
        {
          name: 'Alice Johnson',
          email: 'alice@example.com',
          password: hashedPassword,
          role: 'STUDENT',
          isVerified: true
        }
      ]
    })
    console.log('👥 Created dummy users')

    // Get created users
    const instructor1 = await prisma.user.findUnique({ where: { email: 'instructor@example.com' } })
    const instructor2 = await prisma.user.findUnique({ where: { email: 'robert@example.com' } })
    const student1 = await prisma.user.findUnique({ where: { email: 'student@example.com' } })

    // Create dummy courses
    const courses = await Promise.all([
      prisma.course.create({
        data: {
          title: 'Complete JavaScript Course',
          description: 'Learn JavaScript from basics to advanced concepts with hands-on projects.',
          thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800',
          level: 'BEGINNER',
          category: 'Programming',
          price: 99.99,
          rating: 4.8,
          totalStudents: 1250,
          totalDuration: 480,
          isPublished: true,
          instructorId: instructor1.id
        }
      }),
      prisma.course.create({
        data: {
          title: 'React Development Bootcamp',
          description: 'Master React.js and build modern web applications with hooks, context, and more.',
          thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
          level: 'INTERMEDIATE',
          category: 'Programming',
          price: 149.99,
          rating: 4.9,
          totalStudents: 890,
          totalDuration: 360,
          isPublished: true,
          instructorId: instructor1.id
        }
      }),
      prisma.course.create({
        data: {
          title: 'Node.js Backend Development',
          description: 'Build scalable backend applications with Node.js, Express, and MongoDB.',
          thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800',
          level: 'INTERMEDIATE',
          category: 'Programming',
          price: 129.99,
          rating: 4.7,
          totalStudents: 672,
          totalDuration: 420,
          isPublished: true,
          instructorId: instructor2.id
        }
      }),
      prisma.course.create({
        data: {
          title: 'Digital Marketing Fundamentals',
          description: 'Learn the essentials of digital marketing including SEO, social media, and analytics.',
          thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
          level: 'BEGINNER',
          category: 'Marketing',
          price: 79.99,
          rating: 4.6,
          totalStudents: 1100,
          totalDuration: 300,
          isPublished: true,
          instructorId: instructor2.id
        }
      }),
      prisma.course.create({
        data: {
          title: 'UI/UX Design Principles',
          description: 'Master the fundamentals of user interface and user experience design.',
          thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800',
          level: 'BEGINNER',
          category: 'Design',
          price: 89.99,
          rating: 4.5,
          totalStudents: 543,
          totalDuration: 240,
          isPublished: true,
          instructorId: instructor1.id
        }
      }),
      prisma.course.create({
        data: {
          title: 'Python Data Science',
          description: 'Learn Python for data analysis, visualization, and machine learning.',
          thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800',
          level: 'ADVANCED',
          category: 'Data Science',
          price: 199.99,
          rating: 4.9,
          totalStudents: 789,
          totalDuration: 600,
          isPublished: true,
          instructorId: instructor2.id
        }
      })
    ])
    console.log('📚 Created dummy courses')

    // Create videos for the first course
    await prisma.video.createMany({
      data: [
        {
          title: "Introduction and Setup",
          description: "Course introduction and development environment setup",
          duration: 900,
          url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
          order: 1,
          courseId: courses[0].id,
          isPublished: true
        },
        {
          title: "Core Concepts",
          description: "Understanding the fundamental concepts and principles",
          duration: 1800,
          url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
          order: 2,
          courseId: courses[0].id,
          isPublished: true
        },
        {
          title: "Practical Examples",
          description: "Hands-on examples and real-world applications",
          duration: 2400,
          url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4",
          order: 3,
          courseId: courses[0].id,
          isPublished: true
        },
        {
          title: "Advanced Techniques",
          description: "Advanced concepts and best practices",
          duration: 2100,
          url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
          order: 4,
          courseId: courses[0].id,
          isPublished: true
        }
      ]
    })

    // Create videos for second course
    await prisma.video.createMany({
      data: [
        {
          title: "React Fundamentals",
          description: "Introduction to React components and JSX",
          duration: 1200,
          url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
          order: 1,
          courseId: courses[1].id,
          isPublished: true
        },
        {
          title: "State and Props",
          description: "Managing component state and passing props",
          duration: 1500,
          url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
          order: 2,
          courseId: courses[1].id,
          isPublished: true
        },
        {
          title: "React Hooks",
          description: "Understanding and using React hooks",
          duration: 1800,
          url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4",
          order: 3,
          courseId: courses[1].id,
          isPublished: true
        }
      ]
    })
    console.log('🎥 Created dummy videos')

    // Create quizzes
    const quiz1 = await prisma.quiz.create({
      data: {
        title: "JavaScript Basics Quiz",
        description: "Test your understanding of JavaScript fundamentals",
        courseId: courses[0].id,
        isPublished: true
      }
    })

    const quiz2 = await prisma.quiz.create({
      data: {
        title: "React Components Quiz",
        description: "Test your knowledge of React components",
        courseId: courses[1].id,
        isPublished: true
      }
    })

    // Create quiz questions
    await prisma.quizQuestion.createMany({
      data: [
        {
          question: "What is JavaScript?",
          options: ["A programming language", "A markup language", "A database", "An operating system"],
          correctAnswers: ["A programming language"],
          points: 10,
          order: 1,
          quizId: quiz1.id
        },
        {
          question: "Which of the following is a JavaScript data type?",
          options: ["String", "Integer", "Float", "Character"],
          correctAnswers: ["String"],
          points: 10,
          order: 2,
          quizId: quiz1.id
        },
        {
          question: "What is a React component?",
          options: ["A function", "A class", "Both function and class", "A variable"],
          correctAnswers: ["Both function and class"],
          points: 10,
          order: 1,
          quizId: quiz2.id
        }
      ]
    })
    console.log('❓ Created dummy quizzes')

    // Create enrollments
    await prisma.enrollment.createMany({
      data: [
        {
          userId: student1.id,
          courseId: courses[0].id
        },
        {
          userId: student1.id,
          courseId: courses[1].id
        }
      ]
    })
    console.log('📝 Created dummy enrollments')

    // Create reviews
    await prisma.review.createMany({
      data: [
        {
          rating: 5,
          comment: "Excellent course! Very comprehensive and easy to follow.",
          userId: student1.id,
          courseId: courses[0].id
        },
        {
          rating: 4,
          comment: "Great content, but could use more practical examples.",
          userId: student1.id,
          courseId: courses[1].id
        }
      ]
    })
    console.log('⭐ Created dummy reviews')

    console.log('✅ Database seeded successfully!')
    console.log('\n📊 Test Accounts Created:')
    console.log('Student: student@example.com | password123')
    console.log('Instructor: instructor@example.com | password123')
    console.log('Admin: admin@example.com | password123')
    console.log('\n📚 Created 6 courses with videos and quizzes')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run seeder
seedDatabase().catch((error) => {
  console.error('💥 Seeding failed:', error)
  process.exit(1)
})