"use client";
import React, { useState } from 'react';

const modulesList = [
  "Authentication",
  "Dashboard",
  "Patient Records",
  "Appointments",
  "Laboratory",
  "Pharmacy",
  "Wards",
  "Billing",
  "Staff Directory",
  "Role Access",
  "Master Data",
  "Settings"
];

// Define API Data dictionary
const apiData = {
  "Authentication": [
    {
      name: "Staff Login",
      description: "Authenticates a staff member using email and password. Returns a JWT token (valid for 30 days) along with the user profile. This is a public route — no Authorization header is required.",
      method: "POST",
      endpoint: "/users/staff-login",
      parameters: "None",
      requestBody: `{\n  "email": "string (required)",\n  "password": "string (required)"\n}`,
      validationRules: [
        "email — @IsNotEmpty, @IsString. Must be a non-empty string.",
        "password — @IsNotEmpty, @IsString. Must be a non-empty string.",
        "Staff account must have status = 'Active' and is_delete = '0'.",
        "Password is compared against the stored bcrypt hash via bcryptjs.compareSync()."
      ],
      sampleRequest: `{\n  "email": "doctor@hospital.com",\n  "password": "securepassword123"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Login Successful."\n  },\n  "data": {\n    "user_data": {\n      "id": 1,\n      "first_name": "John",\n      "last_name": "Doe",\n      "email": "doctor@hospital.com",\n      "phone": "9876543210",\n      "role_id": 2,\n      "department_id": 1,\n      "qualification": "MBBS",\n      "experience_years": 5,\n      "address": "Mumbai",\n      "status": "Active"\n    },\n    "token": "eyJhbGciOiJIUzI1NiIs..."\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Login Successful (success: 1)", type: "success" },
        { code: "200", label: "Invalid credentials (success: 0)", type: "error" },
        { code: "200", label: "Account is inactive (success: 0)", type: "error" },
        { code: "500", label: "Internal Server Error", type: "error" }
      ],
      notes: "This is a public route (no JWT required). The JWT token payload contains { id, email, role_id } and expires in 30 days. The password_hash field is stripped from the response. Token must be sent as 'Bearer <token>' in the Authorization header for all subsequent protected requests."
    },
    {
      name: "Staff Signup",
      description: "Registers a new staff member. This is a public route — no Authorization header is required. The password is hashed with bcrypt (salt rounds: 10) before storage.",
      method: "POST",
      endpoint: "/users/staff-signup",
      parameters: "None",
      requestBody: `{\n  "first_name": "string (required)",\n  "last_name": "string (required)",\n  "email": "string (required)",\n  "password": "string (required)",\n  "phone": "string (required)",\n  "role_id": "number (optional)",\n  "qualification": "string (optional)"\n}`,
      validationRules: [
        "first_name — @IsNotEmpty, @IsString.",
        "last_name — @IsNotEmpty, @IsString.",
        "email — @IsNotEmpty, @IsString. Must be unique (checked against staff table).",
        "password — @IsNotEmpty, @IsString. Hashed via bcryptjs before storage.",
        "phone — @IsNotEmpty, @IsString.",
        "role_id — @IsOptional, @IsNumber. Stored as null if not provided.",
        "qualification — @IsOptional, @IsString."
      ],
      sampleRequest: `{\n  "first_name": "Jane",\n  "last_name": "Smith",\n  "email": "jane.smith@hospital.com",\n  "password": "securepassword123",\n  "phone": "9876543210",\n  "role_id": 3,\n  "qualification": "BSc Nursing"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Signup Successful."\n  },\n  "data": {\n    "insert_id": 5\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Signup Successful (success: 1)", type: "success" },
        { code: "200", label: "Record already exists with this email (success: 0)", type: "error" },
        { code: "500", label: "Internal Server Error", type: "error" }
      ],
      notes: "This is a public route (no JWT required). The new staff member is created with status = 'Active' by default. Passwords are hashed using bcryptjs with 10 salt rounds. The insert_id of the newly created record is returned on success."
    },
    {
      name: "JWT Token Validation (Auth Guard)",
      description: "All routes except /users/staff-login and /users/staff-signup are protected by the JwtAuthGuard. The guard extracts the Bearer token from the Authorization header, verifies it using jsonwebtoken, and attaches the decoded payload to request.user.",
      method: "ALL",
      endpoint: "Applied globally on all protected routes",
      parameters: "None (Header-based)",
      requestBody: `Authorization: Bearer <token>\n\nThe token is obtained from the staff-login response.\nPayload contains: { id, email, role_id }`,
      validationRules: [
        "Authorization header must be present on all non-public routes.",
        "Token format must be 'Bearer <token>'.",
        "Token is verified using process.env.DATA_SECRET (fallback: 'secretKey').",
        "Expired or tampered tokens are rejected with 401."
      ],
      sampleRequest: `Headers:\n{\n  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIs...",\n  "Content-Type": "application/json"\n}`,
      sampleResponse: `// On failure (missing header):\n{\n  "settings": {\n    "status": 401,\n    "success": 0,\n    "message": "Authorization header is missing"\n  },\n  "data": {}\n}\n\n// On failure (invalid/expired token):\n{\n  "settings": {\n    "status": 401,\n    "success": 0,\n    "message": "Invalid or expired token. Please log in again."\n  },\n  "data": {}\n}`,
      statusCodes: [
        { code: "200", label: "Token valid — request proceeds", type: "success" },
        { code: "401", label: "Authorization header is missing", type: "error" },
        { code: "401", label: "Token is missing", type: "error" },
        { code: "401", label: "Invalid or expired token", type: "error" }
      ],
      notes: "Public routes (staff-login, staff-signup) bypass this guard. On successful verification, the decoded token { id, email, role_id } is attached to request.user and available in all downstream controllers/services."
    },
    {
      name: "Forgot Password",
      description: "Initiates the password reset process by generating a reset token (or OTP) and sending it to the user's registered email address. This is a public route.",
      method: "POST",
      endpoint: "/users/forgot-password",
      parameters: "None",
      requestBody: `{\n  "email": "string (required)"\n}`,
      validationRules: [
        "email — @IsNotEmpty, @IsEmail. Must exist in the staff table.",
        "Account must have status = 'Active' and is_delete = '0'."
      ],
      sampleRequest: `{\n  "email": "doctor@hospital.com"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Password reset instructions sent to your email."\n  },\n  "data": {}\n}`,
      statusCodes: [
        { code: "200", label: "Reset instructions sent (success: 1)", type: "success" },
        { code: "200", label: "Email not found / Inactive account (success: 0)", type: "error" },
        { code: "500", label: "Internal Server Error", type: "error" }
      ],
      notes: "This is a public route (no JWT required). The backend should generate a secure token with an expiration time (e.g., 15 minutes) and email it to the user."
    },
    {
      name: "Reset Password",
      description: "Resets the staff member's password using the token received via email. This is a public route.",
      method: "POST",
      endpoint: "/users/reset-password",
      parameters: "None",
      requestBody: `{\n  "token": "string (required)",\n  "new_password": "string (required)"\n}`,
      validationRules: [
        "token — @IsNotEmpty, @IsString. Must be valid and not expired.",
        "new_password — @IsNotEmpty, @IsString. Must meet minimum security requirements."
      ],
      sampleRequest: `{\n  "token": "abc123xyz...",\n  "new_password": "NewSecurePassword123"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Password has been successfully reset."\n  },\n  "data": {}\n}`,
      statusCodes: [
        { code: "200", label: "Password reset successfully (success: 1)", type: "success" },
        { code: "200", label: "Invalid or expired token (success: 0)", type: "error" },
        { code: "500", label: "Internal Server Error", type: "error" }
      ],
      notes: "This is a public route (no JWT required). The backend must hash the `new_password` with bcrypt before updating the database."
    },
    {
      name: "Staff Logout",
      description: "Invalidates the user's current session or token. This route is protected by the JwtAuthGuard.",
      method: "POST",
      endpoint: "/users/logout",
      parameters: "None",
      requestBody: "None",
      validationRules: [
        "Authorization header with Bearer token is required."
      ],
      sampleRequest: `Headers:\n{\n  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIs..."\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Logged out successfully."\n  },\n  "data": {}\n}`,
      statusCodes: [
        { code: "200", label: "Logged out successfully (success: 1)", type: "success" },
        { code: "401", label: "Unauthorized", type: "error" },
        { code: "500", label: "Internal Server Error", type: "error" }
      ],
      notes: "Protected route. The backend might implement token blacklisting or handle logout entirely on the client side by discarding the token."
    }
  ],
  "Dashboard": [
    {
      name: "Get Dashboard Statistics (KPIs)",
      description: "Retrieves top-level Key Performance Indicators (KPIs) for the hospital dashboard, such as total patients, doctors, today's appointments, and available beds.",
      method: "POST",
      endpoint: "/dashboard/statistics",
      parameters: "None",
      requestBody: `{\n  "start_date": "string (optional, YYYY-MM-DD)",\n  "end_date": "string (optional, YYYY-MM-DD)",\n  "department_id": "number (optional)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "start_date and end_date must be valid date strings if provided."
      ],
      sampleRequest: `{\n  "start_date": "2026-07-01",\n  "end_date": "2026-07-21"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Dashboard statistics retrieved successfully."\n  },\n  "data": {\n    "total_patients": 1250,\n    "total_doctors": 45,\n    "appointments_today": 82,\n    "available_beds": 14,\n    "pending_lab_orders": 23,\n    "total_revenue": 145000.00\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success", type: "success" },
        { code: "401", label: "Unauthorized", type: "error" },
        { code: "500", label: "Internal Server Error", type: "error" }
      ],
      notes: "Protected route. If dates are not provided, it defaults to the current month or all-time depending on the metric."
    },
    {
      name: "Get Recent Appointments",
      description: "Fetches a quick list of the most recent or upcoming appointments to display in a dashboard feed/widget.",
      method: "POST",
      endpoint: "/dashboard/recent-appointments",
      parameters: "None",
      requestBody: `{\n  "limit": "number (optional, default: 5)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "limit must be an integer between 1 and 20."
      ],
      sampleRequest: `{\n  "limit": 5\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Recent appointments retrieved."\n  },\n  "data": {\n    "appointments": [\n      {\n        "id": 101,\n        "patient_name": "Alice Johnson",\n        "doctor_name": "Dr. Smith",\n        "department": "Cardiology",\n        "appointment_time": "14:30:00",\n        "status": "Scheduled"\n      },\n      {\n        "id": 102,\n        "patient_name": "Bob Williams",\n        "doctor_name": "Dr. Davis",\n        "department": "Neurology",\n        "appointment_time": "15:00:00",\n        "status": "Waiting"\n      }\n    ]\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success", type: "success" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. Joins data from `appointments`, `patients`, `staff` (doctors), and `departments` tables."
    },
    {
      name: "Get Analytics Trends (Charts)",
      description: "Retrieves aggregated data grouped by days or months to render trend charts on the dashboard (e.g., patient registrations over time or revenue trends).",
      method: "POST",
      endpoint: "/dashboard/trends",
      parameters: "None",
      requestBody: `{\n  "chart_type": "string (required: 'patients' | 'revenue' | 'appointments')",\n  "period": "string (required: 'weekly' | 'monthly' | 'yearly')",\n  "year": "number (optional, defaults to current year)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "chart_type must be one of: patients, revenue, appointments.",
        "period must be one of: weekly, monthly, yearly."
      ],
      sampleRequest: `{\n  "chart_type": "patients",\n  "period": "monthly",\n  "year": 2026\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Trend data retrieved successfully."\n  },\n  "data": {\n    "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],\n    "datasets": [\n      {\n        "label": "New Patients",\n        "data": [45, 52, 38, 65, 59, 80, 42]\n      }\n    ]\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success", type: "success" },
        { code: "400", label: "Invalid chart_type or period", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. The response data is formatted to easily drop into charting libraries like Chart.js or ApexCharts (labels and datasets arrays)."
    }
  ],
  "Role Access": [
    {
      name: "Get Roles List",
      description: "Retrieves a paginated list of all system roles. Can be filtered, searched, and sorted.",
      method: "POST",
      endpoint: "/users/roles-list",
      parameters: "None",
      requestBody: `{\n  "page": "number (optional, default: 1)",\n  "limit": "number (optional, default: 10)",\n  "search": "string (optional)",\n  "sort": "object (optional)",\n  "filters": "object (optional)",\n  "is_dropdown": "string (optional, '1' or '0')"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "page must be an integer if provided."
      ],
      sampleRequest: `{\n  "page": 1,\n  "limit": 10,\n  "search": "Admin"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Roles list retrieved successfully."\n  },\n  "data": {\n    "roles": [\n      {\n        "id": 1,\n        "role_name": "Super Admin",\n        "description": "Full system access",\n        "status": "Active"\n      },\n      {\n        "id": 2,\n        "role_name": "Doctor",\n        "description": "Medical staff access",\n        "status": "Active"\n      }\n    ],\n    "total_records": 2\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success", type: "success" },
        { code: "401", label: "Unauthorized", type: "error" },
        { code: "500", label: "Internal Server Error", type: "error" }
      ],
      notes: "Protected route. Passing `is_dropdown: '1'` will return a lightweight list suitable for populating `<select>` dropdowns."
    },
    {
      name: "Get Role Details",
      description: "Retrieves the full details of a specific role by its ID.",
      method: "POST",
      endpoint: "/users/roles-details",
      parameters: "None",
      requestBody: `{\n  "id": "number or string (required)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "id — @IsNotEmpty. Must be provided."
      ],
      sampleRequest: `{\n  "id": 2\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Role details retrieved successfully."\n  },\n  "data": {\n    "id": 2,\n    "role_name": "Doctor",\n    "description": "Medical staff access",\n    "status": "Active",\n    "added_by": 1,\n    "added_date": "2026-07-01T10:00:00Z"\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success", type: "success" },
        { code: "200", label: "Role not found (success: 0)", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. Used to populate the update form with existing role data."
    },
    {
      name: "Add Role",
      description: "Creates a new system role.",
      method: "POST",
      endpoint: "/users/roles-add",
      parameters: "None",
      requestBody: `{\n  "role_name": "string (required)",\n  "description": "string (optional)",\n  "status": "string (optional, 'Active' or 'Inactive')"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "role_name — @IsNotEmpty, @IsString. Must be provided.",
        "description — @IsOptional, @IsString.",
        "status — @IsOptional, @IsString."
      ],
      sampleRequest: `{\n  "role_name": "Nurse",\n  "description": "Nursing staff access",\n  "status": "Active"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Role added successfully."\n  },\n  "data": {\n    "insert_id": 3\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success (success: 1)", type: "success" },
        { code: "400", label: "Validation Error", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" },
        { code: "500", label: "Internal Server Error", type: "error" }
      ],
      notes: "Protected route. `added_by` and `added_date` are automatically set based on the authenticated user."
    },
    {
      name: "Update Role",
      description: "Updates an existing system role.",
      method: "POST",
      endpoint: "/users/roles-update",
      parameters: "None",
      requestBody: `{\n  "id": "number (required)",\n  "role_name": "string (optional)",\n  "description": "string (optional)",\n  "status": "string (optional)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "id — @IsOptional (inherited), @IsNumber. But practically required to identify the record.",
        "role_name — @IsOptional, @IsString.",
        "description — @IsOptional, @IsString.",
        "status — @IsOptional, @IsString."
      ],
      sampleRequest: `{\n  "id": 3,\n  "role_name": "Senior Nurse",\n  "description": "Senior nursing staff access"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Role updated successfully."\n  },\n  "data": {}\n}`,
      statusCodes: [
        { code: "200", label: "Success (success: 1)", type: "success" },
        { code: "200", label: "Role not found (success: 0)", type: "error" },
        { code: "400", label: "Validation Error", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" },
        { code: "500", label: "Internal Server Error", type: "error" }
      ],
      notes: "Protected route. Uses `PartialType(RolesDto)`. Only fields provided in the payload are updated. `updated_by` and `updated_date` are automatically set."
    }
  ],
  "Staff Directory": [
    {
      name: "Get Staff List",
      description: "Retrieves a paginated list of all staff members (doctors, nurses, admins, etc.). Supports filtering by role, department, or search by name.",
      method: "POST",
      endpoint: "/users/staff-list",
      parameters: "None",
      requestBody: `{\n  "page": "number (optional, default: 1)",\n  "limit": "number (optional, default: 10)",\n  "search": "string (optional)",\n  "sort": "object (optional)",\n  "filters": "object (optional)",\n  "is_dropdown": "string (optional, '1' or '0')"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "page must be an integer if provided."
      ],
      sampleRequest: `{\n  "page": 1,\n  "limit": 10,\n  "filters": {\n    "role_id": 2\n  }\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Staff list retrieved successfully."\n  },\n  "data": {\n    "staff": [\n      {\n        "id": 1,\n        "first_name": "John",\n        "last_name": "Doe",\n        "email": "doctor@hospital.com",\n        "role_name": "Doctor",\n        "department_name": "Cardiology",\n        "status": "Active"\n      }\n    ],\n    "total_records": 1\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success", type: "success" },
        { code: "401", label: "Unauthorized", type: "error" },
        { code: "500", label: "Internal Server Error", type: "error" }
      ],
      notes: "Protected route. The response joins the `roles` and `departments` tables to return readable names instead of just IDs."
    },
    {
      name: "Get Staff Details",
      description: "Retrieves the full profile details of a specific staff member by their ID.",
      method: "POST",
      endpoint: "/users/staff-details",
      parameters: "None",
      requestBody: `{\n  "id": "number or string (required)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "id — @IsNotEmpty. Must be provided."
      ],
      sampleRequest: `{\n  "id": 1\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Staff details retrieved successfully."\n  },\n  "data": {\n    "id": 1,\n    "role_id": 2,\n    "department_id": 1,\n    "first_name": "John",\n    "last_name": "Doe",\n    "email": "doctor@hospital.com",\n    "phone": "9876543210",\n    "qualification": "MBBS, MD",\n    "experience_years": 10,\n    "address": "123 Medical Park",\n    "status": "Active",\n    "added_date": "2026-06-15T09:30:00Z"\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success", type: "success" },
        { code: "200", label: "Staff not found (success: 0)", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. `password_hash` is intentionally excluded from the response payload for security."
    },
    {
      name: "Add Staff",
      description: "Creates a new staff member profile from the admin panel. (Similar to staff-signup but typically used by administrators).",
      method: "POST",
      endpoint: "/users/staff-add",
      parameters: "None",
      requestBody: `{\n  "role_id": "number (required)",\n  "department_id": "number (optional)",\n  "first_name": "string (required)",\n  "last_name": "string (required)",\n  "email": "string (required)",\n  "phone": "string (required)",\n  "password": "string (required)",\n  "qualification": "string (optional)",\n  "experience_years": "number (optional)",\n  "address": "string (optional)",\n  "status": "string (optional, 'Active' or 'Inactive')"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "email must be a valid email format and unique.",
        "role_id, first_name, last_name, email, phone, and password are @IsNotEmpty."
      ],
      sampleRequest: `{\n  "role_id": 4,\n  "department_id": 3,\n  "first_name": "Emily",\n  "last_name": "Clark",\n  "email": "emily@hospital.com",\n  "phone": "5551234567",\n  "password": "TempPassword123!",\n  "qualification": "BSc Lab Tech",\n  "experience_years": 3,\n  "status": "Active"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Staff member added successfully."\n  },\n  "data": {\n    "insert_id": 15\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success (success: 1)", type: "success" },
        { code: "200", label: "Email already exists (success: 0)", type: "error" },
        { code: "400", label: "Validation Error", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" },
        { code: "500", label: "Internal Server Error", type: "error" }
      ],
      notes: "Protected route. Passwords are automatically hashed via bcrypt. `added_by` is set to the ID of the admin making the request."
    },
    {
      name: "Update Staff",
      description: "Updates an existing staff member's details.",
      method: "POST",
      endpoint: "/users/staff-update",
      parameters: "None",
      requestBody: `{\n  "id": "number (required)",\n  "role_id": "number (optional)",\n  "department_id": "number (optional)",\n  "first_name": "string (optional)",\n  "last_name": "string (optional)",\n  "email": "string (optional)",\n  "phone": "string (optional)",\n  "password": "string (optional, only if changing)",\n  "qualification": "string (optional)",\n  "experience_years": "number (optional)",\n  "address": "string (optional)",\n  "status": "string (optional)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "id — @IsNumber. Required to identify the record.",
        "email — If updated, must not conflict with another user's email."
      ],
      sampleRequest: `{\n  "id": 15,\n  "experience_years": 4,\n  "status": "Inactive"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Staff updated successfully."\n  },\n  "data": {}\n}`,
      statusCodes: [
        { code: "200", label: "Success (success: 1)", type: "success" },
        { code: "200", label: "Staff not found (success: 0)", type: "error" },
        { code: "400", label: "Validation Error", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" },
        { code: "500", label: "Internal Server Error", type: "error" }
      ],
      notes: "Protected route. Only the fields passed will be updated. If `password` is provided, it will be hashed and updated; otherwise, it remains unchanged."
    },
    {
      name: "Delete Staff",
      description: "Soft deletes a staff member from the system by updating the `is_delete` flag to '1'. The record is not permanently removed from the database to preserve historical medical and audit records.",
      method: "POST",
      endpoint: "/users/staff-delete",
      parameters: "None",
      requestBody: `{\n  "id": "number (required)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "id — @IsNotEmpty, @IsNumber. Required to identify the staff member to delete."
      ],
      sampleRequest: `{\n  "id": 15\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Staff member deleted successfully."\n  },\n  "data": {}\n}`,
      statusCodes: [
        { code: "200", label: "Success (success: 1)", type: "success" },
        { code: "200", label: "Staff not found (success: 0)", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" },
        { code: "500", label: "Internal Server Error", type: "error" }
      ],
      notes: "Protected route. This is a soft delete mechanism (`is_delete = '1'`). Hard deletes are not recommended for staff entities tied to medical records (appointments, prescriptions, etc.)."
    }
  ],
  "Patient Records": [
    {
      name: "Get Patients List",
      description: "Retrieves a paginated list of registered patients. Supports searching by MRN (Medical Record Number), name, or phone number.",
      method: "POST",
      endpoint: "/users/patients-list",
      parameters: "None",
      requestBody: `{\n  "page": "number (optional, default: 1)",\n  "limit": "number (optional, default: 10)",\n  "search": "string (optional)",\n  "sort": "object (optional)",\n  "filters": "object (optional)",\n  "is_dropdown": "string (optional, '1' or '0')"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "page must be an integer if provided."
      ],
      sampleRequest: `{\n  "page": 1,\n  "limit": 10,\n  "search": "PT-2026"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Patients list retrieved successfully."\n  },\n  "data": {\n    "patients": [\n      {\n        "id": 1,\n        "mrn": "PT-2026-0001",\n        "first_name": "Michael",\n        "last_name": "Brown",\n        "dob": "1985-04-12",\n        "gender": "Male",\n        "phone": "9876543210",\n        "status": "Active"\n      }\n    ],\n    "total_records": 1\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success", type: "success" },
        { code: "401", label: "Unauthorized", type: "error" },
        { code: "500", label: "Internal Server Error", type: "error" }
      ],
      notes: "Protected route. Passing `is_dropdown: '1'` returns a lightweight list (e.g., id, mrn, first_name, last_name) for selection menus like Appointment Booking."
    },
    {
      name: "Get Patient Details",
      description: "Retrieves the complete demographic and contact information of a specific patient by their ID.",
      method: "POST",
      endpoint: "/users/patients-details",
      parameters: "None",
      requestBody: `{\n  "id": "number or string (required)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "id — @IsNotEmpty. Must be provided."
      ],
      sampleRequest: `{\n  "id": 1\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Patient details retrieved successfully."\n  },\n  "data": {\n    "id": 1,\n    "mrn": "PT-2026-0001",\n    "first_name": "Michael",\n    "last_name": "Brown",\n    "dob": "1985-04-12T00:00:00.000Z",\n    "gender": "Male",\n    "blood_group": "O+",\n    "phone": "9876543210",\n    "email": "michael.b@example.com",\n    "address": "456 Oak Avenue, City",\n    "emergency_contact_name": "Sarah Brown",\n    "emergency_contact_relation": "Wife",\n    "emergency_contact_phone": "9876543211",\n    "status": "Active",\n    "added_date": "2026-07-20T14:22:00Z"\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success", type: "success" },
        { code: "200", label: "Patient not found (success: 0)", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. Returns all fields from the patients table."
    },
    {
      name: "Add Patient",
      description: "Registers a new patient in the system. Generates a unique MRN if not explicitly provided.",
      method: "POST",
      endpoint: "/users/patients-add",
      parameters: "None",
      requestBody: `{\n  "mrn": "string (required)",\n  "first_name": "string (required)",\n  "last_name": "string (required)",\n  "dob": "date (required, YYYY-MM-DD)",\n  "gender": "string (required, 'Male', 'Female', 'Other')",\n  "blood_group": "string (optional)",\n  "phone": "string (required)",\n  "email": "string (optional)",\n  "address": "string (required)",\n  "emergency_contact_name": "string (optional)",\n  "emergency_contact_relation": "string (optional)",\n  "emergency_contact_phone": "string (optional)",\n  "status": "string (optional)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "mrn must be unique in the system.",
        "first_name, last_name, dob, gender, phone, and address are @IsNotEmpty."
      ],
      sampleRequest: `{\n  "mrn": "PT-2026-0002",\n  "first_name": "Alice",\n  "last_name": "Wonder",\n  "dob": "1992-08-25",\n  "gender": "Female",\n  "blood_group": "A-",\n  "phone": "5559876543",\n  "address": "789 Pine Road",\n  "emergency_contact_name": "Bob Wonder",\n  "emergency_contact_phone": "5551234567"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Patient registered successfully."\n  },\n  "data": {\n    "insert_id": 2\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success (success: 1)", type: "success" },
        { code: "200", label: "MRN already exists (success: 0)", type: "error" },
        { code: "400", label: "Validation Error", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" },
        { code: "500", label: "Internal Server Error", type: "error" }
      ],
      notes: "Protected route. The MRN (Medical Record Number) is the primary identifier for clinical records."
    },
    {
      name: "Update Patient",
      description: "Updates the demographic or contact details of an existing patient.",
      method: "POST",
      endpoint: "/users/patients-update",
      parameters: "None",
      requestBody: `{\n  "id": "number (required)",\n  "mrn": "string (optional)",\n  "first_name": "string (optional)",\n  "last_name": "string (optional)",\n  "dob": "date (optional)",\n  "gender": "string (optional)",\n  "blood_group": "string (optional)",\n  "phone": "string (optional)",\n  "email": "string (optional)",\n  "address": "string (optional)",\n  "emergency_contact_name": "string (optional)",\n  "emergency_contact_relation": "string (optional)",\n  "emergency_contact_phone": "string (optional)",\n  "status": "string (optional)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "id — @IsNumber. Required to identify the patient.",
        "mrn — If updated, must not conflict with another patient's MRN."
      ],
      sampleRequest: `{\n  "id": 2,\n  "phone": "5550001111",\n  "address": "789 Pine Road, Apt 4B"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Patient updated successfully."\n  },\n  "data": {}\n}`,
      statusCodes: [
        { code: "200", label: "Success (success: 1)", type: "success" },
        { code: "200", label: "Patient not found (success: 0)", type: "error" },
        { code: "400", label: "Validation Error", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" },
        { code: "500", label: "Internal Server Error", type: "error" }
      ],
      notes: "Protected route. Only the fields passed in the payload will be updated in the database."
    },
    {
      name: "Delete Patient",
      description: "Soft deletes a patient from the system by updating the `is_delete` flag to '1'. This prevents the patient from appearing in active lists but preserves clinical history.",
      method: "POST",
      endpoint: "/users/patients-delete",
      parameters: "None",
      requestBody: `{\n  "id": "number (required)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "id — @IsNotEmpty, @IsNumber. Required."
      ],
      sampleRequest: `{\n  "id": 2\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Patient deleted successfully."\n  },\n  "data": {}\n}`,
      statusCodes: [
        { code: "200", label: "Success (success: 1)", type: "success" },
        { code: "200", label: "Patient not found (success: 0)", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" },
        { code: "500", label: "Internal Server Error", type: "error" }
      ],
      notes: "Protected route. Always performs a soft delete to maintain referential integrity with Appointments, Billing, and Prescriptions."
    }
  ],
  "Doctors": [
    {
      name: "Get Doctors List",
      description: "Retrieves a list of staff members specifically holding the 'Doctor' role. Primarily used to populate dropdowns when booking appointments or filtering by department.",
      method: "POST",
      endpoint: "/users/doctors-list",
      parameters: "None",
      requestBody: `{\n  "page": "number (optional, default: 1)",\n  "limit": "number (optional, default: 10)",\n  "department_id": "number (optional)",\n  "search": "string (optional)",\n  "is_dropdown": "string (optional, '1' or '0')"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required."
      ],
      sampleRequest: `{\n  "department_id": 1,\n  "is_dropdown": "1"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Doctors list retrieved successfully."\n  },\n  "data": {\n    "doctors": [\n      {\n        "id": 12,\n        "first_name": "Gregory",\n        "last_name": "House",\n        "department_name": "Diagnostics",\n        "qualification": "MD"\n      }\n    ],\n    "total_records": 1\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success", type: "success" },
        { code: "401", label: "Unauthorized", type: "error" },
        { code: "500", label: "Internal Server Error", type: "error" }
      ],
      notes: "Protected route. This is conceptually a filtered version of the `/users/staff-list` API (where role = Doctor) but with parameters optimized for the Appointment module."
    },
    {
      name: "Get Doctor Details",
      description: "Retrieves the complete profile of a specific doctor, including their qualifications, experience, and department.",
      method: "POST",
      endpoint: "/users/doctors-details",
      parameters: "None",
      requestBody: `{\n  "id": "number (required)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "id — @IsNotEmpty. Must be the staff ID of a Doctor."
      ],
      sampleRequest: `{\n  "id": 12\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Doctor details retrieved successfully."\n  },\n  "data": {\n    "id": 12,\n    "first_name": "Gregory",\n    "last_name": "House",\n    "email": "house@hospital.com",\n    "phone": "5550009999",\n    "department_id": 3,\n    "department_name": "Diagnostics",\n    "qualification": "MD, Board Certified",\n    "experience_years": 15,\n    "status": "Active"\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success", type: "success" },
        { code: "200", label: "Doctor not found (success: 0)", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. Validates that the requested ID actually belongs to a Doctor role."
    },
    {
      name: "Get Doctor Availability (Schedule)",
      description: "Retrieves the available booking slots or scheduled working hours for a specific doctor on a given date.",
      method: "POST",
      endpoint: "/users/doctors-schedule",
      parameters: "None",
      requestBody: `{\n  "doctor_id": "number (required)",\n  "date": "string (required, YYYY-MM-DD)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "doctor_id — @IsNotEmpty, @IsNumber.",
        "date — @IsNotEmpty, must be a valid date format."
      ],
      sampleRequest: `{\n  "doctor_id": 12,\n  "date": "2026-08-01"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Availability retrieved successfully."\n  },\n  "data": {\n    "doctor_id": 12,\n    "date": "2026-08-01",\n    "available_slots": [\n      "09:00", "09:30", "11:00", "14:30", "15:00"\n    ]\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success", type: "success" },
        { code: "400", label: "Validation Error / Invalid Date", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. This API cross-references the doctor's standard shift hours against already booked appointments in the `appointments` table to return only free slots."
    }
  ],
  "Appointments": [
    {
      name: "Get Appointments List",
      description: "Retrieves a paginated list of appointments. Supports powerful filtering by doctor, patient, date range, and status.",
      method: "POST",
      endpoint: "/appointments/list",
      parameters: "None",
      requestBody: `{\n  "page": "number (optional, default: 1)",\n  "limit": "number (optional, default: 10)",\n  "filters": {\n    "doctor_id": "number (optional)",\n    "patient_id": "number (optional)",\n    "appointment_status": "string (optional, e.g., 'Scheduled', 'Completed')",\n    "start_date": "string (optional, YYYY-MM-DD)",\n    "end_date": "string (optional, YYYY-MM-DD)"\n  }\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "start_date and end_date must be valid dates if provided."
      ],
      sampleRequest: `{\n  "page": 1,\n  "limit": 10,\n  "filters": {\n    "doctor_id": 12,\n    "start_date": "2026-08-01",\n    "end_date": "2026-08-01"\n  }\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Appointments retrieved successfully."\n  },\n  "data": {\n    "appointments": [\n      {\n        "id": 501,\n        "patient_name": "Alice Wonder",\n        "mrn": "PT-2026-0002",\n        "doctor_name": "Dr. Gregory House",\n        "appointment_date": "2026-08-01",\n        "appointment_time": "09:30:00",\n        "appointment_status": "Scheduled"\n      }\n    ],\n    "total_records": 1\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success", type: "success" },
        { code: "401", label: "Unauthorized", type: "error" },
        { code: "500", label: "Internal Server Error", type: "error" }
      ],
      notes: "Protected route. Automatically joins `patients` and `staff` tables to return readable names instead of raw IDs."
    },
    {
      name: "Get Appointment Details",
      description: "Retrieves the complete details of a specific appointment, including any clinical notes added during booking.",
      method: "POST",
      endpoint: "/appointments/details",
      parameters: "None",
      requestBody: `{\n  "id": "number (required)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "id — @IsNotEmpty, @IsNumber."
      ],
      sampleRequest: `{\n  "id": 501\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Appointment details retrieved successfully."\n  },\n  "data": {\n    "id": 501,\n    "patient_id": 2,\n    "doctor_id": 12,\n    "department_id": 3,\n    "appointment_date": "2026-08-01",\n    "appointment_time": "09:30:00",\n    "appointment_type": "Consultation",\n    "appointment_status": "Scheduled",\n    "notes": "Patient complains of persistent headache.",\n    "added_date": "2026-07-20T10:15:00Z"\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success", type: "success" },
        { code: "200", label: "Appointment not found (success: 0)", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route."
    },
    {
      name: "Book Appointment",
      description: "Creates a new appointment booking for a patient with a specific doctor.",
      method: "POST",
      endpoint: "/appointments/add",
      parameters: "None",
      requestBody: `{\n  "patient_id": "number (required)",\n  "doctor_id": "number (required)",\n  "department_id": "number (required)",\n  "appointment_date": "string (required, YYYY-MM-DD)",\n  "appointment_time": "string (required, HH:MM:SS)",\n  "appointment_type": "string (optional, default: 'Consultation')",\n  "notes": "string (optional)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "patient_id, doctor_id, department_id, appointment_date, appointment_time are @IsNotEmpty.",
        "The requested time slot must be verified as available before booking."
      ],
      sampleRequest: `{\n  "patient_id": 2,\n  "doctor_id": 12,\n  "department_id": 3,\n  "appointment_date": "2026-08-01",\n  "appointment_time": "14:30:00",\n  "appointment_type": "Follow-up",\n  "notes": "Review blood test results."\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Appointment booked successfully."\n  },\n  "data": {\n    "insert_id": 502\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success (success: 1)", type: "success" },
        { code: "400", label: "Slot Already Booked / Validation Error", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" },
        { code: "500", label: "Internal Server Error", type: "error" }
      ],
      notes: "Protected route. Backend must validate if the `appointment_time` on `appointment_date` for `doctor_id` is not already booked with status='Scheduled'."
    },
    {
      name: "Update Appointment",
      description: "Updates details of an appointment, typically used for rescheduling the date or time.",
      method: "POST",
      endpoint: "/appointments/update",
      parameters: "None",
      requestBody: `{\n  "id": "number (required)",\n  "doctor_id": "number (optional)",\n  "appointment_date": "string (optional, YYYY-MM-DD)",\n  "appointment_time": "string (optional, HH:MM:SS)",\n  "appointment_type": "string (optional)",\n  "notes": "string (optional)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "id — @IsNumber. Required.",
        "If date/time/doctor changes, backend must re-validate slot availability."
      ],
      sampleRequest: `{\n  "id": 502,\n  "appointment_time": "15:00:00"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Appointment rescheduled successfully."\n  },\n  "data": {}\n}`,
      statusCodes: [
        { code: "200", label: "Success (success: 1)", type: "success" },
        { code: "200", label: "Appointment not found (success: 0)", type: "error" },
        { code: "400", label: "Slot Conflict / Validation Error", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. Used primarily for Rescheduling."
    },
    {
      name: "Update Appointment Status",
      description: "A lightweight endpoint dedicated to changing the status of an appointment (e.g., from 'Scheduled' to 'Completed' or 'Cancelled').",
      method: "POST",
      endpoint: "/appointments/update-status",
      parameters: "None",
      requestBody: `{\n  "id": "number (required)",\n  "appointment_status": "string (required, 'Scheduled', 'Completed', 'Cancelled')" \n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "id — @IsNotEmpty, @IsNumber.",
        "appointment_status — Must be one of the allowed enum values."
      ],
      sampleRequest: `{\n  "id": 501,\n  "appointment_status": "Cancelled"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Appointment status updated to Cancelled."\n  },\n  "data": {}\n}`,
      statusCodes: [
        { code: "200", label: "Success (success: 1)", type: "success" },
        { code: "200", label: "Appointment not found (success: 0)", type: "error" },
        { code: "400", label: "Invalid Status String", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. Cancelling an appointment frees up the slot for the doctor in the `doctors-schedule` API."
    }
  ],
  "Master Data": [
    {
      name: "Get Departments List",
      description: "Retrieves a paginated list of hospital departments (e.g., Cardiology, Neurology). Essential for populating dropdown menus across the system.",
      method: "POST",
      endpoint: "/departments/list",
      parameters: "None",
      requestBody: `{\n  "page": "number (optional, default: 1)",\n  "limit": "number (optional, default: 10)",\n  "search": "string (optional)",\n  "sort": "object (optional)",\n  "filters": "object (optional)",\n  "is_dropdown": "string (optional, '1' or '0')"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "page must be an integer if provided."
      ],
      sampleRequest: `{\n  "page": 1,\n  "limit": 10,\n  "is_dropdown": "1"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Departments list retrieved successfully."\n  },\n  "data": {\n    "departments": [\n      {\n        "id": 1,\n        "department_name": "Cardiology",\n        "description": "Heart and cardiovascular care",\n        "status": "Active"\n      },\n      {\n        "id": 2,\n        "department_name": "Neurology",\n        "description": "Brain and nervous system",\n        "status": "Active"\n      }\n    ],\n    "total_records": 2\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success", type: "success" },
        { code: "401", label: "Unauthorized", type: "error" },
        { code: "500", label: "Internal Server Error", type: "error" }
      ],
      notes: "Protected route. Highly utilized with `is_dropdown: '1'` when booking appointments, adding staff, or creating wards."
    },
    {
      name: "Get Department Details",
      description: "Retrieves the full details of a specific department by its ID.",
      method: "POST",
      endpoint: "/departments/details",
      parameters: "None",
      requestBody: `{\n  "id": "number or string (required)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "id — @IsNotEmpty. Must be provided."
      ],
      sampleRequest: `{\n  "id": 1\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Department details retrieved successfully."\n  },\n  "data": {\n    "id": 1,\n    "department_name": "Cardiology",\n    "description": "Heart and cardiovascular care",\n    "status": "Active",\n    "added_by": 1,\n    "added_date": "2026-01-15T08:00:00Z"\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success", type: "success" },
        { code: "200", label: "Department not found (success: 0)", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. Primarily used to populate edit forms in the master data management section."
    },
    {
      name: "Add Department",
      description: "Creates a new department in the hospital system.",
      method: "POST",
      endpoint: "/departments/add",
      parameters: "None",
      requestBody: `{\n  "department_name": "string (required)",\n  "description": "string (optional)",\n  "status": "string (optional, 'Active' or 'Inactive')"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "department_name — @IsNotEmpty, @IsString. Must be unique to prevent duplicates.",
        "description — @IsOptional, @IsString."
      ],
      sampleRequest: `{\n  "department_name": "Pediatrics",\n  "description": "Child medical care",\n  "status": "Active"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Department added successfully."\n  },\n  "data": {\n    "insert_id": 4\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success (success: 1)", type: "success" },
        { code: "400", label: "Validation Error / Name exists", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" },
        { code: "500", label: "Internal Server Error", type: "error" }
      ],
      notes: "Protected route. `added_by` and `added_date` are automatically set."
    },
    {
      name: "Update Department",
      description: "Updates an existing hospital department's details.",
      method: "POST",
      endpoint: "/departments/update",
      parameters: "None",
      requestBody: `{\n  "id": "number (required)",\n  "department_name": "string (optional)",\n  "description": "string (optional)",\n  "status": "string (optional)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "id — @IsNumber. Required to identify the department.",
        "department_name — If provided, must not conflict with an existing department."
      ],
      sampleRequest: `{\n  "id": 4,\n  "description": "Child and adolescent medical care"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Department updated successfully."\n  },\n  "data": {}\n}`,
      statusCodes: [
        { code: "200", label: "Success (success: 1)", type: "success" },
        { code: "200", label: "Department not found (success: 0)", type: "error" },
        { code: "400", label: "Validation Error", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. Only the fields passed will be updated."
    },
    {
      name: "Delete Department",
      description: "Soft deletes a department by updating the `is_delete` flag to '1'.",
      method: "POST",
      endpoint: "/departments/delete",
      parameters: "None",
      requestBody: `{\n  "id": "number (required)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "id — @IsNotEmpty, @IsNumber."
      ],
      sampleRequest: `{\n  "id": 4\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Department deleted successfully."\n  },\n  "data": {}\n}`,
      statusCodes: [
        { code: "200", label: "Success (success: 1)", type: "success" },
        { code: "200", label: "Department not found (success: 0)", type: "error" },
        { code: "400", label: "Cannot delete (linked to staff/appointments)", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. The backend should ideally block deletion if there are active staff or appointments tied to this department."
    },
    {
      name: "Get Specialties List",
      description: "Retrieves the list of medical specialties (e.g., Orthopedics, Dermatology). Used to tag doctors with their area of expertise.",
      method: "POST",
      endpoint: "/masters/specialties-list",
      parameters: "None",
      requestBody: `{\n  "page": "number (optional)",\n  "limit": "number (optional)",\n  "search": "string (optional)",\n  "is_dropdown": "string (optional, '1' or '0')"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required."
      ],
      sampleRequest: `{\n  "is_dropdown": "1"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Specialties retrieved."\n  },\n  "data": {\n    "specialties": [\n      { "id": 1, "specialty_name": "Orthopedics", "status": "Active" },\n      { "id": 2, "specialty_name": "Dermatology", "status": "Active" }\n    ],\n    "total_records": 2\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success", type: "success" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. Standard master CRUD — Add, Update, Delete follow the same pattern as Departments."
    },
    {
      name: "Add / Update / Delete Specialty",
      description: "Standard CRUD operations for the Specialties master. Add creates a new specialty, Update modifies an existing one, Delete performs a soft delete.",
      method: "POST",
      endpoint: "/masters/specialties-add | specialties-update | specialties-delete",
      parameters: "None",
      requestBody: `Add:\n{\n  "specialty_name": "string (required)",\n  "description": "string (optional)",\n  "status": "string (optional)"\n}\n\nUpdate:\n{\n  "id": "number (required)",\n  "specialty_name": "string (optional)",\n  "description": "string (optional)",\n  "status": "string (optional)"\n}\n\nDelete:\n{\n  "id": "number (required)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "Add: specialty_name — @IsNotEmpty, @IsString.",
        "Update: id — @IsNumber. Required.",
        "Delete: id — @IsNotEmpty, @IsNumber."
      ],
      sampleRequest: `{\n  "specialty_name": "Gastroenterology",\n  "status": "Active"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Specialty added successfully."\n  },\n  "data": {\n    "insert_id": 5\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success (success: 1)", type: "success" },
        { code: "400", label: "Validation Error / Name exists", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. All three endpoints follow the standard master data pattern with audit columns (added_by, updated_by)."
    },
    {
      name: "Get Appointment Types List",
      description: "Retrieves available appointment types (e.g., Consultation, Follow-up, Emergency, Telemedicine).",
      method: "POST",
      endpoint: "/masters/appointment-types-list",
      parameters: "None",
      requestBody: `{\n  "is_dropdown": "string (optional, '1' or '0')"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required."
      ],
      sampleRequest: `{\n  "is_dropdown": "1"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Appointment types retrieved."\n  },\n  "data": {\n    "appointment_types": [\n      { "id": 1, "type_name": "Consultation", "duration_minutes": 30, "status": "Active" },\n      { "id": 2, "type_name": "Follow-up", "duration_minutes": 15, "status": "Active" },\n      { "id": 3, "type_name": "Emergency", "duration_minutes": 60, "status": "Active" }\n    ]\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success", type: "success" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. `duration_minutes` is used to calculate slot blocking when booking appointments."
    },
    {
      name: "Add / Update / Delete Appointment Type",
      description: "Standard CRUD for Appointment Types master.",
      method: "POST",
      endpoint: "/masters/appointment-types-add | appointment-types-update | appointment-types-delete",
      parameters: "None",
      requestBody: `Add:\n{\n  "type_name": "string (required)",\n  "duration_minutes": "number (optional, default: 30)",\n  "description": "string (optional)",\n  "status": "string (optional)"\n}\n\nUpdate:\n{\n  "id": "number (required)",\n  "type_name": "string (optional)",\n  "duration_minutes": "number (optional)",\n  "status": "string (optional)"\n}\n\nDelete:\n{\n  "id": "number (required)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "Add: type_name — @IsNotEmpty, @IsString.",
        "Update/Delete: id — @IsNumber, required."
      ],
      sampleRequest: `{\n  "type_name": "Telemedicine",\n  "duration_minutes": 20,\n  "status": "Active"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Appointment type added successfully."\n  },\n  "data": {\n    "insert_id": 4\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success (success: 1)", type: "success" },
        { code: "400", label: "Validation Error", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. Standard master pattern."
    },
    {
      name: "Get Lab Tests List",
      description: "Retrieves the master list of available lab tests (e.g., CBC, Lipid Profile, Thyroid Panel). Used when creating lab orders.",
      method: "POST",
      endpoint: "/masters/lab-tests-list",
      parameters: "None",
      requestBody: `{\n  "search": "string (optional)",\n  "filters": {\n    "category_id": "number (optional)"\n  },\n  "is_dropdown": "string (optional, '1' or '0')"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required."
      ],
      sampleRequest: `{\n  "is_dropdown": "1"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Lab tests retrieved."\n  },\n  "data": {\n    "lab_tests": [\n      { "id": 1, "test_name": "Complete Blood Count (CBC)", "category": "Hematology", "price": 350.00 },\n      { "id": 2, "test_name": "Lipid Profile", "category": "Biochemistry", "price": 600.00 },\n      { "id": 3, "test_name": "Thyroid Panel (T3, T4, TSH)", "category": "Endocrinology", "price": 900.00 }\n    ]\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success", type: "success" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. Filterable by `category_id` from the Test Categories master."
    },
    {
      name: "Add / Update / Delete Lab Test",
      description: "Standard CRUD for the Lab Tests master. Manages the catalogue of available tests.",
      method: "POST",
      endpoint: "/masters/lab-tests-add | lab-tests-update | lab-tests-delete",
      parameters: "None",
      requestBody: `Add:\n{\n  "test_name": "string (required)",\n  "category_id": "number (required)",\n  "price": "number (required)",\n  "description": "string (optional)",\n  "status": "string (optional)"\n}\n\nUpdate:\n{\n  "id": "number (required)",\n  "test_name": "string (optional)",\n  "category_id": "number (optional)",\n  "price": "number (optional)",\n  "status": "string (optional)"\n}\n\nDelete:\n{\n  "id": "number (required)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "Add: test_name — @IsNotEmpty. category_id — @IsNotEmpty. price — @IsNotEmpty, @IsNumber.",
        "Update/Delete: id — @IsNumber, required."
      ],
      sampleRequest: `{\n  "test_name": "HbA1c (Glycated Hemoglobin)",\n  "category_id": 2,\n  "price": 450.00\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Lab test added successfully."\n  },\n  "data": {\n    "insert_id": 10\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success (success: 1)", type: "success" },
        { code: "400", label: "Validation Error", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. Deleting a test that has been used in existing lab orders will perform a soft delete only."
    },
    {
      name: "Get Test Categories List",
      description: "Retrieves categories for grouping lab tests (e.g., Hematology, Biochemistry, Microbiology).",
      method: "POST",
      endpoint: "/masters/test-categories-list",
      parameters: "None",
      requestBody: `{\n  "is_dropdown": "string (optional, '1' or '0')"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required."
      ],
      sampleRequest: `{\n  "is_dropdown": "1"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Test categories retrieved."\n  },\n  "data": {\n    "categories": [\n      { "id": 1, "category_name": "Hematology", "status": "Active" },\n      { "id": 2, "category_name": "Biochemistry", "status": "Active" },\n      { "id": 3, "category_name": "Microbiology", "status": "Active" }\n    ]\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success", type: "success" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. Used as a filter in the Lab Tests list and Lab Orders list."
    },
    {
      name: "Add / Update / Delete Test Category",
      description: "Standard CRUD for Test Categories master.",
      method: "POST",
      endpoint: "/masters/test-categories-add | test-categories-update | test-categories-delete",
      parameters: "None",
      requestBody: `Add:\n{\n  "category_name": "string (required)",\n  "description": "string (optional)",\n  "status": "string (optional)"\n}\n\nUpdate:\n{\n  "id": "number (required)",\n  "category_name": "string (optional)",\n  "status": "string (optional)"\n}\n\nDelete:\n{\n  "id": "number (required)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "Add: category_name — @IsNotEmpty, @IsString.",
        "Update/Delete: id — @IsNumber, required."
      ],
      sampleRequest: `{\n  "category_name": "Endocrinology",\n  "status": "Active"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Test category added."\n  },\n  "data": {\n    "insert_id": 4\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success (success: 1)", type: "success" },
        { code: "400", label: "Validation Error", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. Standard master pattern."
    },
    {
      name: "Get Pharmacy Categories List",
      description: "Retrieves medicine categories for grouping pharmacy inventory (e.g., Analgesics, Antibiotics, Antacids).",
      method: "POST",
      endpoint: "/masters/pharmacy-categories-list",
      parameters: "None",
      requestBody: `{\n  "is_dropdown": "string (optional, '1' or '0')"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required."
      ],
      sampleRequest: `{\n  "is_dropdown": "1"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Pharmacy categories retrieved."\n  },\n  "data": {\n    "categories": [\n      { "id": 1, "category_name": "Antibiotics", "status": "Active" },\n      { "id": 2, "category_name": "Analgesics", "status": "Active" },\n      { "id": 3, "category_name": "Antacids", "status": "Active" }\n    ]\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success", type: "success" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. Used as a filter/dropdown in the Pharmacy module."
    },
    {
      name: "Add / Update / Delete Pharmacy Category",
      description: "Standard CRUD for Pharmacy Categories master.",
      method: "POST",
      endpoint: "/masters/pharmacy-categories-add | pharmacy-categories-update | pharmacy-categories-delete",
      parameters: "None",
      requestBody: `Add:\n{\n  "category_name": "string (required)",\n  "description": "string (optional)",\n  "status": "string (optional)"\n}\n\nUpdate:\n{\n  "id": "number (required)",\n  "category_name": "string (optional)",\n  "status": "string (optional)"\n}\n\nDelete:\n{\n  "id": "number (required)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "Add: category_name — @IsNotEmpty, @IsString.",
        "Update/Delete: id — @IsNumber, required."
      ],
      sampleRequest: `{\n  "category_name": "Vitamins & Supplements",\n  "status": "Active"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Pharmacy category added."\n  },\n  "data": {\n    "insert_id": 4\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success (success: 1)", type: "success" },
        { code: "400", label: "Validation Error", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. Standard master pattern."
    },
    {
      name: "Get Manufacturers List",
      description: "Retrieves the list of pharmaceutical manufacturers/suppliers.",
      method: "POST",
      endpoint: "/masters/manufacturers-list",
      parameters: "None",
      requestBody: `{\n  "search": "string (optional)",\n  "is_dropdown": "string (optional, '1' or '0')"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required."
      ],
      sampleRequest: `{\n  "is_dropdown": "1"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Manufacturers retrieved."\n  },\n  "data": {\n    "manufacturers": [\n      { "id": 1, "manufacturer_name": "PharmaCorp", "contact_number": "1800-555-0001", "status": "Active" },\n      { "id": 2, "manufacturer_name": "MediSupply Ltd", "contact_number": "1800-555-0002", "status": "Active" }\n    ]\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success", type: "success" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. Used in the Pharmacy module when adding a new medicine."
    },
    {
      name: "Add / Update / Delete Manufacturer",
      description: "Standard CRUD for Manufacturers master.",
      method: "POST",
      endpoint: "/masters/manufacturers-add | manufacturers-update | manufacturers-delete",
      parameters: "None",
      requestBody: `Add:\n{\n  "manufacturer_name": "string (required)",\n  "contact_number": "string (optional)",\n  "email": "string (optional)",\n  "address": "string (optional)",\n  "status": "string (optional)"\n}\n\nUpdate:\n{\n  "id": "number (required)",\n  "manufacturer_name": "string (optional)",\n  "contact_number": "string (optional)",\n  "email": "string (optional)",\n  "status": "string (optional)"\n}\n\nDelete:\n{\n  "id": "number (required)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "Add: manufacturer_name — @IsNotEmpty, @IsString.",
        "Update/Delete: id — @IsNumber, required."
      ],
      sampleRequest: `{\n  "manufacturer_name": "HealthGen Pharma",\n  "contact_number": "1800-555-0003",\n  "status": "Active"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Manufacturer added."\n  },\n  "data": {\n    "insert_id": 3\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success (success: 1)", type: "success" },
        { code: "400", label: "Validation Error", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. Standard master pattern with additional contact fields."
    },
    {
      name: "Get Ward Names List",
      description: "Retrieves the master list of ward name templates (e.g., 'ICU Ward', 'General Ward', 'Maternity Ward'). Used when creating new wards.",
      method: "POST",
      endpoint: "/masters/ward-names-list",
      parameters: "None",
      requestBody: `{\n  "is_dropdown": "string (optional, '1' or '0')"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required."
      ],
      sampleRequest: `{\n  "is_dropdown": "1"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Ward names retrieved."\n  },\n  "data": {\n    "ward_names": [\n      { "id": 1, "ward_name": "General Ward", "status": "Active" },\n      { "id": 2, "ward_name": "ICU", "status": "Active" },\n      { "id": 3, "ward_name": "Maternity Ward", "status": "Active" }\n    ]\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success", type: "success" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. Provides standard naming for the Wards module."
    },
    {
      name: "Add / Update / Delete Ward Name",
      description: "Standard CRUD for Ward Names master.",
      method: "POST",
      endpoint: "/masters/ward-names-add | ward-names-update | ward-names-delete",
      parameters: "None",
      requestBody: `Add:\n{\n  "ward_name": "string (required)",\n  "description": "string (optional)",\n  "status": "string (optional)"\n}\n\nUpdate:\n{\n  "id": "number (required)",\n  "ward_name": "string (optional)",\n  "status": "string (optional)"\n}\n\nDelete:\n{\n  "id": "number (required)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "Add: ward_name — @IsNotEmpty, @IsString.",
        "Update/Delete: id — @IsNumber, required."
      ],
      sampleRequest: `{\n  "ward_name": "Pediatric Ward",\n  "status": "Active"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Ward name added."\n  },\n  "data": {\n    "insert_id": 4\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success (success: 1)", type: "success" },
        { code: "400", label: "Validation Error", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. Standard master pattern."
    },
    {
      name: "Get Service Rate Card List",
      description: "Retrieves the hospital's service rate card — a pricing catalogue for consultations, procedures, and other billable services.",
      method: "POST",
      endpoint: "/masters/service-rates-list",
      parameters: "None",
      requestBody: `{\n  "search": "string (optional)",\n  "filters": {\n    "service_type": "string (optional, e.g., 'Consultation', 'Procedure', 'Room Charge')"\n  },\n  "is_dropdown": "string (optional, '1' or '0')"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required."
      ],
      sampleRequest: `{\n  "filters": {\n    "service_type": "Consultation"\n  }\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Service rates retrieved."\n  },\n  "data": {\n    "services": [\n      { "id": 1, "service_name": "OPD Consultation", "service_type": "Consultation", "rate": 500.00, "status": "Active" },\n      { "id": 2, "service_name": "Specialist Consultation", "service_type": "Consultation", "rate": 1000.00, "status": "Active" },\n      { "id": 3, "service_name": "Minor Dressing", "service_type": "Procedure", "rate": 200.00, "status": "Active" }\n    ]\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success", type: "success" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. The Billing module references these rates when auto-generating invoice line items."
    },
    {
      name: "Add / Update / Delete Service Rate",
      description: "Standard CRUD for the Service Rate Card master. Manages billing rates for all hospital services.",
      method: "POST",
      endpoint: "/masters/service-rates-add | service-rates-update | service-rates-delete",
      parameters: "None",
      requestBody: `Add:\n{\n  "service_name": "string (required)",\n  "service_type": "string (required, 'Consultation', 'Procedure', 'Room Charge', 'Other')",\n  "rate": "number (required)",\n  "description": "string (optional)",\n  "status": "string (optional)"\n}\n\nUpdate:\n{\n  "id": "number (required)",\n  "service_name": "string (optional)",\n  "service_type": "string (optional)",\n  "rate": "number (optional)",\n  "status": "string (optional)"\n}\n\nDelete:\n{\n  "id": "number (required)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "Add: service_name — @IsNotEmpty. service_type — @IsNotEmpty. rate — @IsNotEmpty, @IsNumber.",
        "Update/Delete: id — @IsNumber, required."
      ],
      sampleRequest: `{\n  "service_name": "ECG Test",\n  "service_type": "Procedure",\n  "rate": 300.00,\n  "status": "Active"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Service rate added."\n  },\n  "data": {\n    "insert_id": 10\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success (success: 1)", type: "success" },
        { code: "400", label: "Validation Error", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. Changing a rate here does NOT retroactively affect existing invoices — only future billing entries."
    }
  ],
  "Settings": [
    {
      name: "Get General Settings",
      description: "Retrieves global hospital configuration (e.g., Hospital Name, Contact Email, Logo, Address, Currency).",
      method: "POST",
      endpoint: "/settings/general",
      parameters: "None",
      requestBody: `{}`,
      validationRules: [
        "Authorization header with Bearer token is required."
      ],
      sampleRequest: `{}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "General settings retrieved successfully."\n  },\n  "data": {\n    "hospital_name": "MediCenter General Hospital",\n    "email": "contact@medicenter.com",\n    "phone": "+1-800-555-1234",\n    "address": "123 Health Ave, Medical District",\n    "currency": "USD",\n    "timezone": "America/New_York",\n    "logo_url": "https://example.com/logo.png"\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success", type: "success" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. Usually called on application load to set UI branding."
    },
    {
      name: "Update General Settings",
      description: "Updates global hospital configuration. Only accessible by Super Admins.",
      method: "POST",
      endpoint: "/settings/update-general",
      parameters: "None",
      requestBody: `{\n  "hospital_name": "string (optional)",\n  "email": "string (optional)",\n  "phone": "string (optional)",\n  "address": "string (optional)",\n  "currency": "string (optional)",\n  "timezone": "string (optional)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "User must have 'Super Admin' role to access."
      ],
      sampleRequest: `{\n  "hospital_name": "MediCenter City Hospital",\n  "phone": "+1-800-555-9999"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Settings updated successfully."\n  },\n  "data": {}\n}`,
      statusCodes: [
        { code: "200", label: "Success (success: 1)", type: "success" },
        { code: "401", label: "Unauthorized", type: "error" },
        { code: "403", label: "Forbidden (Not a Super Admin)", type: "error" }
      ],
      notes: "Protected route. Logo updates should ideally be handled via a separate multipart/form-data API if file upload is required."
    },
    {
      name: "Get My Profile",
      description: "Retrieves the profile details of the currently authenticated user.",
      method: "POST",
      endpoint: "/settings/my-profile",
      parameters: "None",
      requestBody: `{}`,
      validationRules: [
        "Authorization header with Bearer token is required."
      ],
      sampleRequest: `{}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Profile retrieved successfully."\n  },\n  "data": {\n    "id": 12,\n    "first_name": "Gregory",\n    "last_name": "House",\n    "email": "house@medicenter.com",\n    "phone_number": "555-0102",\n    "role_name": "Doctor",\n    "department_name": "Diagnostic Medicine",\n    "profile_photo_url": null\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success", type: "success" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. Extracts the user ID from the JWT token, ensuring users can only fetch their own profile."
    },
    {
      name: "Update My Profile",
      description: "Updates the personal details of the currently authenticated user.",
      method: "POST",
      endpoint: "/settings/update-profile",
      parameters: "None",
      requestBody: `{\n  "first_name": "string (optional)",\n  "last_name": "string (optional)",\n  "phone_number": "string (optional)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required."
      ],
      sampleRequest: `{\n  "phone_number": "555-9999"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Profile updated successfully."\n  },\n  "data": {}\n}`,
      statusCodes: [
        { code: "200", label: "Success (success: 1)", type: "success" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. Role and department cannot be updated here (must use the Staff Directory API)."
    },
    {
      name: "Change Password",
      description: "Allows the authenticated user to change their account password.",
      method: "POST",
      endpoint: "/settings/change-password",
      parameters: "None",
      requestBody: `{\n  "current_password": "string (required)",\n  "new_password": "string (required)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "current_password — @IsNotEmpty, @IsString.",
        "new_password — @IsNotEmpty, @IsString. Min length 6."
      ],
      sampleRequest: `{\n  "current_password": "oldPassword123!",\n  "new_password": "newSecurePassword456!"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Password changed successfully."\n  },\n  "data": {}\n}`,
      statusCodes: [
        { code: "200", label: "Success (success: 1)", type: "success" },
        { code: "400", label: "Incorrect current password", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. On success, the frontend should optionally prompt the user to log in again or refresh their token."
    }
  ],
  "OPD": [
    {
      name: "Get OPD Waiting Queue",
      description: "Retrieves the list of patients scheduled for an outpatient visit today. Used by doctors and nurses to manage their daily patient flow.",
      method: "POST",
      endpoint: "/opd/queue",
      parameters: "None",
      requestBody: `{\n  "doctor_id": "number (optional, defaults to logged-in doctor)",\n  "department_id": "number (optional)",\n  "date": "string (optional, defaults to today's date)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required."
      ],
      sampleRequest: `{\n  "doctor_id": 12\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "OPD queue retrieved successfully."\n  },\n  "data": {\n    "queue": [\n      {\n        "appointment_id": 501,\n        "patient_id": 2,\n        "patient_name": "Alice Wonder",\n        "mrn": "PT-2026-0002",\n        "appointment_time": "09:30:00",\n        "status": "Waiting"\n      }\n    ]\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success", type: "success" },
        { code: "401", label: "Unauthorized", type: "error" },
        { code: "500", label: "Internal Server Error", type: "error" }
      ],
      notes: "Protected route. Essentially queries the `appointments` table for a specific date where `status` is not 'Completed' or 'Cancelled'."
    },
    {
      name: "Save Clinical Consultation (EHR)",
      description: "Saves a doctor's consultation notes, diagnosis, and patient vital signs during an OPD visit.",
      method: "POST",
      endpoint: "/opd/consultation-save",
      parameters: "None",
      requestBody: `{\n  "appointment_id": "number (required)",\n  "patient_id": "number (required)",\n  "doctor_id": "number (required)",\n  "symptoms": "string (optional)",\n  "diagnosis": "string (optional)",\n  "clinical_notes": "string (optional)",\n  "bp_systolic": "number (optional)",\n  "bp_diastolic": "number (optional)",\n  "heart_rate": "number (optional)",\n  "weight": "number (optional)",\n  "temperature": "number (optional)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "appointment_id, patient_id, doctor_id must be valid numbers."
      ],
      sampleRequest: `{\n  "appointment_id": 501,\n  "patient_id": 2,\n  "doctor_id": 12,\n  "symptoms": "Mild fever, cough",\n  "diagnosis": "Viral Infection",\n  "bp_systolic": 120,\n  "bp_diastolic": 80,\n  "temperature": 100.2\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Consultation saved successfully."\n  },\n  "data": {\n    "consultation_id": 1005\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success", type: "success" },
        { code: "400", label: "Validation Error", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" },
        { code: "500", label: "Internal Server Error", type: "error" }
      ],
      notes: "Protected route. Upon successfully saving, the backend should automatically update the associated `appointment_status` to 'Completed'."
    },
    {
      name: "Get Consultation Details",
      description: "Retrieves the full Electronic Health Record (EHR) of a specific past consultation.",
      method: "POST",
      endpoint: "/opd/consultation-details",
      parameters: "None",
      requestBody: `{\n  "id": "number (required, consultation ID)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "id — @IsNotEmpty, @IsNumber."
      ],
      sampleRequest: `{\n  "id": 1005\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Consultation details retrieved."\n  },\n  "data": {\n    "id": 1005,\n    "consultation_date": "2026-08-01T09:45:00Z",\n    "symptoms": "Mild fever, cough",\n    "diagnosis": "Viral Infection",\n    "bp_systolic": 120,\n    "bp_diastolic": 80,\n    "temperature": 100.2,\n    "doctor_name": "Dr. Gregory House",\n    "patient_name": "Alice Wonder"\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success", type: "success" },
        { code: "200", label: "Consultation not found (success: 0)", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. Joins the `consultations`, `patients`, and `staff` tables."
    },
    {
      name: "Get Patient Clinical History",
      description: "Retrieves a timeline summary of a patient's past OPD consultations.",
      method: "POST",
      endpoint: "/opd/patient-history",
      parameters: "None",
      requestBody: `{\n  "patient_id": "number (required)",\n  "limit": "number (optional, default: 10)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "patient_id — @IsNotEmpty, @IsNumber."
      ],
      sampleRequest: `{\n  "patient_id": 2,\n  "limit": 5\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Patient history retrieved."\n  },\n  "data": {\n    "history": [\n      {\n        "consultation_id": 1005,\n        "date": "2026-08-01",\n        "doctor_name": "Dr. Gregory House",\n        "diagnosis": "Viral Infection"\n      },\n      {\n        "consultation_id": 842,\n        "date": "2026-03-15",\n        "doctor_name": "Dr. Sarah Smith",\n        "diagnosis": "Routine Checkup"\n      }\n    ]\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success", type: "success" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. Used by doctors to quickly review a patient's past visits before a new consultation."
    }
  ],
  "Laboratory": [
    {
      name: "Get Lab Orders List",
      description: "Retrieves a paginated list of lab test orders. Supports filtering by patient, doctor, test status, and date range.",
      method: "POST",
      endpoint: "/laboratory/list",
      parameters: "None",
      requestBody: `{\n  "page": "number (optional, default: 1)",\n  "limit": "number (optional, default: 10)",\n  "search": "string (optional)",\n  "filters": {\n    "patient_id": "number (optional)",\n    "doctor_id": "number (optional)",\n    "test_status": "string (optional, 'Pending', 'In Progress', 'Completed')",\n    "start_date": "string (optional, YYYY-MM-DD)",\n    "end_date": "string (optional, YYYY-MM-DD)"\n  }\n}`,
      validationRules: [
        "Authorization header with Bearer token is required."
      ],
      sampleRequest: `{\n  "page": 1,\n  "limit": 10,\n  "filters": {\n    "test_status": "Pending"\n  }\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Lab orders retrieved successfully."\n  },\n  "data": {\n    "lab_orders": [\n      {\n        "id": 301,\n        "patient_name": "Alice Wonder",\n        "mrn": "PT-2026-0002",\n        "test_name": "Complete Blood Count (CBC)",\n        "test_category": "Hematology",\n        "doctor_name": "Dr. Gregory House",\n        "order_date": "2026-08-01",\n        "test_status": "Pending"\n      }\n    ],\n    "total_records": 1\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success", type: "success" },
        { code: "401", label: "Unauthorized", type: "error" },
        { code: "500", label: "Internal Server Error", type: "error" }
      ],
      notes: "Protected route. Joins `lab_orders`, `patients`, `staff`, and `lab_tests` master tables."
    },
    {
      name: "Get Lab Order Details",
      description: "Retrieves the full details of a specific lab order including test parameters and results (if available).",
      method: "POST",
      endpoint: "/laboratory/details",
      parameters: "None",
      requestBody: `{\n  "id": "number (required)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "id — @IsNotEmpty, @IsNumber."
      ],
      sampleRequest: `{\n  "id": 301\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Lab order details retrieved."\n  },\n  "data": {\n    "id": 301,\n    "patient_id": 2,\n    "patient_name": "Alice Wonder",\n    "doctor_id": 12,\n    "doctor_name": "Dr. Gregory House",\n    "test_id": 5,\n    "test_name": "Complete Blood Count (CBC)",\n    "test_category": "Hematology",\n    "order_date": "2026-08-01",\n    "test_status": "Completed",\n    "results": [\n      { "parameter": "Hemoglobin", "value": "14.2", "unit": "g/dL", "normal_range": "12.0 - 17.5" },\n      { "parameter": "WBC Count", "value": "7500", "unit": "cells/mcL", "normal_range": "4500 - 11000" },\n      { "parameter": "Platelet Count", "value": "250000", "unit": "cells/mcL", "normal_range": "150000 - 400000" }\n    ],\n    "remarks": "All values within normal range.",\n    "completed_date": "2026-08-01T14:30:00Z"\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success", type: "success" },
        { code: "200", label: "Lab order not found (success: 0)", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. The `results` array is populated only after a lab technician submits the findings."
    },
    {
      name: "Create Lab Order",
      description: "Creates a new lab test order for a patient. Typically initiated by a doctor during a consultation.",
      method: "POST",
      endpoint: "/laboratory/add",
      parameters: "None",
      requestBody: `{\n  "patient_id": "number (required)",\n  "doctor_id": "number (required)",\n  "test_id": "number (required, from lab_tests master)",\n  "priority": "string (optional, 'Normal' or 'Urgent')",\n  "notes": "string (optional)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "patient_id — @IsNotEmpty, @IsNumber.",
        "doctor_id — @IsNotEmpty, @IsNumber.",
        "test_id — @IsNotEmpty, @IsNumber. Must exist in the lab_tests master table."
      ],
      sampleRequest: `{\n  "patient_id": 2,\n  "doctor_id": 12,\n  "test_id": 5,\n  "priority": "Normal",\n  "notes": "Routine annual checkup"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Lab order created successfully."\n  },\n  "data": {\n    "insert_id": 302\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success (success: 1)", type: "success" },
        { code: "400", label: "Validation Error / Invalid test_id", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" },
        { code: "500", label: "Internal Server Error", type: "error" }
      ],
      notes: "Protected route. Default `test_status` is set to 'Pending'. `added_by` and `added_date` are auto-populated."
    },
    {
      name: "Update Lab Results",
      description: "Submits or updates the test results for an existing lab order. Used by lab technicians after processing the sample.",
      method: "POST",
      endpoint: "/laboratory/update-results",
      parameters: "None",
      requestBody: `{\n  "id": "number (required, lab order ID)",\n  "results": [\n    {\n      "parameter": "string (required)",\n      "value": "string (required)",\n      "unit": "string (optional)",\n      "normal_range": "string (optional)"\n    }\n  ],\n  "remarks": "string (optional)",\n  "test_status": "string (required, 'In Progress' or 'Completed')"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "id — @IsNotEmpty, @IsNumber.",
        "results — Must be a valid array of parameter objects.",
        "test_status — Must be 'In Progress' or 'Completed'."
      ],
      sampleRequest: `{\n  "id": 302,\n  "results": [\n    { "parameter": "Hemoglobin", "value": "14.2", "unit": "g/dL", "normal_range": "12.0 - 17.5" },\n    { "parameter": "WBC Count", "value": "7500", "unit": "cells/mcL", "normal_range": "4500 - 11000" }\n  ],\n  "remarks": "Normal results",\n  "test_status": "Completed"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Lab results updated successfully."\n  },\n  "data": {}\n}`,
      statusCodes: [
        { code: "200", label: "Success (success: 1)", type: "success" },
        { code: "200", label: "Lab order not found (success: 0)", type: "error" },
        { code: "400", label: "Validation Error", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. When `test_status` is set to 'Completed', the `completed_date` is automatically populated with the current timestamp."
    },
    {
      name: "Delete Lab Order",
      description: "Soft deletes a lab order by setting `is_delete` to '1'. Only orders with status 'Pending' should be eligible for deletion.",
      method: "POST",
      endpoint: "/laboratory/delete",
      parameters: "None",
      requestBody: `{\n  "id": "number (required)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "id — @IsNotEmpty, @IsNumber.",
        "Order must have test_status = 'Pending' to be deletable."
      ],
      sampleRequest: `{\n  "id": 302\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Lab order deleted successfully."\n  },\n  "data": {}\n}`,
      statusCodes: [
        { code: "200", label: "Success (success: 1)", type: "success" },
        { code: "200", label: "Lab order not found (success: 0)", type: "error" },
        { code: "400", label: "Cannot delete (test already in progress/completed)", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. Soft delete only. Orders that are 'In Progress' or 'Completed' cannot be deleted to preserve medical record integrity."
    }
  ],
  "Pharmacy": [
    {
      name: "Get Medicines List",
      description: "Retrieves a paginated list of medicines in the pharmacy inventory. Supports search by name, generic name, or category.",
      method: "POST",
      endpoint: "/pharmacy/list",
      parameters: "None",
      requestBody: `{\n  "page": "number (optional, default: 1)",\n  "limit": "number (optional, default: 10)",\n  "search": "string (optional)",\n  "filters": {\n    "category_id": "number (optional)",\n    "manufacturer_id": "number (optional)",\n    "stock_status": "string (optional, 'In Stock', 'Low Stock', 'Out of Stock')"\n  },\n  "is_dropdown": "string (optional, '1' or '0')"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required."
      ],
      sampleRequest: `{\n  "page": 1,\n  "limit": 10,\n  "search": "Paracetamol"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Medicines list retrieved successfully."\n  },\n  "data": {\n    "medicines": [\n      {\n        "id": 101,\n        "medicine_name": "Paracetamol 500mg",\n        "generic_name": "Acetaminophen",\n        "category": "Analgesics",\n        "manufacturer": "PharmaCorp",\n        "stock_qty": 500,\n        "unit_price": 2.50,\n        "expiry_date": "2027-06-15",\n        "status": "Active"\n      }\n    ],\n    "total_records": 1\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success", type: "success" },
        { code: "401", label: "Unauthorized", type: "error" },
        { code: "500", label: "Internal Server Error", type: "error" }
      ],
      notes: "Protected route. `stock_status` is a computed field: 'Out of Stock' if qty = 0, 'Low Stock' if qty < threshold, 'In Stock' otherwise."
    },
    {
      name: "Get Medicine Details",
      description: "Retrieves the complete details of a specific medicine including batch info and pricing.",
      method: "POST",
      endpoint: "/pharmacy/details",
      parameters: "None",
      requestBody: `{\n  "id": "number (required)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "id — @IsNotEmpty, @IsNumber."
      ],
      sampleRequest: `{\n  "id": 101\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Medicine details retrieved."\n  },\n  "data": {\n    "id": 101,\n    "medicine_name": "Paracetamol 500mg",\n    "generic_name": "Acetaminophen",\n    "category_id": 3,\n    "category_name": "Analgesics",\n    "manufacturer_id": 5,\n    "manufacturer_name": "PharmaCorp",\n    "batch_number": "BATCH-2026-A1",\n    "stock_qty": 500,\n    "unit_price": 2.50,\n    "selling_price": 5.00,\n    "expiry_date": "2027-06-15",\n    "description": "Fever and pain relief tablet",\n    "status": "Active",\n    "added_date": "2026-01-10T08:00:00Z"\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success", type: "success" },
        { code: "200", label: "Medicine not found (success: 0)", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. Used by pharmacy staff to view full details or populate the edit form."
    },
    {
      name: "Add Medicine",
      description: "Adds a new medicine to the pharmacy inventory.",
      method: "POST",
      endpoint: "/pharmacy/add",
      parameters: "None",
      requestBody: `{\n  "medicine_name": "string (required)",\n  "generic_name": "string (optional)",\n  "category_id": "number (required)",\n  "manufacturer_id": "number (optional)",\n  "batch_number": "string (optional)",\n  "stock_qty": "number (required)",\n  "unit_price": "number (required)",\n  "selling_price": "number (required)",\n  "expiry_date": "string (required, YYYY-MM-DD)",\n  "description": "string (optional)",\n  "status": "string (optional, default: 'Active')"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "medicine_name — @IsNotEmpty, @IsString.",
        "category_id — @IsNotEmpty, @IsNumber.",
        "stock_qty — @IsNotEmpty, @IsNumber. Must be >= 0.",
        "unit_price, selling_price — @IsNotEmpty, @IsNumber.",
        "expiry_date — @IsNotEmpty. Must be a future date."
      ],
      sampleRequest: `{\n  "medicine_name": "Amoxicillin 250mg",\n  "generic_name": "Amoxicillin",\n  "category_id": 1,\n  "manufacturer_id": 5,\n  "batch_number": "BATCH-2026-B2",\n  "stock_qty": 200,\n  "unit_price": 3.00,\n  "selling_price": 6.50,\n  "expiry_date": "2027-12-31"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Medicine added successfully."\n  },\n  "data": {\n    "insert_id": 102\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success (success: 1)", type: "success" },
        { code: "400", label: "Validation Error", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" },
        { code: "500", label: "Internal Server Error", type: "error" }
      ],
      notes: "Protected route. `added_by` and `added_date` are automatically set."
    },
    {
      name: "Update Medicine",
      description: "Updates the details of an existing medicine in the pharmacy inventory.",
      method: "POST",
      endpoint: "/pharmacy/update",
      parameters: "None",
      requestBody: `{\n  "id": "number (required)",\n  "medicine_name": "string (optional)",\n  "generic_name": "string (optional)",\n  "category_id": "number (optional)",\n  "manufacturer_id": "number (optional)",\n  "batch_number": "string (optional)",\n  "unit_price": "number (optional)",\n  "selling_price": "number (optional)",\n  "expiry_date": "string (optional)",\n  "description": "string (optional)",\n  "status": "string (optional)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "id — @IsNumber. Required to identify the medicine."
      ],
      sampleRequest: `{\n  "id": 102,\n  "selling_price": 7.00,\n  "description": "Antibiotic capsule"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Medicine updated successfully."\n  },\n  "data": {}\n}`,
      statusCodes: [
        { code: "200", label: "Success (success: 1)", type: "success" },
        { code: "200", label: "Medicine not found (success: 0)", type: "error" },
        { code: "400", label: "Validation Error", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. Only provided fields are updated. Use the dedicated stock update API to adjust quantities."
    },
    {
      name: "Update Stock",
      description: "Adjusts the stock quantity of a medicine. Used when receiving new stock from suppliers or correcting inventory counts.",
      method: "POST",
      endpoint: "/pharmacy/update-stock",
      parameters: "None",
      requestBody: `{\n  "id": "number (required, medicine ID)",\n  "adjustment_type": "string (required, 'add' or 'subtract')",\n  "quantity": "number (required, must be > 0)",\n  "reason": "string (optional, e.g., 'New shipment', 'Damaged', 'Expired')"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "id — @IsNotEmpty, @IsNumber.",
        "adjustment_type — Must be 'add' or 'subtract'.",
        "quantity — @IsNotEmpty, @IsNumber. Must be greater than 0.",
        "Resulting stock after subtraction must not go below 0."
      ],
      sampleRequest: `{\n  "id": 101,\n  "adjustment_type": "add",\n  "quantity": 100,\n  "reason": "New shipment received"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Stock updated. New quantity: 600."\n  },\n  "data": {\n    "new_stock_qty": 600\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success (success: 1)", type: "success" },
        { code: "200", label: "Medicine not found (success: 0)", type: "error" },
        { code: "400", label: "Insufficient stock for subtraction", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. Each adjustment should ideally be logged in a `stock_transactions` audit table for traceability."
    },
    {
      name: "Dispense Medicine",
      description: "Records the dispensing of a medicine to a patient, reducing the stock quantity accordingly. Linked to a prescription or OPD consultation.",
      method: "POST",
      endpoint: "/pharmacy/dispense",
      parameters: "None",
      requestBody: `{\n  "patient_id": "number (required)",\n  "medicine_id": "number (required)",\n  "quantity": "number (required)",\n  "prescription_id": "number (optional)",\n  "dosage_instructions": "string (optional)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "patient_id — @IsNotEmpty, @IsNumber.",
        "medicine_id — @IsNotEmpty, @IsNumber.",
        "quantity — @IsNotEmpty, @IsNumber. Must be > 0 and <= available stock."
      ],
      sampleRequest: `{\n  "patient_id": 2,\n  "medicine_id": 101,\n  "quantity": 10,\n  "prescription_id": 55,\n  "dosage_instructions": "1 tablet 3x daily after meals"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Medicine dispensed successfully. Remaining stock: 490."\n  },\n  "data": {\n    "dispense_id": 801,\n    "remaining_stock": 490\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success (success: 1)", type: "success" },
        { code: "400", label: "Insufficient stock / Validation Error", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" },
        { code: "500", label: "Internal Server Error", type: "error" }
      ],
      notes: "Protected route. Automatically decrements `stock_qty`. Can be linked to billing for auto-charging the patient."
    },
    {
      name: "Delete Medicine",
      description: "Soft deletes a medicine from the inventory by setting `is_delete` to '1'.",
      method: "POST",
      endpoint: "/pharmacy/delete",
      parameters: "None",
      requestBody: `{\n  "id": "number (required)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "id — @IsNotEmpty, @IsNumber."
      ],
      sampleRequest: `{\n  "id": 102\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Medicine deleted successfully."\n  },\n  "data": {}\n}`,
      statusCodes: [
        { code: "200", label: "Success (success: 1)", type: "success" },
        { code: "200", label: "Medicine not found (success: 0)", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. Soft delete only. Existing dispense records remain intact for billing and audit purposes."
    }
  ],
  "Wards": [
    {
      name: "Get Wards List",
      description: "Retrieves a paginated list of hospital wards/rooms with their current occupancy status.",
      method: "POST",
      endpoint: "/wards/list",
      parameters: "None",
      requestBody: `{\n  "page": "number (optional, default: 1)",\n  "limit": "number (optional, default: 10)",\n  "search": "string (optional)",\n  "filters": {\n    "ward_type": "string (optional, e.g., 'General', 'ICU', 'Private')",\n    "department_id": "number (optional)"\n  },\n  "is_dropdown": "string (optional, '1' or '0')"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required."
      ],
      sampleRequest: `{\n  "page": 1,\n  "limit": 10,\n  "filters": {\n    "ward_type": "ICU"\n  }\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Wards list retrieved successfully."\n  },\n  "data": {\n    "wards": [\n      {\n        "id": 1,\n        "ward_name": "ICU Ward A",\n        "ward_type": "ICU",\n        "department_name": "Critical Care",\n        "total_beds": 10,\n        "occupied_beds": 7,\n        "available_beds": 3,\n        "status": "Active"\n      }\n    ],\n    "total_records": 1\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success", type: "success" },
        { code: "401", label: "Unauthorized", type: "error" },
        { code: "500", label: "Internal Server Error", type: "error" }
      ],
      notes: "Protected route. `occupied_beds` and `available_beds` are computed from the `beds` table in real-time."
    },
    {
      name: "Get Ward Details",
      description: "Retrieves the full details of a specific ward including its bed layout and current patient assignments.",
      method: "POST",
      endpoint: "/wards/details",
      parameters: "None",
      requestBody: `{\n  "id": "number (required)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "id — @IsNotEmpty, @IsNumber."
      ],
      sampleRequest: `{\n  "id": 1\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Ward details retrieved."\n  },\n  "data": {\n    "id": 1,\n    "ward_name": "ICU Ward A",\n    "ward_type": "ICU",\n    "department_id": 5,\n    "department_name": "Critical Care",\n    "floor": "2nd Floor",\n    "total_beds": 10,\n    "charge_per_day": 5000.00,\n    "status": "Active",\n    "beds": [\n      { "bed_id": 1, "bed_number": "ICU-A-01", "bed_status": "Occupied", "patient_name": "John Doe" },\n      { "bed_id": 2, "bed_number": "ICU-A-02", "bed_status": "Available", "patient_name": null },\n      { "bed_id": 3, "bed_number": "ICU-A-03", "bed_status": "Maintenance", "patient_name": null }\n    ]\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success", type: "success" },
        { code: "200", label: "Ward not found (success: 0)", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. The `beds` array includes each bed's current status and the assigned patient (if occupied)."
    },
    {
      name: "Add Ward",
      description: "Creates a new ward in the hospital system.",
      method: "POST",
      endpoint: "/wards/add",
      parameters: "None",
      requestBody: `{\n  "ward_name": "string (required)",\n  "ward_type": "string (required, 'General', 'Semi-Private', 'Private', 'ICU', 'NICU')",\n  "department_id": "number (optional)",\n  "floor": "string (optional)",\n  "total_beds": "number (required)",\n  "charge_per_day": "number (required)",\n  "status": "string (optional, default: 'Active')"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "ward_name — @IsNotEmpty, @IsString.",
        "ward_type — @IsNotEmpty, @IsString.",
        "total_beds — @IsNotEmpty, @IsNumber. Must be >= 1.",
        "charge_per_day — @IsNotEmpty, @IsNumber."
      ],
      sampleRequest: `{\n  "ward_name": "General Ward B",\n  "ward_type": "General",\n  "department_id": 1,\n  "floor": "1st Floor",\n  "total_beds": 20,\n  "charge_per_day": 1000.00\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Ward added successfully."\n  },\n  "data": {\n    "insert_id": 5\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success (success: 1)", type: "success" },
        { code: "400", label: "Validation Error / Ward name exists", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" },
        { code: "500", label: "Internal Server Error", type: "error" }
      ],
      notes: "Protected route. The backend should auto-generate corresponding bed records in the `beds` table based on `total_beds`."
    },
    {
      name: "Update Ward",
      description: "Updates the details of an existing ward.",
      method: "POST",
      endpoint: "/wards/update",
      parameters: "None",
      requestBody: `{\n  "id": "number (required)",\n  "ward_name": "string (optional)",\n  "ward_type": "string (optional)",\n  "department_id": "number (optional)",\n  "floor": "string (optional)",\n  "charge_per_day": "number (optional)",\n  "status": "string (optional)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "id — @IsNumber. Required to identify the ward."
      ],
      sampleRequest: `{\n  "id": 5,\n  "charge_per_day": 1200.00\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Ward updated successfully."\n  },\n  "data": {}\n}`,
      statusCodes: [
        { code: "200", label: "Success (success: 1)", type: "success" },
        { code: "200", label: "Ward not found (success: 0)", type: "error" },
        { code: "400", label: "Validation Error", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. `total_beds` is not updatable here to prevent orphaning existing bed records. Use dedicated bed management APIs instead."
    },
    {
      name: "Delete Ward",
      description: "Soft deletes a ward by setting `is_delete` to '1'. Only wards with no occupied beds can be deleted.",
      method: "POST",
      endpoint: "/wards/delete",
      parameters: "None",
      requestBody: `{\n  "id": "number (required)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "id — @IsNotEmpty, @IsNumber.",
        "Ward must have 0 occupied beds to be deletable."
      ],
      sampleRequest: `{\n  "id": 5\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Ward deleted successfully."\n  },\n  "data": {}\n}`,
      statusCodes: [
        { code: "200", label: "Success (success: 1)", type: "success" },
        { code: "200", label: "Ward not found (success: 0)", type: "error" },
        { code: "400", label: "Cannot delete (occupied beds exist)", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. Soft delete only. Also soft-deletes associated bed records."
    },
    {
      name: "Get Beds List",
      description: "Retrieves the list of beds for a specific ward, or all beds across the hospital. Shows real-time availability.",
      method: "POST",
      endpoint: "/wards/beds-list",
      parameters: "None",
      requestBody: `{\n  "ward_id": "number (optional, filter by ward)",\n  "bed_status": "string (optional, 'Available', 'Occupied', 'Maintenance')"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required."
      ],
      sampleRequest: `{\n  "ward_id": 1,\n  "bed_status": "Available"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Beds list retrieved."\n  },\n  "data": {\n    "beds": [\n      {\n        "bed_id": 2,\n        "bed_number": "ICU-A-02",\n        "ward_name": "ICU Ward A",\n        "bed_status": "Available"\n      },\n      {\n        "bed_id": 5,\n        "bed_number": "ICU-A-05",\n        "ward_name": "ICU Ward A",\n        "bed_status": "Available"\n      }\n    ]\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success", type: "success" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. Essential for the IPD admission flow — used to show available beds when admitting a patient."
    },
    {
      name: "Admit Patient (Bed Assignment)",
      description: "Assigns a patient to an available bed in a ward, marking the bed as 'Occupied' and creating an admission record.",
      method: "POST",
      endpoint: "/wards/admit",
      parameters: "None",
      requestBody: `{\n  "patient_id": "number (required)",\n  "bed_id": "number (required)",\n  "doctor_id": "number (required)",\n  "admission_date": "string (required, YYYY-MM-DD)",\n  "diagnosis": "string (optional)",\n  "notes": "string (optional)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "patient_id — @IsNotEmpty, @IsNumber.",
        "bed_id — @IsNotEmpty, @IsNumber. Bed must have status 'Available'.",
        "doctor_id — @IsNotEmpty, @IsNumber.",
        "admission_date — @IsNotEmpty."
      ],
      sampleRequest: `{\n  "patient_id": 2,\n  "bed_id": 2,\n  "doctor_id": 12,\n  "admission_date": "2026-08-01",\n  "diagnosis": "Post-surgery observation"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Patient admitted successfully."\n  },\n  "data": {\n    "admission_id": 401\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success (success: 1)", type: "success" },
        { code: "400", label: "Bed not available / Validation Error", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" },
        { code: "500", label: "Internal Server Error", type: "error" }
      ],
      notes: "Protected route. Automatically updates the bed's status to 'Occupied'. Creates an entry in the `admissions` table."
    },
    {
      name: "Discharge Patient",
      description: "Discharges a patient from their assigned bed, freeing the bed and closing the admission record.",
      method: "POST",
      endpoint: "/wards/discharge",
      parameters: "None",
      requestBody: `{\n  "admission_id": "number (required)",\n  "discharge_date": "string (required, YYYY-MM-DD)",\n  "discharge_notes": "string (optional)",\n  "discharge_summary": "string (optional)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "admission_id — @IsNotEmpty, @IsNumber.",
        "discharge_date — @IsNotEmpty. Must be >= admission_date."
      ],
      sampleRequest: `{\n  "admission_id": 401,\n  "discharge_date": "2026-08-05",\n  "discharge_notes": "Patient recovered fully.",\n  "discharge_summary": "Post-surgery recovery was uneventful."\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Patient discharged successfully."\n  },\n  "data": {\n    "total_days": 4,\n    "total_ward_charges": 20000.00\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success (success: 1)", type: "success" },
        { code: "200", label: "Admission not found (success: 0)", type: "error" },
        { code: "400", label: "Invalid discharge date", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. Automatically sets bed status back to 'Available'. Calculates total charges based on `charge_per_day × total_days` and can push to the Billing module."
    }
  ],
  "Billing": [
    {
      name: "Get Invoices List",
      description: "Retrieves a paginated list of billing invoices. Supports filtering by patient, payment status, and date range.",
      method: "POST",
      endpoint: "/billing/list",
      parameters: "None",
      requestBody: `{\n  "page": "number (optional, default: 1)",\n  "limit": "number (optional, default: 10)",\n  "search": "string (optional, patient name or invoice number)",\n  "filters": {\n    "patient_id": "number (optional)",\n    "payment_status": "string (optional, 'Paid', 'Unpaid', 'Partial')",\n    "start_date": "string (optional, YYYY-MM-DD)",\n    "end_date": "string (optional, YYYY-MM-DD)"\n  }\n}`,
      validationRules: [
        "Authorization header with Bearer token is required."
      ],
      sampleRequest: `{\n  "page": 1,\n  "limit": 10,\n  "filters": {\n    "payment_status": "Unpaid"\n  }\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Invoices retrieved successfully."\n  },\n  "data": {\n    "invoices": [\n      {\n        "id": 1001,\n        "invoice_number": "INV-2026-0001",\n        "patient_name": "Alice Wonder",\n        "mrn": "PT-2026-0002",\n        "total_amount": 15500.00,\n        "paid_amount": 0.00,\n        "balance_due": 15500.00,\n        "payment_status": "Unpaid",\n        "invoice_date": "2026-08-05"\n      }\n    ],\n    "total_records": 1\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success", type: "success" },
        { code: "401", label: "Unauthorized", type: "error" },
        { code: "500", label: "Internal Server Error", type: "error" }
      ],
      notes: "Protected route. `payment_status` is computed: 'Paid' if paid_amount >= total_amount, 'Partial' if paid_amount > 0, 'Unpaid' otherwise."
    },
    {
      name: "Get Invoice Details",
      description: "Retrieves the full breakdown of a specific invoice including all line items (consultation, lab, pharmacy, ward charges).",
      method: "POST",
      endpoint: "/billing/details",
      parameters: "None",
      requestBody: `{\n  "id": "number (required)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "id — @IsNotEmpty, @IsNumber."
      ],
      sampleRequest: `{\n  "id": 1001\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Invoice details retrieved."\n  },\n  "data": {\n    "id": 1001,\n    "invoice_number": "INV-2026-0001",\n    "patient_id": 2,\n    "patient_name": "Alice Wonder",\n    "mrn": "PT-2026-0002",\n    "invoice_date": "2026-08-05",\n    "due_date": "2026-08-15",\n    "line_items": [\n      { "description": "OPD Consultation - Dr. House", "amount": 500.00 },\n      { "description": "CBC Lab Test", "amount": 350.00 },\n      { "description": "Paracetamol 500mg x10", "amount": 50.00 },\n      { "description": "ICU Ward A - 4 days @ 5000/day", "amount": 20000.00 }\n    ],\n    "subtotal": 20900.00,\n    "discount": 500.00,\n    "tax": 0.00,\n    "total_amount": 20400.00,\n    "paid_amount": 5000.00,\n    "balance_due": 15400.00,\n    "payment_status": "Partial",\n    "payments": [\n      { "payment_id": 201, "amount": 5000.00, "method": "Cash", "date": "2026-08-05T10:00:00Z" }\n    ]\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success", type: "success" },
        { code: "200", label: "Invoice not found (success: 0)", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. The `line_items` array aggregates charges from consultations, lab orders, pharmacy dispenses, and ward stays."
    },
    {
      name: "Generate Invoice",
      description: "Creates a new billing invoice for a patient. Line items can be manually added or auto-populated from pending charges.",
      method: "POST",
      endpoint: "/billing/generate",
      parameters: "None",
      requestBody: `{\n  "patient_id": "number (required)",\n  "line_items": [\n    {\n      "description": "string (required)",\n      "amount": "number (required)"\n    }\n  ],\n  "discount": "number (optional, default: 0)",\n  "tax": "number (optional, default: 0)",\n  "due_date": "string (optional, YYYY-MM-DD)",\n  "notes": "string (optional)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "patient_id — @IsNotEmpty, @IsNumber.",
        "line_items — Must be a non-empty array.",
        "Each line_item must have description (@IsString) and amount (@IsNumber, > 0)."
      ],
      sampleRequest: `{\n  "patient_id": 2,\n  "line_items": [\n    { "description": "OPD Consultation", "amount": 500.00 },\n    { "description": "Blood Test - CBC", "amount": 350.00 }\n  ],\n  "discount": 50.00,\n  "due_date": "2026-08-15"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Invoice generated successfully."\n  },\n  "data": {\n    "invoice_id": 1002,\n    "invoice_number": "INV-2026-0002",\n    "total_amount": 800.00\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success (success: 1)", type: "success" },
        { code: "400", label: "Validation Error / Empty line items", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" },
        { code: "500", label: "Internal Server Error", type: "error" }
      ],
      notes: "Protected route. `invoice_number` is auto-generated (e.g., INV-YYYY-XXXX). `total_amount = sum(line_items) - discount + tax`."
    },
    {
      name: "Record Payment",
      description: "Records a payment against an existing invoice. Supports partial and full payments via multiple methods.",
      method: "POST",
      endpoint: "/billing/record-payment",
      parameters: "None",
      requestBody: `{\n  "invoice_id": "number (required)",\n  "amount": "number (required)",\n  "payment_method": "string (required, 'Cash', 'Card', 'UPI', 'Bank Transfer', 'Insurance')",\n  "transaction_ref": "string (optional)",\n  "notes": "string (optional)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "invoice_id — @IsNotEmpty, @IsNumber.",
        "amount — @IsNotEmpty, @IsNumber. Must be > 0 and <= balance_due.",
        "payment_method — @IsNotEmpty, @IsString."
      ],
      sampleRequest: `{\n  "invoice_id": 1001,\n  "amount": 10400.00,\n  "payment_method": "Card",\n  "transaction_ref": "TXN-8834567"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Payment recorded successfully."\n  },\n  "data": {\n    "payment_id": 202,\n    "new_paid_amount": 15400.00,\n    "new_balance_due": 0.00,\n    "payment_status": "Paid"\n  }\n}`,
      statusCodes: [
        { code: "200", label: "Success (success: 1)", type: "success" },
        { code: "200", label: "Invoice not found (success: 0)", type: "error" },
        { code: "400", label: "Amount exceeds balance / Validation Error", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. Automatically updates the invoice's `paid_amount`, `balance_due`, and `payment_status`. Multiple payments can be recorded against one invoice."
    },
    {
      name: "Download Invoice PDF",
      description: "Generates and returns a downloadable PDF version of the invoice for printing or sharing with the patient.",
      method: "POST",
      endpoint: "/billing/download-pdf",
      parameters: "None",
      requestBody: `{\n  "invoice_id": "number (required)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "invoice_id — @IsNotEmpty, @IsNumber."
      ],
      sampleRequest: `{\n  "invoice_id": 1001\n}`,
      sampleResponse: `Binary PDF file stream\n\nResponse Headers:\n  Content-Type: application/pdf\n  Content-Disposition: attachment; filename="INV-2026-0001.pdf"`,
      statusCodes: [
        { code: "200", label: "PDF file returned", type: "success" },
        { code: "200", label: "Invoice not found (success: 0)", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" },
        { code: "500", label: "PDF generation error", type: "error" }
      ],
      notes: "Protected route. Returns a binary PDF stream, not a standard JSON response. The frontend should handle the response as a Blob download."
    },
    {
      name: "Cancel Invoice",
      description: "Cancels an unpaid or partially paid invoice. Fully paid invoices cannot be cancelled — use refund flow instead.",
      method: "POST",
      endpoint: "/billing/cancel",
      parameters: "None",
      requestBody: `{\n  "invoice_id": "number (required)",\n  "cancellation_reason": "string (required)"\n}`,
      validationRules: [
        "Authorization header with Bearer token is required.",
        "invoice_id — @IsNotEmpty, @IsNumber.",
        "cancellation_reason — @IsNotEmpty, @IsString.",
        "Invoice must not have payment_status = 'Paid'."
      ],
      sampleRequest: `{\n  "invoice_id": 1002,\n  "cancellation_reason": "Duplicate invoice created by mistake"\n}`,
      sampleResponse: `{\n  "settings": {\n    "status": 200,\n    "success": 1,\n    "message": "Invoice cancelled successfully."\n  },\n  "data": {}\n}`,
      statusCodes: [
        { code: "200", label: "Success (success: 1)", type: "success" },
        { code: "200", label: "Invoice not found (success: 0)", type: "error" },
        { code: "400", label: "Cannot cancel (fully paid)", type: "error" },
        { code: "401", label: "Unauthorized", type: "error" }
      ],
      notes: "Protected route. Sets invoice status to 'Cancelled'. Any partial payments already recorded should be flagged for refund processing."
    }
  ]
};

// Helper: format a single API object into shareable plain text
function formatApiAsText(api) {
  let text = '';
  text += `API Name: ${api.name}\n`;
  text += `──────────────────────────────────────\n`;
  text += `Endpoint URL: ${api.endpoint}\n`;
  text += `HTTP Method: ${api.method}\n`;
  text += `Description: ${api.description}\n\n`;
  text += `Request Parameters:\n${api.parameters}\n\n`;
  text += `Request Body:\n${api.requestBody}\n\n`;
  if (api.validationRules && api.validationRules.length > 0) {
    text += `Validation Rules:\n`;
    api.validationRules.forEach((r, i) => { text += `  ${i + 1}. ${r}\n`; });
    text += `\n`;
  }
  text += `Sample Request:\n${api.sampleRequest}\n\n`;
  text += `Sample Response:\n${api.sampleResponse}\n\n`;
  if (api.statusCodes && api.statusCodes.length > 0) {
    text += `Status Codes:\n`;
    api.statusCodes.forEach(s => { text += `  ${s.code} — ${s.label}\n`; });
    text += `\n`;
  }
  if (api.notes) {
    text += `Notes:\n${api.notes}\n`;
  }
  return text;
}

// Accordion API Card Component
const ApiAccordionCard = ({ api, isOpen, onToggle }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    const text = formatApiAsText(api);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const methodColors = {
    'POST': 'bg-blue-500/15 text-blue-600 border-blue-300',
    'GET': 'bg-emerald-500/15 text-emerald-600 border-emerald-300',
    'PUT': 'bg-amber-500/15 text-amber-600 border-amber-300',
    'DELETE': 'bg-red-500/15 text-red-600 border-red-300',
    'PATCH': 'bg-purple-500/15 text-purple-600 border-purple-300',
    'ALL': 'bg-gray-500/15 text-gray-600 border-gray-300',
  };

  return (
    <div className="border border-outline-variant rounded-xl overflow-hidden mb-3 shadow-sm">
      {/* Accordion Header */}
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-4 text-left transition-colors duration-200 ${isOpen ? 'bg-surface-container-low' : 'bg-surface-container-lowest hover:bg-surface-container-low/60'}`}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className={`px-2.5 py-1 text-[11px] font-bold rounded-md border shrink-0 ${methodColors[api.method] || methodColors['ALL']}`}>
            {api.method}
          </span>
          <span className="font-mono text-sm text-on-surface-variant truncate">{api.endpoint}</span>
          <span className="hidden sm:inline text-sm font-semibold text-on-surface truncate">— {api.name}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          {/* Copy Button */}
          <span
            onClick={handleCopy}
            title="Copy API details"
            className={`material-symbols-outlined text-[20px] p-1.5 rounded-lg transition-all cursor-pointer ${copied ? 'text-emerald-600 bg-emerald-500/10' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary'}`}
          >
            {copied ? 'check_circle' : 'content_copy'}
          </span>
          <span className={`material-symbols-outlined text-[20px] text-on-surface-variant transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            expand_more
          </span>
        </div>
      </button>

      {/* Accordion Body */}
      {isOpen && (
        <div className="border-t border-outline-variant bg-surface-container-lowest">
          {/* Description bar */}
          <div className="px-5 py-3 bg-surface-container-low/40 border-b border-outline-variant/50">
            <p className="text-sm text-on-surface-variant">{api.description}</p>
          </div>

          <div className="p-5 space-y-5">
            {/* Endpoint */}
            <div>
              <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">link</span>
                Endpoint URL
              </h4>
              <div className="flex items-center bg-surface-container text-on-surface text-sm rounded-lg border border-outline-variant px-4 py-3 font-mono overflow-x-auto">
                {api.endpoint}
              </div>
            </div>

            {/* Request Params & Body */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div>
                <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">tune</span>
                  Request Parameters
                </h4>
                <div className="p-4 bg-surface-container rounded-lg border border-outline-variant text-on-surface-variant text-sm">
                  {api.parameters === "None" || api.parameters === "None (Header-based)"
                    ? <span className="italic">{api.parameters === "None" ? "No parameters required" : api.parameters}</span>
                    : <pre className="font-mono text-left w-full whitespace-pre-wrap">{api.parameters}</pre>
                  }
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">data_object</span>
                  Request Body
                </h4>
                <div className="p-4 bg-surface-container rounded-lg border border-outline-variant text-on-surface-variant text-sm">
                  {api.requestBody === "None"
                    ? <span className="italic">No request body required</span>
                    : <pre className="font-mono text-left w-full whitespace-pre-wrap">{api.requestBody}</pre>
                  }
                </div>
              </div>
            </div>

            {/* Validation */}
            {api.validationRules && api.validationRules.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">fact_check</span>
                  Validation Rules
                </h4>
                <div className="p-4 bg-surface-container rounded-lg border border-outline-variant text-sm">
                  <ul className="list-inside list-disc space-y-1 text-on-surface-variant">
                    {api.validationRules.map((rule, idx) => (
                      <li key={idx}>{rule}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Samples */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div>
                <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">input</span>
                  Sample Request
                </h4>
                <pre className="p-4 bg-surface-container-highest text-on-surface text-sm rounded-lg border border-outline-variant overflow-x-auto font-mono custom-scrollbar whitespace-pre-wrap">
{api.sampleRequest}
                </pre>
              </div>
              <div>
                <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">output</span>
                  Sample Response
                </h4>
                <pre className="p-4 bg-surface-container-highest text-on-surface text-sm rounded-lg border border-outline-variant overflow-x-auto font-mono custom-scrollbar whitespace-pre-wrap">
{api.sampleResponse}
                </pre>
              </div>
            </div>

            {/* Status Codes */}
            {api.statusCodes && api.statusCodes.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">traffic</span>
                  Status Codes
                </h4>
                <div className="p-4 bg-surface-container rounded-lg border border-outline-variant">
                  <div className="flex flex-col gap-2 text-sm">
                    {api.statusCodes.map((status, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded font-bold min-w-[3rem] text-center ${status.type === 'success' ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
                          {status.code}
                        </span>
                        <span className="text-on-surface">{status.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            {api.notes && (
              <div>
                <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">note</span>
                  Notes
                </h4>
                <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant text-sm text-on-surface-variant">
                  {api.notes}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function ApiDocumentationPage() {
  const [activeModule, setActiveModule] = useState(modulesList[0]);
  const [openAccordion, setOpenAccordion] = useState(0);
  const [copiedAll, setCopiedAll] = useState(false);

  const activeApis = apiData[activeModule] || [];

  const handleModuleChange = (mod) => {
    setActiveModule(mod);
    setOpenAccordion(0);
  };

  const handleCopyAll = () => {
    if (activeApis.length === 0) return;
    const header = `===== ${activeModule} Module — API Documentation =====\n\n`;
    const allText = activeApis.map((api, i) => `[${i + 1}] ${formatApiAsText(api)}`).join('\n────────────────────────────────────────\n\n');
    navigator.clipboard.writeText(header + allText).then(() => {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-outline-variant bg-surface-container-low shrink-0">
        <h1 className="text-2xl font-bold text-primary">API Documentation</h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Comprehensive guide to the Hospital Management System backend APIs by module.
        </p>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">

        {/* Left Sidebar - Module List */}
        <div className="w-full md:w-64 border-r border-outline-variant bg-surface-container-low/50 overflow-y-auto custom-scrollbar flex-shrink-0">
          <ul className="p-3 space-y-1">
            {modulesList.map((mod) => {
              const count = (apiData[mod] || []).length;
              return (
                <li key={mod}>
                  <button
                    onClick={() => handleModuleChange(mod)}
                    className={`w-full text-left px-4 py-3 md:py-2 rounded-lg transition-colors text-sm font-medium flex items-center justify-between ${
                      activeModule === mod
                        ? "bg-primary text-on-primary shadow-sm"
                        : "text-on-surface-variant hover:bg-surface-container-high"
                    }`}
                  >
                    <span>{mod}</span>
                    <span className="flex items-center gap-1.5">
                      {count > 0 && (
                        <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${activeModule === mod ? 'bg-white/20' : 'bg-primary/10 text-primary'}`}>
                          {count}
                        </span>
                      )}
                      {activeModule === mod && (
                        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right Content - API Details */}
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto custom-scrollbar bg-surface-container-lowest">
          <div className="max-w-4xl mx-auto">

            {/* Module Header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined">api</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-on-surface">{activeModule} APIs</h2>
                  {activeApis.length > 0 && (
                    <p className="text-xs text-on-surface-variant mt-0.5">{activeApis.length} endpoint{activeApis.length > 1 ? 's' : ''} documented</p>
                  )}
                </div>
              </div>

              {activeApis.length > 0 && (
                <button
                  onClick={handleCopyAll}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                    copiedAll
                      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-300'
                      : 'bg-surface-container-low text-on-surface-variant border-outline-variant hover:bg-surface-container-high hover:text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{copiedAll ? 'check_circle' : 'copy_all'}</span>
                  {copiedAll ? 'Copied All!' : 'Copy All APIs'}
                </button>
              )}
            </div>

            {/* API Accordions */}
            {activeApis.length > 0 ? (
              activeApis.map((api, idx) => (
                <ApiAccordionCard
                  key={idx}
                  api={api}
                  isOpen={openAccordion === idx}
                  onToggle={() => setOpenAccordion(openAccordion === idx ? -1 : idx)}
                />
              ))
            ) : (
              <div className="bg-surface-container-lowest border border-outline-variant border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-4xl text-outline-variant mb-4">construction</span>
                <h3 className="text-lg font-bold text-on-surface mb-2">Documentation Pending</h3>
                <p className="text-sm text-on-surface-variant max-w-md mx-auto">
                  The API documentation for the <strong>{activeModule}</strong> module is currently being authored and will be published soon.
                </p>
              </div>
            )}

            {activeApis.length > 0 && (
              <div className="text-center py-4">
                <p className="text-sm text-on-surface-variant italic flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  End of {activeModule} endpoints
                </p>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
