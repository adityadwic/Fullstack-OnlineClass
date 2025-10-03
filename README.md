# 🎓 Online Learning Platform

> **Platform pembelajaran online modern dengan fitur lengkap untuk student, instructor, dan admin**

Platform ini dibangun dengan Next.js 15, Node.js/Express, dan PostgreSQL (Supabase) dengan fokus pada user experience yang smooth dan performa yang optimal.

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)]()
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)]()

---

## ✨ Fitur Utama

### 🔐 **Authentication & Authorization**
- ✅ Complete user authentication (Register, Login, Logout)
- ✅ JWT-based token authentication
- ✅ Role-based access control (Student, Instructor, Admin)
- ✅ Secure password hashing with bcryptjs
- ✅ Protected routes and middleware

### 📚 **Course Management**
- ✅ **Browse courses** - Explore all available courses
- ✅ **Search & filter** - Find courses by keyword, category, and level
- ✅ **Course details** - View full course information with videos and reviews
- ✅ **One-click enrollment** - Enroll in courses instantly
- ✅ **Progress tracking** - Track your learning progress
- ✅ **Course creation** - Instructors can create and manage courses
- ✅ **Video management** - Add and organize course videos
- ✅ **Student reviews** - Rate and review courses

### 📊 **Dashboard Features**
- ✅ **Personalized dashboard** - Different views for each role
- ✅ **Enrollment statistics** - Track courses enrolled, progress, and completions
- ✅ **My courses** - Quick access to enrolled courses
- ✅ **Progress visualization** - Progress bars for each course
- ✅ **Quick actions** - Browse more courses or continue learning

### 🎨 **User Experience**
- ✅ **Modern UI** - Beautiful gradient designs and animations
- ✅ **Responsive design** - Works perfectly on all devices
- ✅ **Fast navigation** - Smooth transitions between pages
- ✅ **Real-time updates** - Instant feedback on all actions
- ✅ **User-friendly notifications** - Clear success/error messages

---

## 🎯 What Works Now

### ✅ **Fully Functional Features:**

| Feature | Status | Description |
|---------|--------|-------------|
| User Registration | ✅ | Create new accounts with email validation |
| User Login | ✅ | Secure authentication with JWT tokens |
| Browse Courses | ✅ | View all available courses with details |
| Search & Filter | ✅ | Find courses by category, level, and keywords |
| Course Details | ✅ | View full course information, videos, and reviews |
| Enrollment | ✅ | One-click course enrollment for students |
| Dashboard | ✅ | Personalized dashboard with statistics |
| My Courses | ✅ | View all enrolled courses with progress |
| Progress Tracking | ✅ | Track learning progress for each course |
| API Integration | ✅ | Complete REST API with all endpoints |
| Database | ✅ | PostgreSQL with Prisma ORM on Supabase |
| CORS | ✅ | Properly configured for frontend-backend communication |

### 🚧 **Planned Features (Future):**

- ⏳ Video player with controls
- ⏳ Mark lessons as complete
- ⏳ Quiz system with grading
- ⏳ Certificate generation
- ⏳ Payment integration (Stripe/PayPal)
- ⏳ Instructor course management UI
- ⏳ Admin panel
- ⏳ Real-time notifications
- ⏳ Course recommendations
- ⏳ Discussion forum

## 🛠 Tech Stack

### Backend
- **Framework**: Node.js + Express.js
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Authentication**: JWT + bcryptjs
- **Validation**: express-validator
- **CORS**: cors middleware

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **HTTP Client**: Axios
- **State Management**: React Query
- **UI Components**: Custom components with animations

## 📁 Struktur Project

```
academic-class/
├── backend/                 # Node.js API Server
│   ├── controllers/        # Route controllers
│   ├── models/            # Prisma models
│   ├── routes/            # Express routes
│   ├── middleware/        # Custom middleware
│   ├── prisma/           # Database schema & migrations
│   ├── utils/            # Utility functions
│   ├── config/           # Configuration files
│   ├── seed.js           # Database seeder
│   └── server.js         # Main server file
│
├── frontend/               # Next.js Frontend
│   ├── src/
│   │   ├── app/          # App Router pages
│   │   ├── components/   # Reusable components
│   │   ├── lib/         # Utilities & configurations
│   │   └── types/       # TypeScript types
│   ├── public/          # Static assets
│   └── tailwind.config.js
│
└── prd.MD                 # Product Requirements Document
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm atau yarn
- PostgreSQL database (menggunakan Supabase)

### 1. Clone Repository
```bash
git clone <repository-url>
cd academic-class
```

### 2. Setup Backend
```bash
cd backend
npm install

# Setup environment variables
cp .env.example .env
# Edit .env dengan database URL Supabase Anda

# Generate Prisma client
npx prisma generate

# Push schema ke database
npx prisma db push

# Seed database dengan data dummy
node seed.js

# Start backend server
npm start
```

Backend akan berjalan di: `http://localhost:4000`

### 3. Setup Frontend
```bash
cd frontend
npm install

# Start development server
npm run dev
```

Frontend akan berjalan di: `http://localhost:4001`

## 🗄 Database Schema

### User Models
- **User**: Menyimpan data pengguna (student, instructor, admin)
- **Course**: Informasi course dengan instructor
- **Video**: Video pembelajaran dalam course
- **Quiz**: Quiz dan pertanyaan
- **Enrollment**: Pendaftaran student ke course
- **Progress**: Progress belajar student
- **Review**: Review dan rating course

