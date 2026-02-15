# MedVault - API Documentation

## 📚 Complete API Reference for Milestone 1

This document provides detailed documentation for all API endpoints implemented in MedVault.

---

## 🌐 Base URL

```
http://localhost:5000/api
```

## 🔑 Authentication

Most endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📋 API Endpoints

### 1️⃣ USER AUTHENTICATION & MANAGEMENT

#### Register User
```
POST /users/register
```

**Description**: Create a new user account (Patient or Professional)

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@yopmail.com",
  "password": "securePassword123",
  "confirmPassword": "securePassword123",
  "phoneNumber": "+1234567890",
  "role": "patient"  // or "professional"
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "message": "User registered successfully. Please verify your email.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@yopmail.com",
    "role": "patient",
    "isEmailVerified": false
  }
}
```

**Status Codes**:
- `201` - User registered successfully
- `400` - Validation error
- `409` - User already exists

**Notes**:
- Passwords must be at least 6 characters
- Passwords must match
- Email must be unique
- Role must be "patient" or "professional"
- Automatic patient/professional profile created

---

#### Login User
```
POST /users/login
```

**Description**: Authenticate user with email and password

**Request Body**:
```json
{
  "email": "john@yopmail.com",
  "password": "securePassword123"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@yopmail.com",
    "role": "patient",
    "isEmailVerified": false
  }
}
```

**Status Codes**:
- `200` - Login successful
- `401` - Invalid credentials
- `400` - Missing fields

**Notes**:
- Returns JWT token valid for 30 days
- Token must be included in subsequent requests
- User account must be active

---

#### Verify Email
```
GET /users/verify-email/:token
```

**Description**: Verify user email address using token

**URL Parameters**:
- `token` (string, required) - Verification token from email

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

**Status Codes**:
- `200` - Email verified successfully
- `400` - Invalid or expired token
- `500` - Server error

**Notes**:
- Token expires after 24 hours
- Token sent to email during registration
- Can use Yop Mail to test

---

#### Get Current User
```
GET /users/me
```

**Description**: Get authenticated user profile details (Protected Route)

**Headers Required**:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200 OK)**:
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@yopmail.com",
    "phoneNumber": "+1234567890",
    "role": "patient",
    "profilePicture": null,
    "isEmailVerified": true
  },
  "profile": {
    "userId": "user_id",
    "dateOfBirth": "1990-01-15",
    "gender": "male",
    "bloodType": "O+",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    }
  }
}
```

**Status Codes**:
- `200` - User found
- `401` - Unauthorized/No token
- `404` - User not found

---

#### Update User Profile
```
PUT /users/profile
```

**Description**: Update user profile information (Protected Route)

