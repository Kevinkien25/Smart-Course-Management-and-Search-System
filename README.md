# Course Management & Smart Search System (Hybrid Rule-Based & OpenAI Engine)

Một hệ thống quản lý và tìm kiếm khóa học trực tuyến thông minh được xây dựng bằng **100% JavaScript (MERN Stack)**. Hệ thống kết hợp giữa bộ máy xếp hạng tìm kiếm tự động **Rule-Based Search Ranking Engine** (JavaScript thuần) và module nâng cao **OpenAI API Integration (Active)**.

---

## 📋 1. Project Overview (Tổng quan dự án)

**Course Management & Smart Search System** giải quyết bài toán tìm kiếm khóa học trực tuyến theo cơ chế xếp hạng độ phù hợp (**Relevance Score**) minh bạch.

```
┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐
│    ReactJS Frontend    │ ────>│   ExpressJS Backend    │ ────>│    MongoDB Database    │
│  (Vite + Bootstrap 5)  │ <────│ (Node.js + REST API)   │ <────│ (Mongoose Schemas)     │
└────────────────────────┘      └───────────┬────────────┘      └────────────────────────┘
                                            │
                                            ▼
                                ┌────────────────────────┐
                                │   OpenAI GPT-3.5 API   │
                                │ (Search Intent & Sums) │
                                └────────────────────────┘
```

---

## ✨ 2. Features (Tính năng chính)

### 👤 Role User (Học viên)
- **Authentication**: Đăng ký, Đăng nhập, Đăng xuất phiên làm việc với JWT Token & mã hóa mật khẩu `bcryptjs`.
- **Khám phá khóa học**: Xem danh mục nổi bật, danh sách khóa học, xem chi tiết học phần.
- **Smart Search UI**: Tìm kiếm khóa học với xếp hạng điểm độ phù hợp (Relevance Score) và hiển thị các trường trùng khớp (`title`, `description`, `category`).
- **OpenAI Search Intent Analysis ⚡**:
  - Tự động phân tích Ý định tìm kiếm (Intent) của người dùng bằng OpenAI.
  - Đề xuất các **Thẻ từ khóa AI mở rộng** liên quan để click lọc nhanh.
  - Đưa ra lời khuyên lộ trình học tập bằng tiếng Việt từ OpenAI.
- **OpenAI Course Summarizer ⚡**:
  - Tự động tóm tắt 3 điểm cốt lõi nhất của từng khóa học và đối tượng phù hợp bằng OpenAI GPT.
- **Lọc & Sắp xếp đa dạng**:
  - Lọc theo Danh mục (Category), Trình độ (Beginner, Intermediate, Advanced), Khoảng giá.
  - Sắp xếp theo Độ phù hợp (Relevance Score), Đánh giá cao nhất, Lượt học viên đông nhất, Giá tăng/giảm.
- **Đăng ký học (Enrollment)**: Đăng ký khóa học và quản lý danh sách khóa học cá nhân.
- **Lịch sử tìm kiếm (Search History)**: Tự động lưu vết và quản lý lịch sử tìm kiếm cá nhân.

### 🛡️ Role Admin (Quản trị viên)
- **Admin Portal Dashboard**:
  - Thẻ thống kê thời gian thực: Total Courses, Total Users, Total Enrollments, Total Searches.
- **Quản lý Khóa học (Course CRUD)**: Thêm mới, Sửa thông tin/học phí/giảng viên/mô tả, Xóa khóa học.
- **Quản lý Danh mục (Category CRUD Modal)**: Thêm, Sửa, Xóa các danh mục công nghệ (NodeJS, ReactJS, MongoDB...).
- **Quản lý Người dùng**: Xem danh sách toàn bộ tài khoản người dùng đã đăng ký trong hệ thống.

---

## 🛠 3. Technologies (Công nghệ sử dụng)

### Frontend
- **ReactJS (v18)** - Thư viện UI
- **Vite** - Build tool thế hệ mới
- **React Router DOM (v6)** - Navigation & Phân quyền
- **Bootstrap 5 & React-Bootstrap** - Responsive Design
- **Axios** - Client gửi HTTP Request tự động gắn JWT Bearer Interceptor
- **Lucide-React** - Bộ icon hiện đại

