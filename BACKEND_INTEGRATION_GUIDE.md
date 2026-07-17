# Backend Integration Guide

## Quick Start

### 1. Set Environment Variable
Create or update `.env.local` (or `.env` for development):
```env
VITE_API_URL=http://localhost:5000/api
```

Replace `http://localhost:5000/api` with your actual backend URL.

### 2. Key Changes
✅ **Mock APIs are completely disabled** - No more in-memory data  
✅ **Profile updates now persist to backend** - No longer Redux-only  
✅ **Session duration extended to 30 days** - Users stay logged in longer  
✅ **All data fetches from backend** - Real data integration  

### 3. Required Backend Endpoints

The backend must implement these REST endpoints:

#### Authentication (`/auth`)
```
POST   /auth/login                    # Login user
POST   /auth/signup                   # Register new user
GET    /auth/me                       # Get current user
POST   /auth/logout                   # Logout user
POST   /auth/refresh                  # Refresh token
POST   /auth/forgot-password          # Request password reset
POST   /auth/verify-reset-token       # Verify reset token
POST   /auth/reset-password           # Reset password
POST   /auth/send-otp                 # Send OTP to phone
POST   /auth/verify-otp               # Verify OTP
POST   /auth/send-email-otp           # Send OTP to email
POST   /auth/verify-email-otp         # Verify email OTP
POST   /auth/resend-email-otp         # Resend email OTP
PUT    /auth/profile                  # Update user profile (NEW)
```

#### Users (`/users`)
```
GET    /users                         # Get all users
GET    /users/:id                     # Get user by ID
PUT    /users/:id                     # Update user
GET    /users/clients                 # Get all clients
POST   /users/clients/:id/verify      # Verify client
POST   /users/clients/:id/reject      # Reject client
GET    /users/employees               # Get all employees
POST   /users/employees               # Create employee
PUT    /users/employees/:id           # Update employee
DELETE /users/employees/:id           # Delete employee
POST   /users/employees/:id/reset-password  # Reset employee password
POST   /users/assign-client           # Assign client to employee
```

#### Projects (`/projects`)
```
GET    /projects                      # Get projects
POST   /projects                      # Create project
GET    /projects/:id                  # Get project by ID
PUT    /projects/:id                  # Update project
DELETE /projects/:id                  # Delete project
```

#### Tasks (`/tasks`)
```
GET    /tasks                         # Get tasks
POST   /tasks                         # Create task
GET    /tasks/:id                     # Get task by ID
PUT    /tasks/:id                     # Update task
DELETE /tasks/:id                     # Delete task
```

#### Employees (`/employees`)
```
GET    /employees                     # Get employees
POST   /employees                     # Create employee
GET    /employees/:id                 # Get employee by ID
PUT    /employees/:id                 # Update employee
DELETE /employees/:id                 # Delete employee
```

#### Leads (`/leads`)
```
GET    /leads                         # Get leads
POST   /leads                         # Create lead
GET    /leads/:id                     # Get lead by ID
PUT    /leads/:id                     # Update lead
DELETE /leads/:id                     # Delete lead
```

#### Chats & Messages (`/chats`, `/messages`)
```
GET    /chats                         # Get chats
POST   /chats                         # Create chat
GET    /messages/:chatId              # Get messages for chat
POST   /messages/:chatId              # Send message
```

#### Notifications (`/notifications`)
```
GET    /notifications/:userId         # Get notifications
PUT    /notifications/:id/read        # Mark as read
PUT    /notifications/read-all        # Mark all as read
```

#### Contact Requests (`/contact`)
```
POST   /contact                       # Create contact request
GET    /contact                       # Get contact requests
PUT    /contact/:id                   # Update contact request
```

#### Invoices (`/invoices`)
```
GET    /invoices                      # Get invoices
PUT    /invoices/:id                  # Update invoice
```

#### Meetings (`/meetings`)
```
GET    /meetings                      # Get meetings
POST   /meetings                      # Create meeting
PUT    /meetings/:id                  # Update meeting
DELETE /meetings/:id                  # Delete meeting
```

#### Documents (`/documents`)
```
GET    /documents                     # Get documents
```

#### Support Tickets (`/support`)
```
GET    /support                       # Get support tickets
POST   /support                       # Create support ticket
POST   /support/:id/reply             # Reply to ticket
PUT    /support/:id                   # Update ticket
```

