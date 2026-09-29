# E-Commerce Application (React + Node.js + Express + MySQL + Docker)

A full-stack, responsive E-Commerce application with user authentication, product catalog, search & filtering, cart management, mock checkout flow, order history, and Docker containerization.

---

## 📁 Monorepo Structure

```text
ecommerce-project/
├── frontend/             # React + Vite + Axios Frontend
│   ├── src/
│   │   ├── components/   # UI Components & Modals
│   │   ├── context/      # Auth & Cart Context Providers
│   │   ├── pages/        # Home, Details, Cart, Checkout, Orders, Auth
│   │   ├── services/     # Axios API Client & Endpoints
│   │   ├── App.jsx
│   │   ├── index.css     # Design System & Styling
│   │   └── main.jsx
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
│
├── backend/              # Node.js + Express.js REST API
│   ├── src/
│   │   ├── config/       # Database connection setup (mysql2)
│   │   ├── controllers/  # Auth, Product, Cart, Order Controllers
│   │   ├── middleware/   # JWT Auth & Centralized Error Handler
│   │   ├── models/       # Database queries & transactions
│   │   ├── routes/       # API Endpoint Router definitions
│   │   └── server.js     # Entry point
│   ├── .env.example
│   ├── .dockerignore
│   ├── Dockerfile
│   └── package.json
│
├── database/             # Database DDL & Seed Script
│   └── schema.sql        # MySQL Tables & Seed Data
│
├── .gitignore
└── README.md
```

---

## 🛠️ Technology Stack

- **Frontend**: React, Vite, JavaScript, Axios, CSS (Custom Design System, Lucide Icons)
- **Backend**: Node.js, Express.js, `mysql2`, JWT (`jsonwebtoken`), Password Hashing (`bcryptjs`), `cors`
- **Database**: MySQL 8.x
- **Containerization**: Docker (Dockerfiles provided for backend & frontend)

---

## 🔑 Key Features & REST APIs

### 1. Authentication
- `POST /api/auth/register` — Register new user with hashed password (bcrypt).
- `POST /api/auth/login` — Authenticate user and receive JWT.
- `GET /api/auth/me` — Retrieve current authenticated user details.

### 2. Product Management
- `GET /api/products` — Get products with optional `?search=` and `?category=` filter.
- `GET /api/products/:id` — Get single product details.
- `POST /api/products` — Create new product.
- `PUT /api/products/:id` — Update existing product.
- `DELETE /api/products/:id` — Delete product.

### 3. Cart APIs (Protected)
- `GET /api/cart` — View user's cart items.
- `POST /api/cart` — Add product to cart or update quantity.
- `PUT /api/cart/:itemId` — Update cart item quantity.
- `DELETE /api/cart/:itemId` — Remove item from cart.

### 4. Order APIs (Protected)
- `POST /api/orders` — Convert user cart into an order (atomic MySQL transaction, stock reduction, price freeze).
- `GET /api/orders` — List user's past orders.
- `GET /api/orders/:id` — Get order detail breakdown with items.

Order Statuses supported: `PENDING`, `CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED`.

---

## ⚙️ Setup & Local Running Guide

### 1. Database Setup (MySQL)
Execute `database/schema.sql` in your MySQL database instance:
```bash
mysql -u root -p < database/schema.sql
```

### 2. Backend Setup
Navigate to `backend/`:
```bash
cd backend
npm install
```
Copy `.env.example` to `.env` and fill in your DB credentials:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ecommerce
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=super_secret_jwt_key
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Navigate to `frontend/`:
```bash
cd frontend
npm install
```
Copy `.env.example` to `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```
Start the frontend development server:
```bash
npm run dev
```

---

## 🐳 Docker Deployment (Individual Dockerfiles)

### Build & Run Backend Docker Image
```bash
cd backend
docker build -t ecommerce-backend .
docker run -p 5000:5000 --env-file .env ecommerce-backend
```

### Build & Run Frontend Docker Image
```bash
cd frontend
docker build -t ecommerce-frontend .
docker run -p 3000:80 ecommerce-frontend
```
