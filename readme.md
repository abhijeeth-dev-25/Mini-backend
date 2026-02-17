# 🔐 Secure API - Mini Backend Project

A clean, simple, and professional RESTful API built with **Node.js**, **Express**, **MongoDB**, and **JWT Authentication**. Features secure user authentication and role-based access control.

---

## ✨ What This API Does

- 👤 **User Authentication** - Register and login with secure JWT tokens
- 🔒 **Role-Based Access** - Three user roles: `user`, `manager`, `admin`
- 📦 **Product Management** - Create and delete products (role-protected)
- 👥 **User Management** - View profiles and manage users
- 🛡️ **Security** - Password encryption and protected API routes

---

## � Quick Start

### Step 1: Prerequisites

Make sure you have these installed:
- **Node.js** (version 14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - Running locally or use a cloud service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### Step 2: Install Dependencies

Open your terminal in the project folder and run:

```bash
npm install
```

### Step 3: Configure Environment

Create a `.env` file in the root folder (same level as `package.json`):

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/secure_api
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=1h
```

> **Important**: Change `JWT_SECRET` to a strong random string in production!

### Step 4: Start MongoDB

Make sure MongoDB is running:
- **Mac**: `brew services start mongodb-community`
- **Windows**: Start MongoDB service from Services
- **Cloud**: Use your MongoDB Atlas connection string in `MONGO_URI`

### Step 5: Run the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

✅ **Success!** You should see:
```
Server running on port 5000
MongoDB connected
```

---

## � API Endpoints Reference

### Base URL
```
http://localhost:5000
```

---

## 🔓 Public Endpoints (No Authentication Required)

### 1️⃣ Register a New User

**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

| Field | Type | Required | Options |
|-------|------|----------|---------|
| name | String | ✅ Yes | Any name |
| email | String | ✅ Yes | Valid email |
| password | String | ✅ Yes | Min 6 characters |
| role | String | ❌ No | `user` (default), `manager`, `admin` |

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### 2️⃣ Login

**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

> 🔑 **Important**: Save this token! You'll need it for all protected routes.

---

### 3️⃣ Get All Products

**GET** `/api/products`

**Who can access**: Public (No authentication required)

**Success Response (200):**
```json
[
  {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Gaming Laptop",
    "price": 1500,
    "createdBy": "user_id_here"
  },
  ...
]
```

---

## 🔒 Protected Endpoints (Authentication Required)

> **How to authenticate**: Add this header to all requests below:
> ```
> Authorization: Bearer <your_token_here>
> ```

---

### 3️⃣ Get My Profile

**GET** `/api/users/me`

**Who can access**: Any logged-in user

**Success Response (200):**
```json
{
  "message": "Profile fetched successfully",
  "user": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### 4️⃣ Get All Users

**GET** `/api/users`

**Who can access**: `admin` only

**Success Response (200):**
```json
{
  "message": "Users fetched successfully",
  "count": 5,
  "users": [...]
}
```

---

### 5️⃣ Create a Product

**POST** `/api/products`

**Who can access**: `manager` or `admin`

**Request Body:**
```json
{
  "name": "Gaming Laptop",
  "price": 1500
}
```

**Success Response (201):**
```json
{
  "message": "Product created successfully",
  "product": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Gaming Laptop",
    "price": 1500,
    "createdBy": "user_id_here"
  }
}
```

---

### 6️⃣ Delete a Product

**DELETE** `/api/products/:id`

**Who can access**: `admin` only

Replace `:id` with the actual product ID.

**Success Response (200):**
```json
{
  "message": "Product deleted successfully",
  "product": {...}
}
```

---

## 🧪 Testing with Postman - Complete Guide

### Step-by-Step Testing

#### **Test 1: Register an Admin**

1. Open Postman
2. Create a new request
3. Set method to **POST**
4. Enter URL: `http://localhost:5000/auth/register`
5. Click **Body** tab → Select **raw** → Choose **JSON**
6. Paste this:
   ```json
   {
     "name": "Admin User",
     "email": "admin@test.com",
     "password": "admin123",
     "role": "admin"
   }
   ```
7. Click **Send**
8. ✅ You should get a 201 status

---

#### **Test 2: Login and Get Token**

1. Create a new request
2. Set method to **POST**
3. Enter URL: `http://localhost:5000/auth/login`
4. Body (raw JSON):
   ```json
   {
     "email": "admin@test.com",
     "password": "admin123"
   }
   ```
5. Click **Send**
6. **COPY THE TOKEN** from the response (the long string after `"token":`)

---

#### **Test 3: Access Protected Route**

1. Create a new request
2. Set method to **GET**
3. Enter URL: `http://localhost:5000/api/users/me`
4. **Click Headers tab**
5. Add new header:
   - **Key**: `Authorization`
   - **Value**: `Bearer <paste_your_token_here>` (Note the space after "Bearer")
6. Click **Send**
7. ✅ You should see your profile data

---

#### **Test 4: Create a Product**

1. Create a new request
2. Set method to **POST**
3. Enter URL: `http://localhost:5000/api/products`
4. **Add Authorization header** (same as Test 3)
5. Click **Body** tab → raw → JSON
6. Paste:
   ```json
   {
     "name": "Test Product",
     "price": 99.99
   }
   ```
7. Click **Send**
8. ✅ Product created! Note the product `id` in response

---

#### **Test 5: Delete a Product**

1. Create a new request
2. Set method to **DELETE**
3. Enter URL: `http://localhost:5000/api/products/<product_id>` (replace with actual ID from Test 4)
4. **Add Authorization header** (same as Test 3)
5. Click **Send**
6. ✅ Product deleted!

---

## 🎯 Role-Based Access Control (RBAC)

| Endpoint | user | manager | admin |
|----------|------|---------|-------|
| Register/Login | ✅ | ✅ | ✅ |
| Get My Profile | ✅ | ✅ | ✅ |
| Get All Users | ❌ | ❌ | ✅ |
| Get All Products | ✅ | ✅ | ✅ |
| Create Product | ❌ | ✅ | ✅ |
| Delete Product | ❌ | ❌ | ✅ |

---

## � Project Structure

```
Mini-backend/
├── src/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   ├── user.model.js      # User schema
│   │   └── product.model.js   # Product schema
│   ├── controllers/
│   │   ├── auth.controller.js    # Register & Login logic
│   │   ├── user.controller.js    # User operations
│   │   └── product.controller.js # Product operations
│   ├── middlewares/
│   │   ├── auth.middleware.js    # JWT verification
│   │   └── rbac.middleware.js    # Role checking
│   ├── routes/
│   │   ├── auth.routes.js     # Auth endpoints
│   │   ├── user.routes.js     # User endpoints
│   │   └── product.routes.js  # Product endpoints
│   ├── app.js                 # Express setup
│   └── server.js              # Entry point
├── .env                       # Environment variables
├── .gitignore
├── package.json
└── README.md
```

---

## ⚠️ Common Errors & Solutions

### Error: "MongoDB connection error"
- **Solution**: Make sure MongoDB is running. Check your `MONGO_URI` in `.env`

### Error: "Not authorized, no token"
- **Solution**: Add `Authorization: Bearer <token>` header to your request

### Error: "User role X is not authorized"
- **Solution**: This endpoint requires a different role. Check the RBAC table above.

### Error: "User already exists"
- **Solution**: Use a different email or login with existing credentials

---

## 🔒 Security Notes

- ✅ Passwords are hashed with bcrypt (10 salt rounds)
- ✅ JWT tokens expire after 1 hour
- ✅ Password fields are hidden in database responses
- ⚠️ Change `JWT_SECRET` to a strong random string in production
- ⚠️ Use HTTPS in production
- ⚠️ Enable CORS only for trusted domains in production

---

## 📝 License

ISC

---

## 🤝 Need Help?

If you encounter any issues:
1. Check the **Common Errors** section above
2. Make sure MongoDB is running
3. Verify your `.env` file is configured correctly
4. Check that you're using the correct HTTP methods and URLs

---

**Happy Coding! **