### Backend
- **Node.js** - JavaScript Server Runtime
- **Express.js** - Web Framework xây dựng RESTful API
- **JWT (jsonwebtoken)** - Quản lý phiên làm việc & xác thực token
- **bcryptjs** - Băm mã hóa mật khẩu bảo mật
- **OpenAI Node SDK (`openai`)** - Tích hợp OpenAI GPT-3.5 API
- **CORS & dotenv** - Cấu hình truy cập và biến môi trường

### Database
- **MongoDB** - Cơ sở dữ liệu NoSQL
- **Mongoose ODM** - Định nghĩa Schemas & Data Relationships

---

## 🤖 4. Search Ranking Algorithm (Thuật toán xếp hạng từ khóa)

Thuật toán được cài đặt tại file: `backend/src/services/searchRankingService.js`

### Công thức tính điểm phù hợp (Relevance Score):

$$\text{Score} = \text{Score}_{\text{title\_exact}} + \text{Score}_{\text{title\_term}} + \text{Score}_{\text{desc\_term}} + \text{Score}_{\text{category}} + \text{Bonus}_{\text{rating}} + \text{Bonus}_{\text{students}}$$

| Quy tắc (Rule) | Trọng số (Score Points) | Chi tiết điều kiện |
| :--- | :--- | :--- |
| **Title Exact Match** | `+8 điểm` | Tiêu đề chứa chính xác toàn bộ cụm từ tìm kiếm |
| **Title Keyword Match** | `+5 điểm / từ` | Mỗi từ khóa xuất hiện trong tiêu đề |
| **Description Match** | `+2 điểm / từ` | Mỗi từ khóa xuất hiện trong mô tả |
| **Category Match** | `+3 điểm` | Từ khóa trùng tên danh mục |
| **Rating Boost** | `rating * 0.5` | Thưởng thêm từ đánh giá sao (Tối đa 2.5 điểm) |
| **Popularity Boost** | `Math.log10(students + 1)` | Thưởng thêm logarithm theo số học viên |

### Thuật toán sắp xếp ưu tiên (Tie-Breaker Priority Sort):
1. `score` Giảm dần (DESC)
2. `rating` Giảm dần (DESC)
3. `students` Giảm dần (DESC)

---

## 🗄️ 5. Database Design (Thiết kế Cơ sở dữ liệu)

### Collection: `users`
- `_id`: ObjectId (Primary Key)
- `name`: String (Required)
- `email`: String (Required, Unique, Lowercase)
- `password`: String (Required, Hashed via bcryptjs)
- `role`: String (Enum: `['user', 'admin']`, Default: `'user'`)
- `createdAt`, `updatedAt`: Date

### Collection: `categories`
- `_id`: ObjectId (Primary Key)
- `name`: String (Required, Unique)
- `description`: String
- `createdAt`: Date

### Collection: `courses`
- `_id`: ObjectId (Primary Key)
- `title`: String (Required)
- `description`: String (Required)
- `instructor`: String (Required)
- `category`: ObjectId (Ref `Category`, Required)
- `level`: String (Enum: `['Beginner', 'Intermediate', 'Advanced']`)
- `price`: Number (Min: 0)
- `rating`: Number (0 - 5)
- `students`: Number (Min: 0)
- `thumbnail`: String (URL)
- `createdAt`, `updatedAt`: Date

### Collection: `enrollments`
- `_id`: ObjectId (Primary Key)
- `userId`: ObjectId (Ref `User`, Required)
- `courseId`: ObjectId (Ref `Course`, Required)
- `enrolledAt`: Date (Default: `Date.now`)

### Collection: `search_histories`
- `_id`: ObjectId (Primary Key)
- `userId`: ObjectId (Ref `User`, Required)
- `keyword`: String (Required)
- `resultCount`: Number (Default: 0)
- `createdAt`: Date (Default: `Date.now`)

---