**Headers Required**:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "profilePicture": "https://example.com/photo.jpg"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@yopmail.com",
    "phoneNumber": "+1234567890",
    "role": "patient",
    "profilePicture": "https://example.com/photo.jpg"
  }
}
```

**Status Codes**:
- `200` - Profile updated successfully
- `401` - Unauthorized
- `404` - User not found

**Notes**:
- All fields are optional
- Only provided fields will be updated

---

### 2️⃣ PATIENT MANAGEMENT

#### Get Patient Profile
```
GET /patients/profile
```

**Description**: Get detailed patient health profile (Protected Route - Patient only)

**Headers Required**:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200 OK)**:
```json
{
  "success": true,
  "patient": {
    "_id": "patient_id",
    "userId": {
      "_id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@yopmail.com",
      "phoneNumber": "+1234567890",
      "profilePicture": null
    },
    "dateOfBirth": "1990-01-15",
    "gender": "male",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "bloodType": "O+",
    "allergies": ["Penicillin", "Shellfish"],
    "medicalHistory": ["Diabetes", "Hypertension"],
    "emergencyContact": {
      "name": "Jane Doe",
      "phoneNumber": "+1234567891",
      "relationship": "Spouse"
    },
    "insuranceInfo": {
      "providerName": "Blue Cross",
      "policyNumber": "BC123456",
      "groupNumber": "GRP789"
    },
    "preferredDoctors": [],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Status Codes**:
- `200` - Profile found
- `401` - Unauthorized
- `404` - Patient profile not found

---

#### Update Patient Profile
```
PUT /patients/profile
```

**Description**: Update patient health information (Protected Route - Patient only)

**Headers Required**:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body**:
```json
{
  "dateOfBirth": "1990-01-15",
  "gender": "male",
  "bloodType": "O+",
  "allergies": ["Penicillin", "Shellfish"],
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "emergencyContact": {
    "name": "Jane Doe",
    "phoneNumber": "+1234567891",
    "relationship": "Spouse"
  },
  "insuranceInfo": {
    "providerName": "Blue Cross",
    "policyNumber": "BC123456",
    "groupNumber": "GRP789"
  }
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Patient profile updated successfully",
  "patient": { /* full patient object */ }
}
```

**Status Codes**:
- `200` - Profile updated successfully
- `401` - Unauthorized
- `400` - Validation error

---

#### Add Preferred Doctor
```
POST /patients/add-preferred-doctor
```

**Description**: Add a doctor to patient's preferred doctors list (Protected Route - Patient only)

**Headers Required**:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body**:
```json
{
  "doctorId": "professional_id"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Doctor added to preferred doctors",
  "patient": { /* updated patient object */ }
}
```

**Status Codes**:
- `200` - Doctor added successfully
- `401` - Unauthorized
- `400` - Doctor already added

---

### 3️⃣ PROFESSIONAL MANAGEMENT

#### Get All Professionals
```
GET /professionals
```

**Description**: Get list of all healthcare professionals with optional filtering

**Query Parameters**:
- `specialization` (string, optional) - Filter by specialization
- `search` (string, optional) - Search by name

**Example Request**:
```
GET /professionals?specialization=Cardiology&search=John
```

**Response (200 OK)**:
```json
{
  "success": true,
  "professionals": [
    {
      "_id": "professional_id",
      "userId": {
        "_id": "user_id",
        "firstName": "John",
        "lastName": "Smith",
        "email": "john.smith@hospital.com",
        "phoneNumber": "+1234567890",
        "profilePicture": null
      },
      "specialization": "Cardiology",
      "licenseNumber": "LIC123456",
      "registrationNumber": "REG789",
      "yearsOfExperience": 10,
      "qualifications": ["MD", "Board Certified"],
      "clinicName": "Heart Care Clinic",
      "clinicAddress": {
        "street": "456 Hospital Rd",
        "city": "New York",
        "state": "NY",
        "zipCode": "10002",
        "country": "USA"
      },
      "consultationFee": 150,
      "availability": {
        "monday": { "startTime": "09:00", "endTime": "17:00", "isAvailable": true },
        "tuesday": { "startTime": "09:00", "endTime": "17:00", "isAvailable": true }
      },
      "isVerified": true,
      "rating": 4.8,
      "totalpatients": 250,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Status Codes**:
- `200` - Professionals found
- `400` - Invalid query parameters

**Notes**:
- Public endpoint, no authentication required
- Returns multiple professionals matching filters
- Supports pagination in future versions

---

#### Get Professional by ID
```
GET /professionals/:id
```

**Description**: Get specific professional details by ID

**URL Parameters**:
- `id` (string, required) - Professional ID

**Response (200 OK)**:
```json
{
  "success": true,
  "professional": { /* professional object */ }
}
```

**Status Codes**:
- `200` - Professional found
- `404` - Professional not found
- `400` - Invalid ID format

---

#### Get Current Professional Profile
```
GET /professionals/profile
```

**Description**: Get authenticated professional's profile (Protected Route - Professional only)

**Headers Required**:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200 OK)**:
```json
{
  "success": true,
  "professional": {
    "_id": "professional_id",
    "userId": { /* user details */ },
    "specialization": "Cardiology",
    "licenseNumber": "LIC123456",
    "registrationNumber": "REG789",
    "yearsOfExperience": 10,
    "qualifications": ["MD", "Board Certified"],
    "clinicName": "Heart Care Clinic",
    "clinicAddress": { /* address */ },
    "consultationFee": 150,
    "availability": { /* schedule */ },
    "isVerified": true,
    "rating": 4.8,
    "totalpatients": 250
  }
}
```

**Status Codes**:
- `200` - Profile found
- `401` - Unauthorized
- `404` - Profile not found

---

#### Update Professional Profile
```
PUT /professionals/profile
```

**Description**: Update professional credentials and profile (Protected Route - Professional only)

**Headers Required**:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body**:
```json
{
  "specialization": "Cardiology",
  "licenseNumber": "LIC123456",
  "registrationNumber": "REG789",
  "yearsOfExperience": 10,
  "qualifications": ["MD", "Board Certified"],
  "clinicName": "Heart Care Clinic",
  "clinicAddress": {
    "street": "456 Hospital Rd",
    "city": "New York",
    "state": "NY",
    "zipCode": "10002",
    "country": "USA"
  },
  "consultationFee": 150,
  "availability": {
    "monday": { "startTime": "09:00", "endTime": "17:00", "isAvailable": true },
    "tuesday": { "startTime": "09:00", "endTime": "17:00", "isAvailable": true },
    "wednesday": { "startTime": "09:00", "endTime": "17:00", "isAvailable": true },
    "thursday": { "startTime": "09:00", "endTime": "17:00", "isAvailable": true },
    "friday": { "startTime": "09:00", "endTime": "17:00", "isAvailable": true },
    "saturday": { "startTime": "10:00", "endTime": "14:00", "isAvailable": true },
    "sunday": { "isAvailable": false }
  }
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Professional profile updated successfully",
  "professional": { /* updated professional object */ }
}
```

**Status Codes**:
- `200` - Profile updated successfully
- `401` - Unauthorized
- `400` - Validation error (missing required fields)
- `404` - Profile not found

**Validation Rules**:
- `specialization` is required
- `licenseNumber` is required (must be unique)
- All other fields optional

---

### 4️⃣ HEALTH CHECK

#### Server Health Check
```
GET /health
```

**Description**: Check if API server is running

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Server is running"
}
```

**Status Codes**:
- `200` - Server is healthy
- `500` - Server error

---

## 🔐 Authentication

### JWT Token Structure

Header:
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

Payload:
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "role": "patient",
  "iat": 1705321800,
  "exp": 1708000200
}
```

- **iat** (issued at): Token creation time
- **exp** (expiration): Token expires in 30 days
- **id**: User ID from database
- **email**: User email address
- **role**: User role (patient or professional)

### How to Use Token

1. **Store after login**:
```javascript
const { token } = response.data;
localStorage.setItem('token', token);
```

2. **Send in requests**:
```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

3. **Include in axios instance**:
```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## ❌ Error Responses

### Standard Error Format
```json
{
  "success": false,
  "message": "Error description"
}
```

### Common Error Codes

| Status | Message | Cause |
|--------|---------|-------|
| 400 | Please fill all fields | Missing required fields |
| 400 | Passwords do not match | Confirmpassword mismatch |
| 400 | Invalid credentials | Wrong email/password |
| 401 | Unauthorized | Missing/invalid token |
| 401 | No token provided | Missing Authorization header |
| 401 | Invalid or expired token | Token validation failed |
| 404 | User not found | User doesn't exist |
| 404 | Patient profile not found | Patient profile not created |
| 409 | User already exists | Email already registered |
| 500 | Internal Server Error | Server-side error |

---

## 📊 Data Models Overview

### User Model Fields
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  phoneNumber: String,
  role: Enum ['patient', 'professional'],
  profilePicture: String,
  isEmailVerified: Boolean,
  emailVerificationToken: String,
  emailVerificationTokenExpire: Date,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Patient Model Fields
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  dateOfBirth: Date,
  gender: Enum ['male', 'female', 'other'],
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  bloodType: Enum ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
  allergies: [String],
  medicalHistory: [String],
  emergencyContact: {
    name: String,
    phoneNumber: String,
    relationship: String
  },
  insuranceInfo: {
    providerName: String,
    policyNumber: String,
    groupNumber: String
  },
  preferredDoctors: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Professional Model Fields
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  specialization: String,
  licenseNumber: String (unique),
  registrationNumber: String,
  yearsOfExperience: Number,
  qualifications: [String],
  clinicName: String,
  clinicAddress: { /* address object */ },
  consultationFee: Number,
  availability: {
    [day]: {
      startTime: String,
      endTime: String,
      isAvailable: Boolean
    }
  },
  isVerified: Boolean,
  rating: Number (default: 5),
  totalpatients: Number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🧪 Testing Examples

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName":"John",
    "lastName":"Doe",
    "email":"john@yopmail.com",
    "password":"test1234",
    "confirmPassword":"test1234",
    "phoneNumber":"+1234567890",
    "role":"patient"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"john@yopmail.com",
    "password":"test1234"
  }'
```

**Get Current User:**
```bash
curl -X GET http://localhost:5000/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman

1. Create new collection "MedVault API"
2. Create requests for each endpoint
3. Use Environment variables for:
   - `baseUrl` = http://localhost:5000/api
   - `token` = JWT token from login response
4. Use Pre-request Script to set Authorization header
5. Run collection tests

---

## 🔄 Rate Limiting

Currently no rate limiting implemented. Consider adding for production:
- Limit: 100 requests per 15 minutes per IP
- Handle with express-rate-limit package

---

## 📝 API Best Practices

1. **Always include Authorization header** for protected routes
2. **Store tokens securely** in localStorage or secure cookies
3. **Handle errors gracefully** on client side
4. **Validate input** before sending requests
5. **Use HTTPS** in production
6. **Refresh tokens** when they expire
7. **Never expose credentials** in requests/responses
8. **Use appropriate HTTP methods** (GET, POST, PUT, DELETE)

---

## 🚀 Future Endpoints (Milestone 2-3)

```
POST /appointments
GET /appointments/:id
PUT /appointments/:id
DELETE /appointments/:id
POST /medical-records
GET /medical-records/:id
PUT /medical-records/:id
DELETE /medical-records/:id
```

---

**API Documentation Complete**

For frontend integration, see `frontend/src/services/api.js`
For backend routes, see `backend/routes/` directory

Last Updated: February 2026
