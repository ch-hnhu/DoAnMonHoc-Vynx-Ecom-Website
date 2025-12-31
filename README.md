# 🛒 Vynx E-Commerce Website

Dự án website thương mại điện tử với kiến trúc tách biệt Backend (Laravel API) và Frontend (React).

## 📋 Mô tả dự án

Website bán hàng trực tuyến hiện đại với đầy đủ các tính năng:

-   Quản lý sản phẩm, danh mục
-   Giỏ hàng và thanh toán
-   Quản lý đơn hàng
-   Xác thực người dùng (Authentication)
-   Admin dashboard

## 🛠️ Công nghệ sử dụng

### Backend

-   **Laravel 12** - PHP Framework
-   **Laravel Sanctum** - API Authentication
-   **MySQL** - Database
-   **RESTful API**

### Frontend

-   **React 18** - UI Library
-   **Vite** - Build Tool
-   **Axios** - HTTP Client
-   **React Router** - Navigation

## 📦 Yêu cầu hệ thống

Trước khi bắt đầu, hãy đảm bảo máy tính đã cài đặt:

-   **PHP** >= 8.2
-   **Composer** - PHP Dependency Manager
-   **Node.js** >= 18.x
-   **npm** hoặc **yarn**
-   **MySQL** >= 8.0
-   **Git**

## 🚀 Hướng dẫn cài đặt

### 1️⃣ Clone Repository

```bash
git clone https://github.com/ch-hnhu/DoAnMonHoc-Vynx-Ecom-Website.git
cd DoAnMonHoc-Vynx-Ecom-Website
```

### 2️⃣ Cài đặt Backend (Laravel)

```bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt dependencies
composer install

# Copy file environment
cp .env.example .env

# Generate application key
php artisan key:generate

# Cấu hình database trong file .env (có hướng dẫn bên dưới)

# Tạo database trong MySQL (đặt tên db là Vynx-Ecom-Website)

# Chạy migrations
php artisan migrate
```

### 3️⃣ Cài đặt Frontend (React)

```bash
# Mở terminal mới, di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies
npm install
```

## ▶️ Chạy ứng dụng

### Backend - Laravel API

```bash
cd backend
php artisan serve
```

Server sẽ chạy tại: **http://localhost:8000**

### Frontend - React App

Mở terminal mới:

```bash
cd frontend
npm run dev
```

App sẽ chạy tại: **http://localhost:5173**

## 📁 Cấu trúc thư mục

```
DoAnMonHoc-Vynx-Ecom-Website/
├── backend/                # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   └── Middleware/
│   │   └── Models/
│   ├── config/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   │   ├── api.php        # API routes
│   │   └── web.php
│   └── .env               # Environment config
│
├── frontend/              # React App
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   │   └── api.js     # Axios instance
│   │   ├── config/        # Configuration
│   │   │   └── api.js     # API URL config
│   │   ├── App.jsx        # Main component
│   │   └── main.jsx       # Entry point
│   ├── public/
│   └── package.json
│
└── README.md
```

## 🔗 API Endpoints

Base URL: `http://localhost:8000/api`

### Public Routes

Trong `frontend/src/App.jsx`:

```
GET  / hoặc /test           # Test API connection
```

## 🔐 Authentication

Project sử dụng **Laravel Sanctum** cho API authentication:

1. Frontend gửi credentials đến `/api/login`
2. Backend trả về token
3. Frontend lưu token và gửi kèm trong header cho các request tiếp theo

## 🌐 CORS Configuration

CORS đã được cấu hình để cho phép frontend (localhost:5173) gọi API backend (localhost:8000).

File cấu hình: `backend/app/Http/Middleware/Cors.php`

## 📝 Environment Variables

### Backend (.env)

```env
APP_NAME=VynxEcomWebsite
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=Vynx-Ecom-Website
DB_USERNAME=root
DB_PASSWORD=
```

## 🤝 Quy trình làm việc với Git

```bash
# Pull code mới nhất
git pull origin main

# Tạo branch mới cho feature
git checkout dev/<ten>
# Ví dụ:
git checkout dev/nhu

# Sau khi code xong
# Di chuyển ra ngoài thư mục gốc (DoAnMonHoc-Vynx-Ecom-Website)
cd ..
git add .
git commit -m "feat: mô tả feature"
git push origin dev/<ten>

# Tạo Pull Request trên GitHub
```

## 👥 Team Members

-   **Chung Huệ Như** - Leader
-   **Nguyễn Nhất Tâm** - Member
-   **Phạm Quang Khải** - Time Keeper
-   **Trần Hữu Minh Hiệp** - Note Taker

---

💡 **Lưu ý:** Nếu gặp lỗi, hãy kiểm tra:

1. PHP và Node.js đã cài đúng version
2. Database đã tạo và cấu hình đúng trong .env
3. Đã chạy `composer install` và `npm install`
4. Backend và Frontend đang chạy trên đúng port
5. CORS đã được cấu hình đúng

Nếu vẫn gặp vấn đề, hãy báo vào group chung!
