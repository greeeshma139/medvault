# MedVault - Complete Project Structure

## 📊 Project Overview

This document provides a comprehensive overview of all files created in the MedVault project, including their purposes and relationships.

---

## 🏗️ Directory Structure

```
infosysmedvault/
│
├── 📄 README.md                          # Main project documentation
├── 📄 SETUP_GUIDE.md                     # Detailed setup instructions
├── 📄 QUICKSTART.md                      # 5-minute quick start guide
├── 📄 PROJECT_COMPLETION.md              # Milestone 1 completion summary
├── 📄 PROJECT_STRUCTURE.md               # This file
│
├── 📁 backend/                           # Backend server application
│   │
│   ├── 📁 config/                        # Configuration utilities
│   │   ├── database.js                   # MongoDB connection setup
│   │   └── mail.js                       # Email service configuration
│   │
│   ├── 📁 controllers/                   # Business logic handlers
│   │   ├── userController.js             # User registration, login, auth
│   │   ├── patientController.js          # Patient profile management
│   │   └── professionalController.js     # Professional profile management
│   │
│   ├── 📁 middleware/                    # Express middleware
│   │   └── authMiddleware.js             # JWT authentication validation
│   │
│   ├── 📁 models/                        # MongoDB schemas
│   │   ├── User.js                       # User authentication model
│   │   ├── Patient.js                    # Patient health information
│   │   ├── Professional.js               # Healthcare professional profile
│   │   └── MedicalRecord.js              # Medical records storage
│   │
│   ├── 📁 routes/                        # API route definitions
│   │   ├── userRoutes.js                 # User auth endpoints
│   │   ├── patientRoutes.js              # Patient profile endpoints
│   │   └── professionalRoutes.js         # Professional endpoints
│   │
│   ├── .env.example                      # Environment variables template
│   ├── .env                              # Environment variables (create this)
│   ├── .gitignore                        # Git ignore rules
│   ├── package.json                      # Node dependencies
│   └── server.js                         # Express server entry point
│
└── 📁 frontend/                          # React frontend application
    │
    ├── 📁 public/                        # Static files
    │   └── index.html                    # HTML entry point
    │
    ├── 📁 src/                           # Source code
    │   │
    │   ├── 📁 components/                # Reusable React components
    │   │   └── ProtectedRoute.js         # Route protection wrapper
    │   │
    │   ├── 📁 context/                   # React context providers
    │   │   └── AuthContext.js            # Authentication state management
    │   │
    │   ├── 📁 pages/                     # Page components
    │   │   ├── Home.js                   # Landing page
    │   │   ├── Login.js                  # User login page
    │   │   ├── Signup.js                 # User registration page
    │   │   ├── VerifyEmail.js            # Email verification page
    │   │   ├── PatientDashboard.js       # Patient dashboard
    │   │   └── ProfessionalDashboard.js  # Professional dashboard
    │   │
    │   ├── 📁 services/                  # API services
    │   │   └── api.js                    # Axios API client setup
    │   │
    │   ├── 📁 styles/                    # CSS stylesheets
    │   │   ├── auth.css                  # Authentication pages styling
    │   │   ├── dashboard.css             # Dashboard pages styling
    │   │   ├── home.css                  # Home page styling
    │   │   └── index.css                 # Global styles
    │   │
    │   ├── App.js                        # Main React application
    │   └── index.js                      # React entry point
    │
    ├── .env.example                      # Environment variables template
    ├── .env                              # Environment variables (create this)
    ├── .gitignore                        # Git ignore rules
    └── package.json                      # React dependencies
```

---

## 📄 File Descriptions

### Root Level Files

| File | Purpose |
|------|---------|
| README.md | Comprehensive project documentation |
| SETUP_GUIDE.md | Step-by-step setup instructions |
| QUICKSTART.md | 5-minute quick start guide |
| PROJECT_COMPLETION.md | Milestone 1 completion details |
| PROJECT_STRUCTURE.md | This file - structure overview |

---

### Backend Files

#### Config Directory (`backend/config/`)

**database.js**
- MongoDB connection implementation
- Mongoose connection settings
- Error handling for database connection
- Exports: connectDB function

**mail.js**
- Nodemailer SMTP configuration
- Email sending utility functions
- Yop Mail verification integration
- Exports: sendVerificationEmail, sendYopMailVerification

#### Controllers Directory (`backend/controllers/`)

**userController.js**
- User registration logic
- User login logic
- Email verification handling
- Current user retrieval
- Profile update functionality
- JWT token generation
- Password comparison utilities

**patientController.js**
- Fetch patient profile
- Update patient health information
- Add preferred doctors
- Patient profile creation
- Health data management

**professionalController.js**
- Fetch professional profile
- Update professional credentials
- Get all professionals (with filtering)
- Get professional by ID
- Professional profile updates

#### Middleware Directory (`backend/middleware/`)

**authMiddleware.js**
- JWT token verification
- Request user attachment
- Protected route enforcement
- Token validation and error handling