#### Audit Logs (`/audit-logs`)
```
GET    /audit-logs                    # Get audit logs
```

#### Attendance (`/attendance`)
```
GET    /attendance                    # Get attendance records
POST   /attendance                    # Mark attendance
```

#### Leave Requests (`/leaves`)
```
GET    /leaves                        # Get leave requests
POST   /leaves                        # Create leave request
PUT    /leaves/:id/approve            # Approve leave request
PUT    /leaves/:id/reject             # Reject leave request
```

#### Dashboard (`/dashboard`)
```
GET    /dashboard/stats               # Get dashboard statistics
```

#### Todos (`/todos`)
```
GET    /todos                         # Get todos
POST   /todos                         # Create todo
PUT    /todos/:id                     # Update todo
DELETE /todos/:id                     # Delete todo
```

#### Reports (`/reports`)
```
GET    /reports                       # Get reports
POST   /reports                       # Create report
GET    /reports/:id/export            # Export report
```

### 4. Response Format

All endpoints should follow this response format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* endpoint-specific data */ }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    { "message": "Detailed error message" }
  ]
}
```

### 5. Authentication

The frontend sends the token in the Authorization header:
```
Authorization: Bearer <token>
```

Tokens should be JWT and include:
- `sub` or `id` or `userId` - User ID
- `role` - User role (admin, employee, client)
- `exp` - Expiration time (Unix timestamp in seconds)

Example payload:
```json
{
  "sub": "u_user_123",
  "role": "admin",
  "email": "user@example.com",
  "iat": 1234567890,
  "exp": 1234571490
}
```

### 6. Session Management

- Session duration: **30 days** (2,592,000,000 ms)
- Token refresh: Automatically refreshed 5 minutes before expiry
- Logout: Clears tokens from localStorage

### 7. Profile Update Endpoint

**Endpoint:** `PUT /auth/profile`

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "+1 234 567 8900",
  "companyName": "ACME Corp",
  "city": "San Francisco",
  "country": "USA",
  "bio": "User bio here"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "u_user_123",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1 234 567 8900",
      "companyName": "ACME Corp",
      "city": "San Francisco",
      "country": "USA",
      "bio": "User bio here",
      "role": "client",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### 8. Error Handling

The frontend handles errors gracefully:
- Network errors → "Network error. Please check your connection"
- 401 Unauthorized → Automatic redirect to login
- 403 Forbidden → "You do not have permission to perform this action"
- 404 Not Found → "Resource not found"
- 500 Server Error → "Server error. Please try again later"

### 9. Testing the Integration

1. **Start the frontend dev server:**
   ```bash
   npm run dev
   ```

2. **Ensure the backend is running** at the URL specified in `VITE_API_URL`

3. **Test login:**
   - Navigate to login page
   - Enter credentials
   - Should authenticate with backend

4. **Test profile update:**
   - Go to Profile page
   - Edit any field
   - Click Save Changes
   - Should call `PUT /auth/profile`
   - Should show success/error toast

5. **Verify session duration:**
   - Session token should be valid for 30 days
   - Token refresh should occur automatically

### 10. Troubleshooting

**"Request failed" or Network errors:**
- Check that `VITE_API_URL` is correct in `.env.local`
- Verify backend is running
- Check CORS settings on backend (should allow requests from your frontend URL)

**"Invalid credentials":**
- Verify user exists in backend database
- Check password hashing matches frontend expectations

**Profile update not working:**
- Verify `/auth/profile` endpoint is implemented
- Check request/response format matches expected schema
- Check that user is authenticated (token is valid)

**Session expires too quickly:**
- Verify token expiration is set to 30+ days on backend
- Check that `exp` claim in JWT is set correctly

### 11. Important Notes

⚠️ **Mock APIs are disabled** - The app will not work without a running backend  
⚠️ **All data must come from backend** - No fallback to local data  
⚠️ **Authentication is required** - All endpoints (except /auth/login and /auth/signup) require valid token  
⚠️ **Profile updates now persist** - Changes are sent to backend in real-time  

### 12. API Client Location

The API client is located at:
```typescript
src/services/api.ts
```

To add new endpoints:
1. Add method to `ApiClient` class
2. Call `this.client.get/post/put/delete` with endpoint path
3. Import and use in Redux thunks or components

Example:
```typescript
getNewEntity(id: string) {
  return this.client.get(`/new-entity/${id}`)
}
```
