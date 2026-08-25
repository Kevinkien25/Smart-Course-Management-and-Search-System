const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const Category = require('../models/Category');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const SearchHistory = require('../models/SearchHistory');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/course_management_db';
    await mongoose.connect(mongoUri);
    console.log('[Seed]: Connected to MongoDB');

    // Clear existing collections
    await User.deleteMany();
    await Category.deleteMany();
    await Course.deleteMany();
    await Enrollment.deleteMany();
    await SearchHistory.deleteMany();
    console.log('[Seed]: Cleared existing database records');

    // 1. Create Users (1 Admin + 9 Normal Users = 10 Users)
    const salt = await bcrypt.genSalt(10);
    const defaultPasswordHash = await bcrypt.hash('123456', salt);
    const adminPasswordHash = await bcrypt.hash('admin123', salt);

    const usersData = [
      { name: 'Admin Master', email: 'admin@system.com', password: adminPasswordHash, role: 'admin' },
      { name: 'Nguyen Van A', email: 'nguyenvana@gmail.com', password: defaultPasswordHash, role: 'user' },
      { name: 'Tran Thi B', email: 'tranthib@gmail.com', password: defaultPasswordHash, role: 'user' },
      { name: 'Le Van C', email: 'levanc@gmail.com', password: defaultPasswordHash, role: 'user' },
      { name: 'Pham Hoang D', email: 'phamhoangd@gmail.com', password: defaultPasswordHash, role: 'user' },
      { name: 'Hoang Minh E', email: 'hoangminhe@gmail.com', password: defaultPasswordHash, role: 'user' },
      { name: 'Doan Thi F', email: 'doanthif@gmail.com', password: defaultPasswordHash, role: 'user' },
      { name: 'Vu Quoc G', email: 'vuquocg@gmail.com', password: defaultPasswordHash, role: 'user' },
      { name: 'Bui Anh H', email: 'buianhh@gmail.com', password: defaultPasswordHash, role: 'user' },
      { name: 'Dang Thu I', email: 'dangthui@gmail.com', password: defaultPasswordHash, role: 'user' }
    ];

    const users = await User.insertMany(usersData);
    console.log(`[Seed]: Created ${users.length} Users`);

    // 2. Create Categories (8 Categories)
    const categoriesData = [
      { name: 'JavaScript', description: 'Nền tảng ngôn ngữ lập trình JavaScript từ cơ bản đến nâng cao' },
      { name: 'NodeJS', description: 'Xây dựng Server-side RESTful API hiệu năng cao với Node.js' },
      { name: 'ReactJS', description: 'Thư viện UI xây dựng Single Page Applications (SPA) hiện đại' },
      { name: 'ExpressJS', description: 'Web framework phổ biến nhất cho Node.js backend' },
      { name: 'MongoDB', description: 'Hệ quản trị cơ sở dữ liệu NoSQL linh hoạt, mở rộng cao' },
      { name: 'Fullstack', description: 'Lập trình web toàn diện tích hợp Frontend và Backend' },
      { name: 'Frontend', description: 'Thiết kế giao diện người dùng tương tác, đáp ứng (Responsive)' },
      { name: 'Backend', description: 'Kiến trúc hệ thống máy chủ, lưu trữ và xử lý logic nghiệp vụ' }
    ];

    const categories = await Category.insertMany(categoriesData);
    console.log(`[Seed]: Created ${categories.length} Categories`);

    // Helper function to find category ID by name
    const getCatId = (name) => categories.find(c => c.name.toLowerCase() === name.toLowerCase())?._id;

    // 3. Create Courses (20 Courses)
    const coursesData = [
      {
        title: 'NodeJS Backend từ cơ bản đến nâng cao',
        description: 'Khóa học hoàn chỉnh xây dựng hệ thống REST API với ExpressJS, Node.js, MongoDB và JWT Authentication chuyên nghiệp.',
        instructor: 'Nguyễn Văn Minh',
        category: getCatId('NodeJS'),
        level: 'Intermediate',
        price: 890000,
        rating: 4.8,
        students: 1250,
        thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&auto=format&fit=crop&q=60'
      },
      {
        title: 'Fullstack JavaScript MERN Stack Masterclass',
        description: 'Lập trình ứng dụng web Fullstack từ A-Z với MongoDB, ExpressJS, ReactJS và Node.js. Dự án thực tế lớn.',
        instructor: 'Trần Đức Lương',
        category: getCatId('Fullstack'),
        level: 'Advanced',
        price: 1200000,
        rating: 4.9,
        students: 2100,
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=60'
      },
      {
        title: 'ReactJS cơ bản và ứng dụng thực tế',
        description: 'Nắm vững React Hooks, State Management, Router DOM và làm chủ giao diện web SPA hiện đại.',
        instructor: 'Phạm Thành Nam',
        category: getCatId('ReactJS'),
        level: 'Beginner',
        price: 650000,
        rating: 4.7,
        students: 980,
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=60'
      },
      {
        title: 'Lập trình JavaScript ES6+ Nhập môn',
        description: 'Học lập trình JavaScript căn bản cho người mới bắt đầu. Bao gồm Arrow Functions, Promises, Async/Await.',
        instructor: 'Lê Hoàng Long',
        category: getCatId('JavaScript'),
        level: 'Beginner',
        price: 390000,
        rating: 4.6,
        students: 3100,
        thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&auto=format&fit=crop&q=60'
      },
      {
        title: 'ExpressJS Web Framework & Microservices Concept',
        description: 'Xây dựng Web API mạnh mẽ với Express.js, tối ưu Middleware, Routing và Security Headers.',
        instructor: 'Nguyễn Văn Minh',
        category: getCatId('ExpressJS'),
        level: 'Intermediate',
        price: 550000,
        rating: 4.5,
        students: 620,
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=60'
      },
      {
        title: 'MongoDB & Mongoose Data Modeling Chuyên Sâu',
        description: 'Thiết kế Cơ sở dữ liệu NoSQL cho ứng dụng thực tế. Tối ưu Query, Schema Indexes và Aggregation Pipeline.',
        instructor: 'Hoàng Hải Đăng',
        category: getCatId('MongoDB'),
        level: 'Intermediate',
        price: 720000,
        rating: 4.8,
        students: 840,
        thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=60'
      },
      {
        title: 'Frontend Web Development với HTML CSS JavaScript',
        description: 'Tự tay xây dựng trang web giao diện đẹp, responsive chuẩn Mobile-First bằng HTML5, CSS3 và Vanilla JS.',
        instructor: 'Đặng Thùy Trang',
        category: getCatId('Frontend'),
        level: 'Beginner',
        price: 490000,
        rating: 4.7,
        students: 1850,
        thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=60'
      },
      {
        title: 'Backend Node.js Systems Architecture',
        description: 'Kiến trúc máy chủ Backend quy mô lớn: REST Security, Rate Limiting, JWT Tokens, File Upload và Data Validation.',
        instructor: 'Trần Đức Lương',
        category: getCatId('Backend'),
        level: 'Advanced',
        price: 990000,
        rating: 4.9,
        students: 760,
        thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=60'
      },
      {
        title: 'ReactJS Nâng Cao: Redux Toolkit & Performance',
        description: 'Tối ưu hiệu năng ứng dụng React, quản lý state phức tạp với Redux Toolkit, Custom Hooks và Code Splitting.',
        instructor: 'Phạm Thành Nam',
        category: getCatId('ReactJS'),
        level: 'Advanced',
        price: 850000,
        rating: 4.8,
        students: 540,
        thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600&auto=format&fit=crop&q=60'
      },
      {
        title: 'JavaScript Bất Đồng Bộ (Asynchronous JS Master)',
        description: 'Hiểu sâu Event Loop, Call Stack, Callback Queue, Promises, Async/Await trong V8 Engine.',
        instructor: 'Lê Hoàng Long',
        category: getCatId('JavaScript'),
        level: 'Intermediate',
        price: 520000,
        rating: 4.7,
        students: 930,
        thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=60'
      },
      {
        title: 'NodeJS RESTful API Testing & Documentation',
        description: 'Hướng dẫn chuẩn hóa API documentation, viết Unit Test với Jest, Supertest cho Express server.',
        instructor: 'Nguyễn Văn Minh',
        category: getCatId('NodeJS'),
        level: 'Intermediate',
        price: 450000,
        rating: 4.4,
        students: 410,
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=60'
      },
      {
        title: 'Fullstack Web App với React & Node Authentication',
        description: 'Xây dựng hệ thống Đăng ký, Đăng nhập, Phân quyền Admin/User với JWT, Refresh Token & Axios Interceptor.',
        instructor: 'Trần Đức Lương',
        category: getCatId('Fullstack'),
        level: 'Intermediate',
        price: 790000,
        rating: 4.8,
        students: 1100,
        thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=60'
      },
      {
        title: 'ExpressJS & Security Best Practices',
        description: 'Bảo mật Node.js Express server: Phòng chống SQL Injection, NoSQL Injection, XSS, CSRF và Rate Limit.',
        instructor: 'Hoàng Hải Đăng',
        category: getCatId('ExpressJS'),
        level: 'Advanced',
        price: 680000,
        rating: 4.6,
        students: 390,
        thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=60'
      },
      {
        title: 'MongoDB Query Tuning & Aggregation Mastery',
        description: 'Làm chủ các toán tử $lookup, $match, $group trong MongoDB Aggregation framework.',
        instructor: 'Hoàng Hải Đăng',
        category: getCatId('MongoDB'),
        level: 'Advanced',
        price: 750000,
        rating: 4.7,
        students: 480,
        thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=60'
      },
      {
        title: 'Frontend UI Frameworks: Bootstrap & React-Bootstrap',
        description: 'Thiết kế giao diện trang web hiện đại nhanh chóng với lưới Responsive Flexbox và React-Bootstrap Components.',
        instructor: 'Đặng Thùy Trang',
        category: getCatId('Frontend'),
        level: 'Beginner',
        price: 350000,
        rating: 4.5,
        students: 820,
        thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=60'
      },
      {
        title: 'Backend API Design & Rule-Based Search Algorithms',
        description: 'Thiết kế API tìm kiếm thông minh không dùng Machine Learning. Xây dựng thuật toán xếp hạng điểm số (Search Ranking Algorithm) bằng JavaScript.',
        instructor: 'Nguyễn Văn Minh',
        category: getCatId('Backend'),
        level: 'Intermediate',
        price: 820000,
        rating: 4.9,
        students: 1420,
        thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=60'
      },
      {
        title: 'JavaScript Object-Oriented & Design Patterns',
        description: 'Lập trình hướng đối tượng trong JavaScript: Prototypes, Classes, Factory, Singleton, Observer pattern.',
        instructor: 'Lê Hoàng Long',
        category: getCatId('JavaScript'),
        level: 'Intermediate',
        price: 580000,
        rating: 4.6,
        students: 670,
        thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&auto=format&fit=crop&q=60'
      },
      {
        title: 'ReactJS Router DOM & Navigation Design',
        description: 'Xây dựng hệ thống điều hướng trang web (Routing) phức tạp với React Router v6, Dynamic Parameters và Nested Routes.',
        instructor: 'Phạm Thành Nam',
        category: getCatId('ReactJS'),
        level: 'Beginner',
        price: 420000,
        rating: 4.6,
        students: 710,
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=60'
      },
      {
        title: 'Lập Trình Web Backend Dành Cho Người Mới Bắt Đầu',
        description: 'Khám phá cách hoạt động của Internet, HTTP Protocol, Request/Response cycle và khởi tạo ứng dụng Node Backend đơn giản.',
        instructor: 'Đặng Thùy Trang',
        category: getCatId('Backend'),
        level: 'Beginner',
        price: 290000,
        rating: 4.5,
        students: 1540,
        thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=60'
      },
      {
        title: 'Dự Án Thực Tế: Xây Dựng Hệ Thống Quản Lý Khóa Học',
        description: 'Thực hành xây dựng dự án Course Management System trọn gói từ Backend REST API đến Frontend React Dashboard.',
        instructor: 'Trần Đức Lương',
        category: getCatId('Fullstack'),
        level: 'Advanced',
        price: 1150000,
        rating: 4.9,
        students: 1890,
        thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=60'
      }
    ];

    const courses = await Course.insertMany(coursesData);
    console.log(`[Seed]: Created ${courses.length} Courses`);

    // 4. Create Sample Enrollments
    const normalUsers = users.filter(u => u.role === 'user');
    const enrollmentsData = [
      { userId: normalUsers[0]._id, courseId: courses[0]._id, enrolledAt: new Date(Date.now() - 5 * 86400000) },
      { userId: normalUsers[0]._id, courseId: courses[1]._id, enrolledAt: new Date(Date.now() - 3 * 86400000) },
      { userId: normalUsers[1]._id, courseId: courses[0]._id, enrolledAt: new Date(Date.now() - 4 * 86400000) },
      { userId: normalUsers[1]._id, courseId: courses[2]._id, enrolledAt: new Date(Date.now() - 2 * 86400000) },
      { userId: normalUsers[2]._id, courseId: courses[3]._id, enrolledAt: new Date(Date.now() - 1 * 86400000) },
      { userId: normalUsers[3]._id, courseId: courses[1]._id, enrolledAt: new Date() }
    ];
    const enrollments = await Enrollment.insertMany(enrollmentsData);
    console.log(`[Seed]: Created ${enrollments.length} Enrollments`);

    // 5. Create Sample Search History
    const searchHistoriesData = [
      { userId: normalUsers[0]._id, keyword: 'nodejs backend', resultCount: 4, createdAt: new Date(Date.now() - 2 * 86400000) },
      { userId: normalUsers[0]._id, keyword: 'reactjs', resultCount: 3, createdAt: new Date(Date.now() - 1 * 86400000) },
      { userId: normalUsers[1]._id, keyword: 'javascript es6', resultCount: 2, createdAt: new Date(Date.now() - 3 * 86400000) },
      { userId: normalUsers[2]._id, keyword: 'mongodb mongoose', resultCount: 2, createdAt: new Date() }
    ];
    const searchHistories = await SearchHistory.insertMany(searchHistoriesData);
    console.log(`[Seed]: Created ${searchHistories.length} Search History logs`);

    console.log('========================================================');
    console.log(' SEED COMPLETED SUCCESSFULLY!');
    console.log('========================================================');
    console.log(' DEMO ACCOUNTS FOR TESTING:');
    console.log(' Admin Account:');
    console.log('   Email:    admin@system.com');
    console.log('   Password: admin123');
    console.log(' Standard User Account:');
    console.log('   Email:    nguyenvana@gmail.com');
    console.log('   Password: 123456');
    console.log('========================================================');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedData();