## 📡 6. API Documentation (Tài liệu REST API)

### Authentication
- `POST /api/auth/register` - Đăng ký tài khoản người dùng mới
- `POST /api/auth/login` - Đăng nhập nhận JWT Token
- `GET /api/auth/me` - Lấy thông tin tài khoản đang đăng nhập

### Smart Search & OpenAI API
- `GET /api/search?q=nodejs+backend` - Tìm kiếm xếp hạng khóa học theo thuật toán Rule-Based.
- `GET /api/ai/search-intent?q=nodejs` - (OpenAI) Phân tích ý định tìm kiếm & gợi ý từ khóa mở rộng.
- `POST /api/ai/summarize` - (OpenAI) Tóm tắt thông minh nội dung khóa học.

### Courses & Categories
- `GET /api/courses` - Lấy danh sách khóa học (Lọc `category`, `level`, `minPrice`, `maxPrice`, `sort`)
- `GET /api/courses/:id` - Lấy chi tiết khóa học theo ID
- `POST /api/courses` - (Admin) Tạo khóa học mới
- `PUT /api/courses/:id` - (Admin) Cập nhật khóa học
- `DELETE /api/courses/:id` - (Admin) Xóa khóa học
- `GET /api/categories` - Lấy danh sách danh mục
- `POST /api/categories` - (Admin) Tạo danh mục mới
- `PUT /api/categories/:id` - (Admin) Cập nhật danh mục
- `DELETE /api/categories/:id` - (Admin) Xóa danh mục

### Enrollment & Search History
- `POST /api/enrollments` - (User) Đăng ký tham gia khóa học
- `GET /api/enrollments` - (User) Xem danh sách khóa học đã đăng ký
- `GET /api/search-history` - (User) Xem lịch sử tìm kiếm cá nhân
- `DELETE /api/search-history/:id` - (User) Xóa 1 dòng lịch sử tìm kiếm

### Admin Management
- `GET /api/admin/stats` - (Admin) Lấy dữ liệu thống kê tổng quan
- `GET /api/admin/users` - (Admin) Xem danh sách người dùng trong hệ thống

---

## 🔑 7. Demo Accounts (Tài khoản thử nghiệm)

| Vai Trò | Email | Mật Khẩu | Quyền Hạn |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@system.com` | `admin123` | Quyền Quản trị viên (Admin Portal Dashboard) |
| **User** | `nguyenvana@gmail.com` | `123456` | Quyền Học viên mẫu |

*(Trang Login có tích hợp sẵn nút Quick Fill 1-Click giúp thử nghiệm nhanh).*

---

## 📦 8. Environment Variables (Biến môi trường)

Trong file `backend/.env`:
```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/course_management_db
JWT_SECRET=super_secret_course_system_jwt_key_2026
JWT_EXPIRE=30d
NODE_ENV=development
OPENAI_API_KEY=
```

---

## 🚀 9. Running the Project (Hướng dẫn khởi chạy)

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

---

## 📂 10. Project Structure (Cấu trúc thư mục)

```
course-search-system/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/
│   │   │   ├── adminController.js
│   │   │   ├── aiController.js
│   │   │   ├── authController.js
│   │   │   ├── categoryController.js
│   │   │   ├── courseController.js
│   │   │   ├── enrollmentController.js
│   │   │   ├── searchController.js
│   │   │   └── searchHistoryController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   ├── Category.js
│   │   │   ├── Course.js
│   │   │   ├── Enrollment.js
│   │   │   ├── SearchHistory.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── adminRoutes.js
│   │   │   ├── aiRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── categoryRoutes.js
│   │   │   ├── courseRoutes.js
│   │   │   ├── enrollmentRoutes.js
│   │   │   ├── searchHistoryRoutes.js
│   │   │   └── searchRoutes.js
│   │   ├── services/
│   │   │   ├── aiService.js
│   │   │   └── searchRankingService.js
│   │   ├── utils/
│   │   │   ├── generateToken.js
│   │   │   └── seedData.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/AuthContext.jsx
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── README.md
└── .gitignore
```
