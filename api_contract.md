# Kibox Backend API Contract

Base URL: `/api/v1`

## Authentication (`/auth`)

### 1. Signup
Create a new user account.

*   **Endpoint:** `POST /auth/signup`
*   **Request Body:**
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "securepassword123"
    }
    ```
*   **Success Response (201 Created):**
    ```json
    {
      "success": true,
      "message": "User registered successfully. Please verify your email with the OTP sent."
    }
    ```
*   **Error Response (400 Bad Request / 409 Conflict):**
    ```json
    {
      "success": false,
      "message": "Email already registered" // or "Email, username, and password are required"
    }
    ```

### 2. Signin
Authenticate an existing user.

*   **Endpoint:** `POST /auth/signin`
*   **Request Body:**
    ```json
    {
      "email": "john@example.com",
      "password": "securepassword123"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "User logged in successfully",
      "data": {
        "user": {
          "_id": "60d5ec49f1b2c821c8f1c8f1",
          "name": "John Doe",
          "email": "john@example.com",
          "emailVerified": false,
          "createdAt": "2021-06-25T10:00:00.000Z",
          "__v": 0
        },
        "token": "jwt_token_string" 
      }
    }
    ```
*   **Error Response (400 Bad Request):**
    ```json
    {
      "success": false,
      "message": "Invalid password" // or "User not found", "Email and password are required"
    }
    ```

### 3. Forgot Password
Initiate password reset process.

*   **Endpoint:** `POST /auth/forgot-password`
*   **Request Body:**
    ```json
    {
      "email": "john@example.com"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "message": "If the email exists, a reset code has been sent"
    }
    ```
*   **Error Response (400 Bad Request):**
    ```json
    {
      "message": "Email is required"
    }
    ```

### 4. Reset Password
Complete password reset using token and new password.

*   **Endpoint:** `POST /auth/reset-password`
*   **Request Body:**
    ```json
    {
      "resetToken": "jwt_reset_token",
      "newPassword": "newsecurepassword123"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "message": "Password reset successful"
    }
    ```
*   **Error Response (400 Bad Request):**
    ```json
    {
      "message": "Reset token and new password are required" // or invalid token/expired
    }
    ```

---

## Email Verification (`/email`)

### 1. Resend OTP
Resend email verification OTP.

*   **Endpoint:** `POST /email/resend-otp`
*   **Request Body:**
    ```json
    {
      "email": "john@example.com"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "message": "Verification OTP sent"
    }
    ```
    *Note: If the email is not found, it returns "If the email exists, a verification code has been sent" to prevent enumeration.*

*   **Error Response (400 Bad Request):**
    ```json
    {
      "message": "Email already verified" // or "Email is required"
    }
    ```

### 2. Verify OTP
Verify email using OTP.

*   **Endpoint:** `POST /email/verify-otp`
*   **Request Body:**
    ```json
    {
      "email": "john@example.com",
      "otp": "123456"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "message": "Email verified successfully" // Actual message from service
    }
    ```
*   **Error Response (400 Bad Request):**
    ```json
    {
      "message": "Invalid OTP" // or "Email and OTP are required"
    }
    ```

### 3. Verify Reset OTP
Verify OTP for password reset (intermediate step before resetting password).

*   **Endpoint:** `POST /email/verify-reset-otp`
*   **Request Body:**
    ```json
    {
      "email": "john@example.com",
      "otp": "123456"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "message": "OTP verified successfully",
      "resetToken": "jwt_reset_token_valid_for_20m"
    }
    ```
*   **Error Response (400 Bad Request):**
    ```json
    {
      "message": "Invalid OTP or user not found"
    }
    ```

---

## Device Management (`/device`)

### 1. Update Weight
Update the weight of a box.

*   **Endpoint:** `POST /device/weight`
*   **Request Body:**
    ```json
    {
      "boxId": "BOX12345",
      "weight": 500 // grams
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Weight updated successfully",
      "data": {
        "boxId": "BOX12345",
        "currentWeight": 500,
        "maxWeight": 1000,
        "exceeded": false
      }
    }
    ```
*   **Warning Response (400 Bad Request - but valid logic):**
    If weight exceeds max weight:
    ```json
    {
      "success": true,
      "message": "Weight exceeded",
      "data": {
        "boxId": "BOX12345",
        "currentWeight": 1200,
        "maxWeight": 1000,
        "exceeded": true
      }
    }
    ```

### 2. Update Alert Limit
Set a weight threshold to trigger alerts.

*   **Endpoint:** `POST /device/alert`
*   **Request Body:**
    ```json
    {
      "boxId": "BOX12345",
      "alertBelowWeight": 100,
      "userId": "user_mongo_id"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "box": {
        "boxId": "BOX12345",
        "alertBelowWeight": 100,
        // ... other box fields
      }
    }
    ```
*   **Error Response (400/403/404):**
    ```json
    {
      "success": false,
      "message": "BOX_NOT_FOUND" // or UNAUTHORIZED, INVALID_ALERT_LIMIT
    }
    ```

---

## QR & Box Manufacturing (`/qr`)

### 1. Manufacture Box (Admin/Factory)
Create a new box identity in the system.

*   **Endpoint:** `POST /qr/manufactureBox`
*   **Request Body:**
    ```json
    {
      "maxWeight": 1000
    }
    ```
*   **Success Response (201 Created):**
    ```json
    {
      "success": true,
      "boxId": "generated_box_id_string"
    }
    ```

### 2. Register Box (User)
Assign a box to a user.

*   **Endpoint:** `POST /qr/registerBox`
*   **Request Body:**
    ```json
    {
      "boxId": "existing_box_id",
      "name": "My Smart Box",
      "userId": "user_mongo_id"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "box": {
        "boxId": "existing_box_id",
        "name": "My Smart Box",
        "assignedTo": "user_mongo_id",
        "isActive": true,
        // ... other box fields
      }
    }
    ```
*   **Error Response (404/409/400):**
    ```json
    {
      "success": false,
      "message": "Box not found" // or "Box already registered", "boxId and userId are required"
    }
    ```