#### Models Directory (`backend/models/`)

**User.js (Mongoose Schema)**
- Authentication fields (email, password)
- Profile fields (firstName, lastName)
- Role-based access (patient/professional)
- Email verification tracking
- Status management
- Password hashing middleware
- Password comparison method
- Full name getter method

**Patient.js (Mongoose Schema)**
- User reference
- Personal health data (DOB, gender)
- Address information
- Blood type and allergies
- Medical history
- Emergency contact
- Insurance information
- Preferred doctors list

**Professional.js (Mongoose Schema)**
- User reference
- Medical credentials
- Specialization and experience
- License and registration
- Clinic information
- Consultation configuration
- Availability schedule
- Verification status
- Rating system
- Patient count tracking

**MedicalRecord.js (Mongoose Schema)**
- Patient and doctor references
- Record type categorization
- Medical details (diagnosis, treatment)
- Medication tracking
- Document attachments
- Access control and logging
- Sharing permissions

#### Routes Directory (`backend/routes/`)

**userRoutes.js**
- POST /register - User registration
- POST /login - User authentication
- GET /verify-email/:token - Email verification
- GET /me - Get current user (protected)
- PUT /profile - Update profile (protected)

**patientRoutes.js**
- GET /profile - Get patient profile (protected)
- PUT /profile - Update patient profile (protected)
- POST /add-preferred-doctor - Add doctor preference (protected)

**professionalRoutes.js**
- GET / - Get all professionals
- GET /:id - Get professional by ID
- GET /profile - Get current professional (protected)
- PUT /profile - Update professional profile (protected)

#### Backend Root Files

**server.js**
- Express app initialization
- Middleware setup (CORS, JSON parsing)
- MongoDB connection
- Route mounting
- Health check endpoint
- Error handling middleware
- Server startup and listening

**.env (create from .env.example)**
- MONGODB_URI - Database connection string
- JWT_SECRET - Token signing secret
- PORT - Server port number
- NODE_ENV - Environment mode
- Email service credentials

**.env.example**
- Template for .env configuration
- Safe version without sensitive data

**package.json**
- Project metadata
- Dependencies list
- Dev dependencies
- npm scripts (start, dev)

**.gitignore**
- Node modules exclusion
- Environment variables exclusion
- Build directory exclusion
- Log files exclusion

---

### Frontend Files

#### Public Directory (`frontend/public/`)

**index.html**
- HTML document structure
- Meta tags and viewport configuration
- Root div for React mounting
- Title and description

#### Components Directory (`frontend/src/components/`)

**ProtectedRoute.js**
- Higher-order component for route protection
- Checks authentication status
- Checks user role requirements
- Redirects unauthorized users
- Loading state handling

#### Context Directory (`frontend/src/context/`)

**AuthContext.js**
- React Context for authentication
- Provider component setup
- Auth state management (user, token, loading)
- Login function
- Register function
- Logout function
- Update profile function
- Current user fetching
- useAuth custom hook

#### Pages Directory (`frontend/src/pages/`)

**Home.js**
- Landing page component
- Feature showcase
- Navigation bar
- Call-to-action buttons
- Responsive layout
- Conditional authentication links

**Login.js**
- Email and password form
- Form validation
- Login submission handling
- Error messages with toast
- Loading state
- Links to signup and password recovery

**Signup.js**
- Multi-field registration form
- First name, last name fields
- Email and phone inputs
- Password confirmation
- Account type selection
- Form validation
- Error handling
- Yop Mail integration note
- Automatic profile creation

**VerifyEmail.js**
- Email verification form
- Token-based verification
- Automatic verification with URL token
- Verification status display
- Success/failure messaging
- Redirect handling

**PatientDashboard.js**
- Patient welcome section
- Profile information display
- Health information section
- Edit profile form
- Address management
- Health data updates
- Quick action buttons
- Navigation menu
- Responsive layout

**ProfessionalDashboard.js**
- Professional welcome section
- Credentials display
- Professional profile management
- Edit professional profile form
- Clinic information
- Availability schedule
- Quick action buttons
- Navigation menu
- Responsive design

#### Services Directory (`frontend/src/services/`)

**api.js**
- Axios instance creation
- API base URL configuration
- Request interceptor (token attachment)
- User API functions
- Patient API functions
- Professional API functions
- Error handling setup

#### Styles Directory (`frontend/src/styles/`)

**auth.css**
- Authentication pages styling
- Form component styles
- Button styling
- Input field styling
- Loading animation
- Toast notification styles
- Responsive breakpoints
- Color scheme and gradients

**dashboard.css**
- Dashboard layout styling
- Sidebar styling
- Navigation bar styling
- Card component styling
- Form styling
- Button styling
- Grid layout
- Responsive design
- Hover effects

**home.css**
- Landing page styling
- Hero section styling
- Feature cards styling
- Navigation styling
- Button styling
- Animation effects
- Responsive breakpoints