### Relationships
- User → Course (one-to-many, instructor)
- User → Enrollment (many-to-many via courses)
- Course → Video (one-to-many)
- Course → Quiz (one-to-many)
- User → Progress (many-to-many via videos)

## 👥 Test Accounts

Setelah menjalankan seeder, Anda dapat login dengan akun berikut:

### Student Account
- **Email**: student@example.com
- **Password**: password123
- **Role**: Student
- **Access**: Enroll course, watch videos, take quiz

### Instructor Account
- **Email**: instructor@example.com  
- **Password**: password123
- **Role**: Instructor
- **Access**: Create/manage courses, view analytics

### Admin Account
- **Email**: admin@example.com
- **Password**: password123
- **Role**: Admin
- **Access**: Full system access, user management

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get user profile

### Courses
- `GET /api/courses` - Get semua courses
- `POST /api/courses` - Create course baru (instructor only)
- `GET /api/courses/:id` - Get detail course
- `PUT /api/courses/:id` - Update course (instructor only)
- `DELETE /api/courses/:id` - Delete course (instructor only)

### Videos
- `GET /api/courses/:id/videos` - Get course videos
- `POST /api/courses/:id/videos` - Add video to course
- `PUT /api/videos/:id` - Update video
- `DELETE /api/videos/:id` - Delete video

### Enrollments
- `POST /api/enrollments` - Enroll ke course
- `GET /api/enrollments/my-courses` - Get enrolled courses
- `DELETE /api/enrollments/:id` - Unenroll dari course

## 🎨 UI/UX Features

### Homepage
- Hero section dengan animasi gradient
- Featured courses grid
- Statistics showcase
- Responsive design

### Authentication
- Modern login/register forms
- Form validation
- Loading states
- Error handling

### Dashboard
- Role-based dashboard views
- Course management (instructor)
- Enrolled courses (student)
- Progress tracking

### Course Pages
- Course detail dengan preview
- Video player integration
- Quiz system
- Review dan rating

## 🔧 Configuration

### Environment Variables (Backend)
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
PORT=4000
```

### Environment Variables (Frontend)
```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

## 📱 Responsive Design

Aplikasi fully responsive dengan breakpoints:
- Mobile: 320px - 768px
- Tablet: 768px - 1024px  
- Desktop: 1024px+

## 🔐 Security Features

- JWT-based authentication
- Password hashing dengan bcrypt
- Role-based access control
- Input validation
- CORS protection
- SQL injection protection (Prisma)

## 🚀 Deployment

### Backend Deployment
1. Setup PostgreSQL database (production)
2. Set environment variables
3. Run `npx prisma db push`
4. Run `node seed.js` (optional)
5. Deploy ke platform pilihan (Vercel, Railway, etc.)

### Frontend Deployment
1. Set `NEXT_PUBLIC_API_URL` ke production backend
2. Run `npm run build`
3. Deploy ke Vercel atau platform lain

## 📝 Development Notes

### Database Migration
```bash
# Generate migration
npx prisma migrate dev --name migration-name

# Reset database
npx prisma migrate reset

# View database
npx prisma studio
```

### Code Structure
- Menggunakan TypeScript untuk type safety
- Modular component architecture
- Custom hooks untuk logic reuse
- Consistent error handling
- Clean code principles

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push ke branch
5. Create Pull Request

## 📄 License

MIT License - lihat file LICENSE untuk detail.

## 🐛 Bug Reports

Jika menemukan bug, silakan buat issue di GitHub repository dengan detail:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (jika ada)
- Environment info

## 💡 Feature Requests

Untuk request fitur baru, buat issue dengan label "enhancement" dan jelaskan:
- Use case
- Proposed solution
- Alternative solutions
- Additional context

---

## 📚 Additional Documentation

Untuk informasi lebih detail, lihat dokumentasi berikut:

- **[📂 PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Struktur lengkap project dan penjelasan setiap folder/file
- **[🚀 HOW_TO_RUN.md](./HOW_TO_RUN.md)** - Panduan lengkap setup dan menjalankan aplikasi
- **[🌐 NGROK_HOSTING_GUIDE.md](./NGROK_HOSTING_GUIDE.md)** - 🆕 Cara hosting dengan Ngrok untuk akses internet
- **[🧪 TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Guide untuk testing semua fitur
- **[🔌 TEST_API.md](./TEST_API.md)** - Dokumentasi testing API endpoints
- **[🤖 DATA_QA_ATTRIBUTES.md](./DATA_QA_ATTRIBUTES.md)** - Referensi atribut untuk QA automation
- **[📋 prd.MD](./prd.MD)** - Product Requirements Document

---

## 🌐 Quick Ngrok Setup

Untuk expose aplikasi ke internet (bisa diakses dari mana saja):

```bash
# 1. Install ngrok
brew install ngrok/ngrok/ngrok

# 2. Setup authtoken (get from ngrok.com)
ngrok config add-authtoken YOUR_TOKEN

# 3. Use helper script
./start-ngrok.sh

# Or manual:
ngrok http 4000  # Expose backend
ngrok http 4001  # Expose frontend
```

**📖 Lihat [NGROK_HOSTING_GUIDE.md](./NGROK_HOSTING_GUIDE.md) untuk panduan lengkap!**

---

**Dikembangkan dengan ❤️ menggunakan modern web technologies**