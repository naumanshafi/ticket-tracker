# 🎯 Ticket Tracker - Full Stack Project Management Application

<div align="center">

![React](https://img.shields.io/badge/React-16.12.0-blue?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-green?logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?logo=postgresql)
![Python](https://img.shields.io/badge/Python-3.8+-yellow?logo=python)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?logo=javascript)

**A modern, full-featured ticket tracking and project management application**

[🚀 Features](#-features) • [⚡ Quick Start](#-quick-start) • [🛠️ Setup](#️-detailed-setup) • [🏗️ Architecture](#️-architecture) • [📚 API Documentation](#-api-documentation)

</div>

---

## 🌟 What is this?

This is a comprehensive ticket tracking system built with modern technologies, featuring a **React frontend** and **FastAPI backend**. It demonstrates real-world application architecture with proper authentication, role-based access control, and a professional user interface.

### 🎯 Perfect for:
- **Learning full-stack development** with React and FastAPI
- **Understanding project management workflows**
- **Studying modern authentication patterns** (JWT + Google OAuth)
- **Exploring role-based access control** systems
- **Building portfolio projects** with production-ready code

## 🚀 Features

### 👥 **User Management & Authentication**
- 🔐 **JWT-based authentication** with secure token management
- 🌐 **Google OAuth integration** for seamless login
- 👑 **Role-based access control** (Admin/User roles)
- 🛡️ **Protected routes** and API endpoints
- 🚪 **Professional login/logout** with confirmation modals

### 📊 **Project Management**
- 📁 **Multi-project support** with project-specific access
- 🎯 **Kanban board** with drag-and-drop functionality
- 📝 **Issue tracking** with detailed issue management
- 👥 **Team member management** per project
- 🏷️ **Issue types, priorities, and statuses**
- ⏱️ **Time tracking and estimation**

### 🎨 **Modern UI/UX**
- 📱 **Responsive design** that works on all devices
- 🎭 **Professional interface** with consistent styling
- ✨ **Smooth animations** and transitions
- 🎨 **Custom components** (modals, forms, dropdowns)
- 🌈 **Beautiful gradients** and modern design patterns

### 🔧 **Admin Features**
- 👥 **User management** (create, update, delete users)
- 📊 **Project oversight** (view and manage all projects)
- 🏗️ **Project creation** with category management
- 🗑️ **Safe deletion** with confirmation modals
- 📈 **Admin dashboard** with comprehensive controls

### 🎯 **Issue Management**
- 📝 **Rich text editor** for issue descriptions
- 👤 **Separate reporter and assignee** functionality
- 💬 **Comments system** (ready for implementation)
- 🏷️ **Custom fields** (estimate, time tracking, priority)
- 🔄 **Real-time updates** and optimistic UI

## ⚡ Quick Start

### Prerequisites
- **Node.js** (v14+ recommended)
- **Python** (v3.8+ required)
- **PostgreSQL** (v12+ recommended)
- **Git**


## 🛠️ Setup Instructions

### 1. 📥 Clone Repository
```bash
git clone https://github.com/naumanshafi/tooling-ticket-tracker.git
cd tooling-ticket-tracker
```

### 2. 🗄️ Database Setup
```bash
# Install PostgreSQL (if not already installed)
# macOS
brew install postgresql
brew services start postgresql

# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# Create database
psql -U postgres -c "CREATE DATABASE ticket_tracker_dev;"
```

### 3. 🐍 Backend Setup (FastAPI)
```bash
cd api

# Create virtual environment
python -m venv venv

# Activate virtual environment
# macOS/Linux
source venv/bin/activate
# Windows
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
# Edit .env with your database credentials
```

#### 📝 Environment Variables (.env)
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=ticket_tracker_dev
DB_USERNAME=postgres
DB_PASSWORD=your_password_here

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key-here
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Application Settings
DEBUG=True
CORS_ORIGINS=["http://localhost:3000"]
```

#### 🚀 Start Backend Server
```bash
# Development server with auto-reload
python main.py

# Or using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 5000
```

### 4. ⚛️ Frontend Setup (React)
```bash
# Open new terminal
cd client

# Install dependencies
npm install

# Start development server
npm start
```

The application will open at **http://localhost:3000**

---

## 🏗️ Architecture

### 📁 Project Structure
```
tooling-ticket-tracker/
├── 📂 api/                          # FastAPI Backend
│   ├── 📄 main.py                   # Main application file
│   ├── 📄 requirements.txt          # Python dependencies
│   ├── 📄 .env.example             # Environment template
│   └── 📂 venv/                    # Virtual environment
│
├── 📂 client/                       # React Frontend
│   ├── 📂 src/
│   │   ├── 📂 Admin/               # Admin panel components
│   │   │   ├── 📂 Users/           # User management
│   │   │   ├── 📂 Projects/        # Project management
│   │   │   └── 📂 Sidebar/         # Admin navigation
│   │   ├── 📂 Auth/                # Authentication components
│   │   ├── 📂 Project/             # Project workspace
│   │   │   ├── 📂 Board/           # Kanban board
│   │   │   ├── 📂 Members/         # Team management
│   │   │   └── 📂 Sidebar/         # Project navigation
│   │   └── 📂 shared/              # Reusable components
│   │       ├── 📂 components/      # UI components
│   │       ├── 📂 hooks/           # Custom React hooks
│   │       └── 📂 utils/           # Utility functions
│   ├── 📄 package.json             # Node.js dependencies
│   └── 📄 webpack.config.js        # Build configuration
│
└── 📄 README.md                    # This file
```

### 🔧 Technology Stack

#### **Backend (FastAPI)**
- **🐍 FastAPI** - Modern, fast web framework for Python
- **🗄️ PostgreSQL** - Robust relational database
- **🔐 JWT Authentication** - Secure token-based auth
- **📊 Pydantic** - Data validation and serialization
- **🔄 SQLAlchemy** - Database ORM (raw SQL queries)
- **🌐 CORS** - Cross-origin resource sharing
- **🔒 Dependency Injection** - Secure route protection

#### **Frontend (React)**
- **⚛️ React 16.12** - Modern functional components with hooks
- **🎨 Styled Components** - CSS-in-JS styling
- **🛣️ React Router** - Client-side routing
- **📝 Formik** - Form handling and validation
- **🎯 Axios** - HTTP client for API calls
- **🎭 React Beautiful DnD** - Drag and drop functionality
- **🔧 Webpack** - Custom build configuration
- **🎨 Custom UI Components** - Professional component library

---

## 🗄️ Database Schema

The application uses **PostgreSQL** with the following table structure:

### **📊 Complete Database Tables**

#### **👥 Users Table**
```sql
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    "avatarUrl" VARCHAR(500),
    google_id VARCHAR(255),
    password VARCHAR(255),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);
```

**Purpose:** Stores all user information including authentication data and profile details.

**Key Fields:**
- `role`: Either 'admin' or 'user' for global permissions
- `google_id`: For Google OAuth authentication
- `avatarUrl`: Profile picture URL (Google or generated)

#### **📁 Projects Table**
```sql
CREATE TABLE project (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) DEFAULT 'software',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose:** Stores project information and metadata.

**Categories:** software, marketing, business, design, research, product

#### **🎫 Issues Table**
```sql
CREATE TABLE issue (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    type VARCHAR(50) DEFAULT 'task',
    status VARCHAR(50) DEFAULT 'backlog',
    priority VARCHAR(10) DEFAULT '3',
    "listPosition" NUMERIC,
    description TEXT,
    "descriptionText" TEXT,
    estimate INTEGER,
    "timeSpent" INTEGER DEFAULT 0,
    "timeRemaining" INTEGER,
    "reporterId" INTEGER REFERENCES "user"(id),
    "projectId" INTEGER REFERENCES project(id),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose:** Core ticket/issue tracking with full lifecycle management.

**Issue Types:** task, story, bug, epic  
**Statuses:** backlog, selected, in-progress, done  
**Priorities:** 1 (highest), 2 (high), 3 (medium), 4 (low), 5 (lowest)

#### **👥 User-Project Relationships**
```sql
CREATE TABLE user_project (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "user"(id) ON DELETE CASCADE,
    project_id INTEGER REFERENCES project(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'user',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, project_id)
);
```

**Purpose:** Many-to-many relationship between users and projects with project-specific roles.

#### **🎯 Issue Assignees**
```sql
CREATE TABLE issue_user (
    id SERIAL PRIMARY KEY,
    issue_id INTEGER REFERENCES issue(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES "user"(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(issue_id, user_id)
);
```

**Purpose:** Many-to-many relationship for issue assignments (separate from reporter).

#### **🔐 Sessions Table**
```sql
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "user"(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);
```

**Purpose:** JWT token management and session tracking.

### **🔗 Database Relationships**

```
user (1) ←→ (M) user_project (M) ←→ (1) project
user (1) ←→ (M) issue [as reporter]
user (M) ←→ (M) issue_user ←→ (M) issue [as assignees]
project (1) ←→ (M) issue
user (1) ←→ (M) sessions
```

### **📋 Key Database Features**

- **🔒 Referential Integrity**: Foreign keys with CASCADE deletes
- **⚡ Optimized Queries**: Proper indexing on frequently queried fields
- **🛡️ Data Validation**: Constraints and defaults for data consistency
- **📊 Audit Trail**: Created/updated timestamps on all major tables
- **🔄 Flexible Relationships**: Separate reporter vs assignee concepts
- **🎯 Unique Constraints**: Prevent duplicate relationships

---

## 📚 API Documentation

### 🔐 Authentication Endpoints
```http
POST /auth/login          # Email/password login
POST /auth/google         # Google OAuth login
POST /auth/logout         # Logout user
GET  /currentUser         # Get current user info
```

### 👥 User Management (Admin Only)
```http
GET    /users             # List all users
POST   /users             # Create new user
PUT    /users/{id}        # Update user
DELETE /users/{id}        # Delete user
```

### 📊 Project Management
```http
GET    /projects          # Get user's projects
GET    /admin/projects    # Get all projects (admin)
POST   /projects          # Create project
PUT    /projects/{id}     # Update project
DELETE /projects/{id}     # Delete project (admin)

GET    /projects/{id}/users     # Get project members
POST   /projects/{id}/users     # Add user to project
DELETE /projects/{id}/users/{user_id}  # Remove user from project
```

### 🎯 Issue Management
```http
GET    /issues            # List all issues
GET    /issues/{id}       # Get specific issue
POST   /issues            # Create new issue
PUT    /issues/{id}       # Update issue
DELETE /issues/{id}       # Delete issue
```

---

## 🤝 Contributing

### 🔄 Development Workflow
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### 📋 Code Standards
- **ESLint** for JavaScript linting
- **Prettier** for code formatting
- **Black** for Python code formatting
- **Type hints** for Python functions
- **PropTypes** for React components

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

[🚀 Get Started](#-quick-start) • [📚 Documentation](#-api-documentation) • [🐛 Report Bug](https://github.com/naumanshafi/tooling-ticket-tracker/issues) • [💡 Request Feature](https://github.com/naumanshafi/tooling-ticket-tracker/issues)

Made with ❤️ by [Nauman Shafi](https://github.com/naumanshafi)

</div>