**index.css**
- Global CSS reset
- Base element styling
- Scrollbar styling
- Font configuration
- Default spacing
- Toast override styles

#### Root Frontend Files

**App.js**
- Main React component
- Route definitions
- Provider setup (AuthProvider)
- Protected route wrapping
- Navigation routing
- Component imports

**index.js**
- React DOM rendering
- Root element mounting
- StrictMode wrapping
- CSS imports

**.env (create from .env.example)**
- REACT_APP_API_URL - Backend API URL

**.env.example**
- Template for environment variables

**package.json**
- React dependencies
- Router setup
- HTTP client (axios)
- Toast notification library
- Icon library
- npm scripts

**.gitignore**
- Node modules exclusion
- Environment files exclusion
- Build output exclusion
- Log and cache files

---

## 🔗 File Relationships

### Authentication Flow
1. **Signup.js** → calls `userAPI.register()` → **userController.register()**
2. Token stored in localStorage
3. **AuthContext.js** manages global auth state
4. **ProtectedRoute.js** checks authentication
5. Route redirects to dashboard based on role

### Data Flow (Patient)
1. **PatientDashboard.js** → fetches via `patientAPI.getProfile()`
2. **api.js** creates axios request with token
3. Hits `patientRoutes.js` → `patientController.getPatientProfile()`
4. Queries **Patient.js** model via Mongoose
5. Data returned and displayed in UI

### Database Relationships
- **User.js** ← referenced by **Patient.js** (userId)
- **User.js** ← referenced by **Professional.js** (userId)
- **Patient.js** ← referenced by **MedicalRecord.js** (patientId)
- **Professional.js** ← referenced by **MedicalRecord.js** (doctorId)
- **Professional.js** ← referenced by **Patient.js** (preferredDoctors[])

---

## 💾 Configuration Files

### Backend Configuration
- **.env** - Runtime environment variables
- **package.json** - Dependencies and scripts
- **mongoose** - Database ORM settings
- **express** - Server configuration

### Frontend Configuration
- **.env** - API URL configuration
- **package.json** - React and dependencies
- **App.js** - Route configuration
- **AuthContext.js** - Global auth setup

---

## 🚀 Deployment Files

All necessary files for deployment:

### Backend Deployment
- ✅ server.js - Entry point
- ✅ package.json - Dependencies
- ✅ config files - Database and email setup
- ✅ models, routes, controllers - Complete API
- ✅ .gitignore - Safe deployment

### Frontend Deployment
- ✅ public/index.html - HTML entry
- ✅ src/App.js - Route setup
- ✅ package.json - Build configuration
- ✅ All components and pages
- ✅ API integration ready

---

## 📊 Statistics

| Category | Count |
|----------|-------|
| Backend Files | 15 |
| Frontend Files | 15 |
| Configuration Files | 6 |
| Documentation Files | 5 |
| **Total Files** | **41** |

| Type | Count |
|------|-------|
| Models | 4 |
| Controllers | 3 |
| Routes | 3 |
| Pages | 6 |
| Components | 1 |
| Services | 1 |
| CSS Stylesheets | 4 |

---

## ✅ Complete Features

### Authentication
- ✅ User registration
- ✅ User login
- ✅ Password hashing
- ✅ JWT tokens
- ✅ Email verification
- ✅ Protected routes
- ✅ Session management

### User Management
- ✅ Patient profiles
- ✅ Professional profiles
- ✅ Profile updates
- ✅ Role-based access
- ✅ Health information
- ✅ Credentials management

### Frontend
- ✅ Responsive design
- ✅ Form validation
- ✅ Error handling
- ✅ Loading states
- ✅ Notifications
- ✅ Navigation
- ✅ Styling

### Backend
- ✅ RESTful API
- ✅ Database models
- ✅ Authentication middleware
- ✅ Error handling
- ✅ Data validation
- ✅ Security

---

## 🔄 Build and Run Commands

### Backend
```bash
cd backend
npm install
npm start          # Production
npm run dev        # Development with nodemon
```

### Frontend
```bash
cd frontend
npm install
npm start          # Development
npm run build      # Production build
```

---

## 📝 Notes

1. All files are created and ready to use
2. Copy `.env.example` to `.env` before running
3. Install dependencies with `npm install`
4. Ensure MongoDB is running
5. Start backend first, then frontend
6. API will be available at http://localhost:5000
7. Frontend at http://localhost:3000

---

## 🎯 Next Phase

All files for Milestone 2 (Appointment Booking) can be added in the same structure:

```
backend/
├── controllers/appointmentController.js
├── models/Appointment.js
└── routes/appointmentRoutes.js

frontend/
├── pages/BookAppointment.js
├── pages/AppointmentsList.js
└── components/AppointmentCard.js
```

---

**Project Structure: Complete and Ready for Deployment**

For detailed information, refer to:
- README.md - Project overview
- SETUP_GUIDE.md - Installation steps
- QUICKSTART.md - Quick start guide
