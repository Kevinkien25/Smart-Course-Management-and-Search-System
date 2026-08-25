# Course Management & Smart Search System

Một hệ thống quản lý và tìm kiếm khóa học trực tuyến thông minh được xây dựng bằng **100% JavaScript (MERN Stack)**. Dự án sử dụng duy nhất thuật toán **Rule-Based Search Ranking Algorithm** được lập trình bằng JavaScript thuần, **KHÔNG** sử dụng Machine Learning, AI models, Python, OpenAI, Gemini, Elasticsearch hay Redis.

---

## 📋 1. Project Overview (Tổng quan dự án)

**Course Management & Smart Search System** có kiến trúc 3 lớp đơn giản:

```
[ReactJS Frontend] ──(REST API & JWT)──> [ExpressJS Backend] ──(Mongoose ODM)──> [MongoDB Database]
```

Hệ thống cho phép người dùng tìm kiếm các khóa học (ví dụ: `"nodejs backend"`), phân tích từ khóa và tính toán điểm phù hợp (**Relevance Score**) bằng một thuật toán xếp hạng thuần JavaScript.

---

## ✨ 2. Features (Tính năng chính)

### 👤 Role User (Học viên)
- **Authentication**: Đăng ký, Đăng nhập, Đăng xuất, Lưu phiên làm việc JWT và băm mật khẩu `bcryptjs`.
- **Xem & Tìm kiếm khóa học**: Tìm kiếm thông minh với thuật toán xếp hạng Rule-Based hiển thị trực quan.
- **Bộ lọc & Sắp xếp**:
  - Lọc theo Danh mục (Category), Trình độ (Beginner, Intermediate, Advanced), Khoảng giá.
  - Sắp xếp theo Độ phù hợp (Relevance Score), Đánh giá cao nhất, Lượt học viên đông nhất, Giá tăng/giảm.
- **Đăng ký học (Enrollment)**: Đăng ký khóa học và xem danh sách khóa học cá nhân đã đăng ký.
- **Lịch sử tìm kiếm (Search History)**: Lưu vết và quản lý lịch sử tìm kiếm cá nhân.

### 🛡️ Role Admin (Quản trị viên)
- **Admin Dashboard**: Thẻ thống kê thời gian thực (Total Courses, Total Users, Total Enrollments, Total Searches).
- **Quản lý Khóa học (Course CRUD)**: Thêm mới, Sửa thông tin/học phí, Xóa khóa học.
- **Quản lý Danh mục (Category CRUD)**: Thêm mới, Sửa, Xóa danh mục khóa học.
- **Quản lý Người dùng**: Xem danh sách toàn bộ tài khoản người dùng trong hệ thống.

---

## 🛠 3. Technologies (Công nghệ sử dụng)

### Frontend
- **ReactJS (v18)** - Thư viện UI
- **Vite** - Build tool thế hệ mới
- **React Router DOM (v6)** - Navigation & Phân quyền
- **Bootstrap 5 & React-Bootstrap** - Responsive UI
- **Axios** - HTTP client gắn JWT Interceptor tự động
- **Lucide-React** - Icons

### Backend
- **Node.js** - JavaScript Runtime
- **Express.js** - RESTful API Framework
- **JWT (jsonwebtoken)** - Auth Token
- **bcryptjs** - Password Hashing
- **CORS & dotenv** - App config

### Database
- **MongoDB** - NoSQL Database
- **Mongoose** - ODM & Schemas

### ❌ KHÔNG SỬ DỤNG:
- 🚫 Python, TensorFlow, PyTorch
- 🚫 Machine Learning, Deep Learning, AI Models
- 🚫 AI API, OpenAI API, Gemini API
- 🚫 Elasticsearch, Redis
- 🚫 AWS, Microservices

---

