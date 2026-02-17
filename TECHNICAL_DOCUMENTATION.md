# 📚 Technical Documentation - Secure API Project

> **Complete System Design, Architecture, and Implementation Guide**

---

## 📑 Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Design](#architecture-design)
3. [Project Structure](#project-structure)
4. [Dependencies & Libraries](#dependencies--libraries)
5. [File-by-File Breakdown](#file-by-file-breakdown)
6. [Request Flow & Data Flow](#request-flow--data-flow)
7. [Security Implementation](#security-implementation)
8. [Database Design](#database-design)

---

## 1. System Overview

### What This System Does

This is a **RESTful API backend** that provides:
- Secure user authentication using JSON Web Tokens (JWT)
- Role-Based Access Control (RBAC) with three permission levels
- Product management capabilities
- User profile and administration features

### Technology Stack

```
┌─────────────────────────────────────┐
│         Client (Postman/App)        │
└─────────────────┬───────────────────┘
                  │ HTTP/JSON
┌─────────────────▼───────────────────┐
│         Express.js Server           │
│  ┌──────────────────────────────┐   │
│  │   Routes → Controllers       │   │
│  │   Middlewares (Auth/RBAC)    │   │
│  └──────────────────────────────┘   │
└─────────────────┬───────────────────┘
                  │ Mongoose ODM
┌─────────────────▼───────────────────┐
│         MongoDB Database            │
│    Collections: users, products     │
└─────────────────────────────────────┘
```

---

## 2. Architecture Design

### Architectural Pattern: **MVC (Model-View-Controller)**

We use a modified MVC pattern suitable for REST APIs:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│    Routes    │─────▶│ Controllers  │─────▶│    Models    │
│  (Routing)   │      │   (Logic)    │      │  (Database)  │
└──────────────┘      └──────────────┘      └──────────────┘
       │                     │                      │
       │              ┌──────▼──────┐              │
       └─────────────▶│ Middlewares │◀─────────────┘
                      │ (Auth/RBAC) │
                      └─────────────┘
```

### Why This Architecture?

1. **Separation of Concerns**: Each layer has a single responsibility
2. **Maintainability**: Easy to locate and modify specific functionality
3. **Scalability**: Can extend features without affecting existing code
4. **Testability**: Each component can be tested independently

### Design Patterns Used

#### 1. **Middleware Pattern** (Express.js)
- Request processing pipeline
- Authentication and authorization checks
- Logging and error handling

#### 2. **Repository Pattern** (Mongoose Models)
- Abstraction over database operations
- Centralized data access logic

#### 3. **Factory Pattern** (JWT Token Generation)
- Encapsulated token creation logic
- Consistent token structure

---

## 3. Project Structure

```
Mini-backend/
│
├── src/                          # Source code directory
│   │
│   ├── config/                   # Configuration files
│   │   └── db.js                 # MongoDB connection setup
│   │
│   ├── models/                   # Data models (Mongoose schemas)
│   │   ├── user.model.js         # User schema & methods
│   │   └── product.model.js      # Product schema
│   │
│   ├── controllers/              # Business logic
│   │   ├── auth.controller.js    # Registration & login
│   │   ├── user.controller.js    # User operations
│   │   └── product.controller.js # Product operations
│   │
│   ├── middlewares/              # Request interceptors
│   │   ├── auth.middleware.js    # JWT verification
│   │   └── rbac.middleware.js    # Role-based access control
│   │
│   ├── routes/                   # API route definitions
│   │   ├── auth.routes.js        # /auth/* routes
│   │   ├── user.routes.js        # /api/users/* routes
│   │   └── product.routes.js     # /api/products/* routes
│   │
│   ├── app.js                    # Express application setup
│   └── server.js                 # Application entry point
│
├── .env                          # Environment variables (not in git)
├── .gitignore                    # Git ignore rules
├── package.json                  # Project metadata & dependencies
├── README.md                     # User documentation
└── TECHNICAL_DOCUMENTATION.md    # This file
```

### Directory Purpose

| Directory | Purpose | Why? |
|-----------|---------|------|
| `config/` | Configuration logic | Centralize settings, easy to change environments |
| `models/` | Database schemas | Define data structure, validation rules |
| `controllers/` | Business logic | Handle requests, implement features |
| `middlewares/` | Request processing | Reusable authentication/authorization |
| `routes/` | URL mapping | Clean separation of routing from logic |

---

## 4. Dependencies & Libraries

### Production Dependencies

#### 1. **express** (^5.2.1)
```javascript
const express = require('express');
```

**Purpose**: Web framework for Node.js  
**Why We Use It**:
- Simplifies HTTP server creation
- Provides routing system
- Middleware support
- Industry standard for Node.js APIs

**Where Used**: `src/app.js`, all route files

---

#### 2. **mongoose** (^9.2.1)
```javascript
const mongoose = require('mongoose');
```

**Purpose**: MongoDB Object Data Modeling (ODM)  
**Why We Use It**:
- Provides schema-based data modeling
- Built-in validation
- Query building
- Middleware (hooks) for business logic
- Type casting

**Where Used**: `src/config/db.js`, all model files

**Alternative Considered**: Native MongoDB driver (rejected because Mongoose provides better structure)

---

#### 3. **jsonwebtoken** (^9.0.3)
```javascript
const jwt = require('jsonwebtoken');
```

**Purpose**: Generate and verify JWT tokens  
**Why We Use It**:
- Stateless authentication (no server-side session storage)
- Contains user information in token
- Secure and industry-standard
- Easy to implement across platforms

**Where Used**: 
- `src/controllers/auth.controller.js` (token generation)
- `src/middlewares/auth.middleware.js` (token verification)

**How It Works**:
```
Login → Generate Token → Client Stores Token → 
Client Sends Token → Server Verifies → Access Granted
```

---

#### 4. **bcrypt** (^6.0.0)
```javascript
const bcrypt = require('bcrypt');
```

**Purpose**: Password hashing library  
**Why We Use It**:
- Industry-standard password security
- One-way encryption (cannot be reversed)
- Salt rounds prevent rainbow table attacks
- Built-in comparison method

**Where Used**: `src/models/user.model.js`

**Security Level**: 10 salt rounds (recommended for production)

**Alternative Considered**: bcryptjs (rejected because native bcrypt is faster)

---

#### 5. **dotenv** (^17.3.1)
```javascript
require('dotenv').config();
```

**Purpose**: Load environment variables from `.env` file  
**Why We Use It**:
- Keep secrets out of source code
- Easy environment-specific configuration
- Industry best practice
- Prevents accidental secret commits

**Where Used**: `src/server.js` (entry point)

**What It Loads**:
- Database connection strings
- Secret keys
- Port numbers
- Environment-specific settings

---

#### 6. **cors** (^2.8.6)
```javascript
const cors = require('cors');
```

**Purpose**: Enable Cross-Origin Resource Sharing  
**Why We Use It**:
- Allows frontend apps from different domains to access API
- Configurable security settings
- Prevents CORS errors in browsers

**Where Used**: `src/app.js`

**Note**: In production, configure to only allow specific origins

---

#### 7. **morgan** (^1.10.1)
```javascript
const morgan = require('morgan');
```

**Purpose**: HTTP request logger  
**Why We Use It**:
- Log all API requests
- Helpful for debugging
- Monitor API usage
- Track errors and performance

**Where Used**: `src/app.js`

**Format**: 'dev' (colored output for development)

---

### Development Dependencies

#### 8. **nodemon** (^3.1.11)

**Purpose**: Auto-restart server on file changes  
**Why We Use It**:
- Improves development speed
- No manual server restarts
- Watches for file changes automatically

**Where Used**: `package.json` scripts (`npm run dev`)

**Not Used In Production**: Production uses `node` directly

---

## 5. File-by-File Breakdown

### 📄 `src/server.js` - Application Entry Point

```javascript
require('dotenv').config();           // 1. Load environment variables
const app = require('./app');        // 2. Import Express app
const connectDB = require('./config/db'); // 3. Import DB connection

const PORT = process.env.PORT || 5000;

connectDB();                          // 4. Connect to MongoDB

app.listen(PORT, () => {              // 5. Start server
    console.log(`Server running on port ${PORT}`);
});
```

**Purpose**: Bootstrap the application  
**Responsibilities**:
1. Load environment configuration
2. Connect to database
3. Start HTTP server
4. Display startup message

**Why Separate from app.js**: Allows testing app without starting server

---

### 📄 `src/app.js` - Express Application Configuration

```javascript
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(express.json());              // Parse JSON bodies
app.use(cors());                      // Enable CORS
app.use(morgan('dev'));               // Log requests

// Routes
app.use('/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/products', require('./routes/product.routes'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

module.exports = app;
```

**Purpose**: Configure Express application  
**Responsibilities**:
1. Initialize middleware
2. Mount route handlers
3. Export configured app

**Why This Design**: 
- Separation from server startup
- Can be imported for testing
- Clean middleware stack

---

### 📄 `src/config/db.js` - Database Connection

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);      // Exit if DB connection fails
    }
};

module.exports = connectDB;
```

**Purpose**: Establish MongoDB connection  
**Why Async**: Database connection is asynchronous  
**Error Handling**: Exit process if connection fails (prevents running without DB)

**Connection Options Not Needed**: Mongoose 6+ uses optimal defaults

---

### 📄 `src/models/user.model.js` - User Data Model

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false              // Don't return password in queries
    },
    role: {
        type: String,
        enum: ['user', 'manager', 'admin'],
        default: 'user'
    }
}, {
    timestamps: true               // Auto-add createdAt, updatedAt
});

// Pre-save middleware: Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();                    // Skip if password not changed
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Instance method: Compare entered password with hashed password
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

**Key Features**:
1. **Schema Validation**: Email format, required fields
2. **Pre-save Hook**: Automatically hash passwords
3. **Instance Methods**: Custom password comparison
4. **Security**: Password field excluded by default
5. **Timestamps**: Auto-track creation/update times

**Why Middleware**: Prevents duplicate password hashing logic

---

### 📄 `src/models/product.model.js` - Product Data Model

```javascript
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a product name'],
        trim: true                 // Remove whitespace
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',               // Reference to User model
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
```

**Key Features**:
1. **Data Validation**: Required fields
2. **Data Transformation**: Trim whitespace from names
3. **Referential Integrity**: Links to User who created it
4. **Timestamps**: Track creation/update times

**Why Reference User**: Track who created products for audit purposes

---

### 📄 `src/middlewares/auth.middleware.js` - Authentication

```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const protect = async (req, res, next) => {
    let token;

    // 1. Check if authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')) {
        try {
            // 2. Extract token from header
            token = req.headers.authorization.split(' ')[1];

            // 3. Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 4. Get user from database (excluding password)
            req.user = await User.findById(decoded.id).select('-password');

            next();                // Allow request to continue
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };
```

**Purpose**: Verify JWT tokens and authenticate users  
**Flow**:
1. Extract token from Authorization header
2. Verify token signature
3. Decode user ID from token
4. Fetch user from database
5. Attach user to request object
6. Allow request to proceed

**Why Attach User**: Subsequent middleware/controllers need user info

---

### 📄 `src/middlewares/rbac.middleware.js` - Authorization

```javascript
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
};

module.exports = { authorize };
```

**Purpose**: Check if user's role has permission  
**Design Pattern**: Higher-order function (returns middleware)

**Usage Example**:
```javascript
router.post('/', protect, authorize('admin', 'manager'), createProduct);
```

**Why This Design**: Flexible, reusable, easy to read

---

### 📄 `src/controllers/auth.controller.js` - Authentication Logic

```javascript
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

// Helper: Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

// Register new user
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // 1. Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // 2. Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // 3. Create user (password auto-hashed by model)
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'user'
        });

        // 4. Send response
        if (user) {
            res.status(201).json({
                message: 'User registered successfully',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Please add email and password' });
        }

        // 2. Find user and include password field
        const user = await User.findOne({ email }).select('+password');

        // 3. Check user exists and password matches
        if (user && (await user.matchPassword(password))) {
            res.status(200).json({
                message: 'Login successful',
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { registerUser, loginUser };
```

**Key Concepts**:
1. **Input Validation**: Check required fields
2. **Duplicate Prevention**: Check if email exists
3. **Token Generation**: Create JWT on successful login
4. **Error Handling**: Try-catch for database errors
5. **Security**: Use model method for password comparison

---

### 📄 `src/routes/*.js` - Route Definitions

**Example: `src/routes/product.routes.js`**

```javascript
const express = require('express');
const router = express.Router();
const { createProduct, deleteProduct } = require('../controllers/product.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');

// Middleware chain: auth → authorization → controller
router.get('/', getAllProducts); // Public route
router.post('/', protect, authorize('admin', 'manager'), createProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;
```

**Purpose**: Define API endpoints and middleware chains  
**Pattern**: Middleware composition

**Execution Order**: `protect` → `authorize` → `controller`

---

## 6. Request Flow & Data Flow

### Complete Request Flow Diagram

```
┌───────────────────────────────────────────────────────────────┐
│                    1. Client Request                          │
│         POST /api/products + Authorization Header             │
└───────────────────────┬───────────────────────────────────────┘
                        │
┌───────────────────────▼───────────────────────────────────────┐
│                  2. Express Middleware Stack                  │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ express.json() → Parse request body                     │  │
│  │ cors() → Handle cross-origin requests                   │  │
│  │ morgan() → Log request                                  │  │
│  └─────────────────────────────────────────────────────────┘  │
└───────────────────────┬───────────────────────────────────────┘
                        │
┌───────────────────────▼───────────────────────────────────────┐
│                    3. Route Matching                          │
│         app.use('/api/products', productRoutes)               │
└───────────────────────┬───────────────────────────────────────┘
                        │
┌───────────────────────▼───────────────────────────────────────┐
│                  4. Auth Middleware                           │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ 1. Extract token from header                            │  │
│  │ 2. Verify token with JWT_SECRET                         │  │
│  │ 3. Decode user ID                                       │  │
│  │ 4. Fetch user from database                             │  │
│  │ 5. Attach user to req.user                              │  │
│  └─────────────────────────────────────────────────────────┘  │
└───────────────────────┬───────────────────────────────────────┘
                        │
┌───────────────────────▼───────────────────────────────────────┐
│                  5. RBAC Middleware                           │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Check if req.user.role in ['admin', 'manager']         │  │
│  │ If NO → 403 Forbidden                                   │  │
│  │ If YES → Continue                                       │  │
│  └─────────────────────────────────────────────────────────┘  │
└───────────────────────┬───────────────────────────────────────┘
                        │
┌───────────────────────▼───────────────────────────────────────┐
│                    6. Controller                              │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ createProduct(req, res)                                 │  │
│  │ 1. Extract name, price from req.body                    │  │
│  │ 2. Validate input                                       │  │
│  │ 3. Create product with createdBy = req.user.id         │  │
│  │ 4. Save to database                                     │  │
│  └─────────────────────────────────────────────────────────┘  │
└───────────────────────┬───────────────────────────────────────┘
                        │
┌───────────────────────▼───────────────────────────────────────┐
│                    7. Database                                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Mongoose validates schema                               │  │
│  │ MongoDB saves document                                  │  │
│  │ Returns created product                                 │  │
│  └─────────────────────────────────────────────────────────┘  │
└───────────────────────┬───────────────────────────────────────┘
                        │
┌───────────────────────▼───────────────────────────────────────┐
│                    8. Response                                │
│         201 Created + Product JSON                            │
└───────────────────────────────────────────────────────────────┘
```

---

## 7. Security Implementation

### Security Layers

```
┌──────────────────────────────────────────────┐
│           Layer 1: Input Validation          │
│  - Required field checks                     │
│  - Email format validation                   │
│  - Data type validation                      │
└──────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────┐
│        Layer 2: Password Security            │
│  - bcrypt hashing (10 salt rounds)           │
│  - One-way encryption                        │
│  - Password field excluded from queries      │
└──────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────┐
│         Layer 3: Authentication              │
│  - JWT token verification                    │
│  - Token expiration (1 hour)                 │
│  - Secret key signing                        │
└──────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────┐
│         Layer 4: Authorization               │
│  - Role-based access control                 │
│  - Route-specific permissions                │
│  - User role validation                      │
└──────────────────────────────────────────────┘
```

### Security Best Practices Implemented

1. **Passwords**: Never stored in plain text, hashed with bcrypt
2. **Tokens**: Expire after 1 hour, signed with secret key
3. **Environment Variables**: Secrets stored in `.env`, not in code
4. **Input Validation**: All inputs validated before processing
5. **Error Messages**: Generic messages to prevent information leakage
6. **HTTPS Ready**: Use reverse proxy (nginx) in production

---

## 8. Database Design

### MongoDB Collections

#### **Users Collection**

```javascript
{
  _id: ObjectId("65f1a2b3c4d5e6f7g8h9i0j1"),
  name: "John Doe",
  email: "john@example.com",
  password: "$2b$10$hashed_password_here",  // bcrypt hash
  role: "user",                              // user | manager | admin
  createdAt: ISODate("2024-03-13T10:30:00Z"),
  updatedAt: ISODate("2024-03-13T10:30:00Z")
}
```

**Indexes**:
- `email`: Unique index (for fast lookup and duplicate prevention)

#### **Products Collection**

```javascript
{
  _id: ObjectId("65f1a2b3c4d5e6f7g8h9i0j2"),
  name: "Gaming Laptop",
  price: 1500,
  createdBy: ObjectId("65f1a2b3c4d5e6f7g8h9i0j1"),  // Reference to User
  createdAt: ISODate("2024-03-13T11:00:00Z"),
  updatedAt: ISODate("2024-03-13T11:00:00Z")
}
```

**Relationships**:
- `createdBy` → References `Users._id`

### Why MongoDB?

1. **Flexible Schema**: Easy to add fields without migrations
2. **JSON-like Documents**: Natural fit for JavaScript/Node.js
3. **Scalability**: Horizontal scaling with sharding
4. **Developer Friendly**: Quick prototyping and development

---

## 9. API Response Patterns

### Success Response Format

```json
{
  "message": "Human-readable success message",
  "data": { ... }
}
```

### Error Response Format

```json
{
  "message": "Human-readable error message"
}
```

### HTTP Status Codes Used

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET/DELETE |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Invalid input/missing fields |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Valid token but insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate email |
| 500 | Internal Server Error | Unexpected server error |

---

## 10. Testing Strategy (Recommended)

### Unit Testing (Recommended Tools)

```bash
npm install --save-dev jest supertest
```

**What to Test**:
- Model validation
- Password hashing
- JWT generation/verification
- Controller logic
- Middleware functions

### Integration Testing

**What to Test**:
- Complete API endpoints
- Authentication flow
- Authorization checks
- Database operations

### Manual Testing

**Tools**: Postman, Insomnia, or curl

**Test Cases**:
1. Register user with valid/invalid data
2. Login with correct/incorrect credentials
3. Access protected routes with/without token
4. Test RBAC with different roles
5. Create/delete products

---

## 11. Deployment Considerations

### Environment Setup

**Production `.env`**:
```env
PORT=5000
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/production_db
JWT_SECRET=very_long_random_string_here_use_crypto.randomBytes(64).toString('hex')
JWT_EXPIRES_IN=1h
NODE_ENV=production
```

### Production Checklist

- [ ] Change JWT_SECRET to strong random string
- [ ] Use MongoDB Atlas or managed database
- [ ] Enable CORS only for specific origins
- [ ] Use HTTPS (SSL/TLS)
- [ ] Set up environment-specific logging
- [ ] Implement rate limiting
- [ ] Add request validation middleware
- [ ] Set up monitoring (e.g., PM2, New Relic)
- [ ] Configure reverse proxy (nginx)
- [ ] Set up CI/CD pipeline

---

## 12. Future Enhancements

### Potential Features

1. **Refresh Tokens**: Extend session without re-login
2. **Email Verification**: Verify email on registration
3. **Password Reset**: Forgot password flow
4. **Rate Limiting**: Prevent abuse
5. **API Documentation**: Swagger/OpenAPI
6. **Pagination**: For large data sets
7. **File Upload**: Product images
8. **Audit Logs**: Track user actions
9. **WebSockets**: Real-time notifications

---

## 📚 Additional Resources

### Official Documentation

- [Express.js](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/)
- [bcrypt](https://www.npmjs.com/package/bcrypt)

### Related Topics

- REST API Design
- JWT Authentication
- MongoDB Schema Design
- Node.js Best Practices

---

**Document Version**: 1.0  
**Last Updated**: 2026-02-15  
**Maintained By**: Mini-backend Project

---