## 📐 4. System Architecture (Kiến trúc hệ thống)

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ReactJS Frontend (Vite)                         │
│  - Public: Home, CourseList, CourseDetail, Login, Register             │
│  - User: UserDashboard, MyCourses, SearchHistoryPage                   │
│  - Admin: AdminDashboard, ManageCourses, ManageCategories...           │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │  HTTP / REST API
                                   │  Headers: Authorization: Bearer <JWT>
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         Node.js + Express.js                           │
│  - Middleware: authMiddleware, errorHandler                            │
│  - Controllers: Auth, Course, Category, Search, Enrollment, Admin      │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│              Rule-Based Search Ranking Service (JS Pure)               │
│  - File: backend/src/services/searchRankingService.js                  │
│  - Rule Scoring Formula:                                               │
│    Exact Title Match (+8), Title Word Match (+5), Description (+2)     │
│    Category Match (+3), Rating Boost (+rating*0.5), Student Log Boost  │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                          MongoDB Database                              │
│  - Collections: users, courses, categories, enrollments, search_histories │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🤖 5. Search Ranking Algorithm (Thuật toán xếp hạng từ khóa)

Thuật toán được cài đặt tại file: `backend/src/services/searchRankingService.js`

### Các bước xử lý (100% JavaScript):

1. **Query Normalization & Tokenization**:
   - Chuyển chuỗi về chữ thường.
   - Loại bỏ ký tự đặc biệt & bỏ dấu tiếng Việt (NFD normalization).
   - Tách chuỗi thành danh sách từ khóa (`tokens`).

2. **Relevance Scoring Formula**:

$$\text{Score} = \text{Score}_{\text{title\_exact}} + \text{Score}_{\text{title\_term}} + \text{Score}_{\text{desc\_term}} + \text{Score}_{\text{category}} + \text{Bonus}_{\text{rating}} + \text{Bonus}_{\text{students}}$$

| Quy tắc (Rule) | Trọng số (Score Points) | Chi tiết điều kiện |
| :--- | :--- | :--- |
| **Title Exact Match** | `+8 điểm` | Tiêu đề chứa chính xác cụm từ tìm kiếm |
| **Title Keyword Match** | `+5 điểm / từ` | Từ khóa xuất hiện trong tiêu đề |
| **Description Match** | `+2 điểm / từ` | Từ khóa xuất hiện trong mô tả |
| **Category Match** | `+3 điểm` | Từ khóa trùng tên danh mục |
| **Rating Boost** | `rating * 0.5` | Thưởng thêm từ đánh giá sao |
| **Popularity Boost** | `Math.log10(students + 1)` | Thưởng thêm theo lượt học viên |

3. **Tie-Breaker Priority Sort**:
   - `Score DESC` -> `Rating DESC` -> `Students DESC`.

---

## 📡 6. API Documentation

### Authentication
- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập nhận JWT Token
- `GET /api/auth/me` - Lấy profile tài khoản

### Search Engine
- `GET /api/search?q=nodejs+backend` - Tìm kiếm xếp hạng khóa học theo thuật toán Rule-Based.

### Courses & Categories
- `GET /api/courses` - Lấy danh sách khóa học (Lọc & Sắp xếp)
- `GET /api/courses/:id` - Lấy chi tiết khóa học
- `POST /api/courses` - (Admin) Tạo khóa học mới
- `PUT /api/courses/:id` - (Admin) Cập nhật khóa học
- `DELETE /api/courses/:id` - (Admin) Xóa khóa học
- `GET /api/categories` - Lấy danh sách danh mục

### Enrollment & Search History
- `POST /api/enrollments` - Đăng ký khóa học
- `GET /api/enrollments` - Xem danh sách khóa học đã đăng ký
- `GET /api/search-history` - Xem lịch sử tìm kiếm
- `DELETE /api/search-history/:id` - Xóa lịch sử tìm kiếm

### Admin Dashboard
- `GET /api/admin/stats` - (Admin) Thống kê hệ thống
- `GET /api/admin/users` - (Admin) Xem danh sách người dùng

---

## 🔑 7. Demo Accounts (Tài khoản thử nghiệm)

| Vai Trò | Email | Mật Khẩu | Quyền Hạn |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@system.com` | `admin123` | Quản trị viên (Admin Portal) |
| **User** | `nguyenvana@gmail.com` | `123456` | Học viên mẫu |

---

## 🚀 8. Running the Project (Khởi chạy dự án)

### Bước 1: Khởi động Backend & Seed Data
```bash
cd backend
npm install
npm run seed     # Thêm dữ liệu mẫu 10 Users, 20 Courses, 8 Categories
npm run dev      # Running at http://localhost:5001
```

### Bước 2: Khởi động Frontend
```bash
cd frontend
npm install
npm run dev      # Running at http://localhost:3000
```
