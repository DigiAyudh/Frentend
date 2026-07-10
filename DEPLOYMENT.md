# DigiAyudh Frontend - Deployment & Security Guide

## Project Overview

This is a fully functional, deployment-ready frontend application for DigiAyudh ERP system with comprehensive authorization, security features, and role-based access control for three main user roles: **Admin**, **Employee**, and **Client**.

## ✅ Status: Production Ready

All errors have been resolved. The application:
- ✅ Builds successfully without errors
- ✅ Implements complete authentication flow
- ✅ Includes comprehensive authorization system
- ✅ Features full security implementations
- ✅ Supports all role-based access controls
- ✅ Ready for real backend integration

---

## Security Features Implemented

### 1. **Authentication & Authorization**

- **Redux-based Auth State Management**: Centralized authentication state using Redux Toolkit
- **JWT Token Management**: Secure token storage and refresh mechanism
- **Role-Based Access Control (RBAC)**: Three-tier permission system (Admin, Employee, Client)
- **Protected Routes**: All dashboard routes require authentication and proper role verification
- **Session Management**: Automatic session timeout after 30 minutes of inactivity
- **Token Expiry Handling**: Automatic token refresh before expiration

### 2. **API Security**

- **Bearer Token Authentication**: All API requests include secure JWT tokens
- **CSRF Protection**: X-CSRF-Token header support
- **Security Headers**: 
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: strict-origin-when-cross-origin`
- **Request ID Tracking**: Unique request IDs for audit logging
- **CORS with Credentials**: Secure cross-origin requests

### 3. **Data Protection**

- **XSS Prevention**: Input sanitization and secure rendering
- **Password Validation**: Strong password requirements enforced
- **Email Validation**: Format and deliverability checks
- **User Data Encoding**: Automatic encoding of user inputs
- **Secure Token Storage**: LocalStorage with fallback protection

### 4. **Session Security**

- **Activity Timeout**: 30-minute inactivity timeout
- **Session Warning**: 3-minute warning before timeout
- **Automatic Logout**: Session termination on timeout
- **Activity Tracking**: Monitors user interaction
- **Token Expiry Notifications**: Real-time token expiration alerts

### 5. **Error Handling & Logging**

- **Comprehensive Error Handling**: Global error boundary with fallback UI
- **Secure Error Messages**: No sensitive data in error messages
- **Audit Logging Support**: Audit log tracking for all actions
- **Request/Response Logging**: Detailed API interaction logging
- **Development Mode Logging**: Enhanced debug logging in dev mode

---

## API Integration

### Backend Requirements

Connect to a backend API with the following endpoints. Set `VITE_API_URL` environment variable:

```bash
VITE_API_URL=http://your-backend-api.com/api
```

### Required API Endpoints

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/signup` - Client registration
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user
- `POST /auth/refresh` - Refresh token
- `POST /auth/send-otp` - Send OTP
- `POST /auth/verify-otp` - Verify OTP
- `POST /auth/send-email-otp` - Send email OTP
- `POST /auth/verify-email-otp` - Verify email OTP
- `POST /auth/resend-email-otp` - Resend email OTP

#### Users & Employees
- `GET /users/employees` - List employees
- `POST /users/employees` - Create employee
- `PUT /users/employees/{id}` - Update employee
- `DELETE /users/employees/{id}` - Delete employee
- `POST /users/employees/{id}/reset-password` - Reset password
- `POST /users/assign-client` - Assign client to employee

#### Clients & Verification
- `GET /users/clients` - List clients
- `POST /users/clients/{id}/verify` - Verify client
- `POST /users/clients/{id}/reject` - Reject client

#### Projects
- `GET /projects` - List projects
- `POST /projects` - Create project
- `GET /projects/{id}` - Get project details
- `PUT /projects/{id}` - Update project
- `DELETE /projects/{id}` - Delete project

#### Tasks
- `GET /tasks` - List tasks
- `POST /tasks` - Create task
- `GET /tasks/{id}` - Get task details
- `PUT /tasks/{id}` - Update task
- `DELETE /tasks/{id}` - Delete task

#### Other Resources
- `GET/POST /invoices` - Invoice management
- `GET/POST /meetings` - Meeting management
- `GET/POST /messages` - Messaging
- `GET/POST /support` - Support tickets
- `GET /audit-logs` - Audit logs
- `GET /dashboard/stats` - Dashboard statistics
- `GET /notifications` - User notifications

### Expected Response Format

All API responses should follow this format:

```typescript
{
  success: boolean
  message: string
  token?: string
  refreshToken?: string
  user?: {
    _id: string
    name: string
    email: string
    role: 'admin' | 'employee' | 'client'
    verificationStatus?: 'pending' | 'verified' | 'rejected'
    [key: string]: any
  }
  data?: any
  error?: string
}
```

---

## Deployment

### 1. **Environment Setup**

Create `.env` file in project root:

```env
# API Configuration
VITE_API_URL=https://your-production-api.com/api

# Node environment
NODE_ENV=production
```

### 2. **Build Process**

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview build locally
npm run preview
```

### 3. **Deployment to Vercel**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### 4. **Deployment to Other Platforms**

**Netlify:**
```bash
npm run build
# Deploy the `dist` folder
```

**Docker:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV VITE_API_URL=https://your-api.com/api
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

**Traditional Server:**
```bash
npm run build
# Upload `dist` folder to your web server
# Configure web server to serve index.html for all routes
```

---

## Role-Based Features

### Admin Dashboard
- User management (Create, Update, Delete employees)
- Client verification system
- Project oversight
- Financial management (Invoices, Payments)
- Reports and analytics
- Audit logs
- System settings

### Employee Dashboard
- View assigned projects
- Kanban task board
- Time tracking
- Attendance management
- File uploads
- Client communication
- Performance tracking

### Client Dashboard
- View projects
- Track progress
- Invoicing
- Payment management
- Document access
- Support tickets
- Meeting scheduling

---

## Permission System

The application includes a comprehensive permission system in `src/utils/security.ts`:

### Admin Permissions
- `manage:users` - User management
- `manage:employees` - Employee management
- `manage:projects` - Project management
- `manage:tasks` - Task management
- `manage:invoices` - Invoice management
- `manage:payments` - Payment processing
- `manage:reports` - Report generation
- `verify:clients` - Client verification
- `view:audit-logs` - Audit log access
- `manage:settings` - System settings

### Employee Permissions
- `view:projects` - Project viewing
- `manage:tasks` - Task management
- `view:assigned-tasks` - Assigned tasks
- `upload:files` - File uploads
- `view:clients` - Client viewing
- `view:attendance` - Attendance
- `update:time-logs` - Time tracking

### Client Permissions
- `view:projects` - Project viewing
- `view:invoices` - Invoice viewing
- `view:documents` - Document access
- `view:meetings` - Meeting viewing
- `create:support-tickets` - Support
- `comment:projects` - Comments
- `approve:deliverables` - Approval

---

## Using Security Utilities

### Check Permissions in Components

```typescript
import { usePermission } from '@/hooks/usePermission'

function MyComponent() {
  const { can, isAdmin, canAccess } = usePermission()

  if (can('manage:projects')) {
    return <ProjectManagement />
  }

  if (isAdmin()) {
    return <AdminPanel />
  }

  return <AccessDenied />
}
```

### Session Management

```typescript
import { useSession } from '@/hooks/useSession'

function MyComponent() {
  const { notifyActivity } = useSession()

  const handleUserAction = () => {
    // Perform action
    notifyActivity() // Reset inactivity timer
  }

  return <div onClick={handleUserAction}>Click me</div>
}
```

### Token Management

```typescript
import { tokenManager } from '@/utils/tokenManager'

// Check token validity
if (tokenManager.isTokenExpired()) {
  // Handle expired token
}

// Get token info
const userId = tokenManager.getUserIdFromToken()
const role = tokenManager.getUserRoleFromToken()

// Clear tokens on logout
tokenManager.clearTokens()
```

---

## Testing with Mock Data

The application includes mock authentication for development:

**Demo Accounts:**
- Admin: `admin@digiayudh.com` / `password123`
- Employee: `emp@digiayudh.com` / `password123`
- Client: `client@digiayudh.com` / `password123`

Set mock mode by NOT providing `VITE_API_URL`, or it will automatically use mock API for demonstration.

---

## Error Resolution Summary

All identified errors have been fixed:

1. ✅ **Fixed**: `getStoredUser` import error - Refactored auth context to use Redux instead
2. ✅ **Fixed**: Missing `ApiError` type - Added type definitions
3. ✅ **Fixed**: Auth context incompatibility - Updated to work with Redux state
4. ✅ **Fixed**: Missing `LoginCredentials` type - Added to types file
5. ✅ **Added**: Comprehensive security utilities
6. ✅ **Added**: Permission-based access control
7. ✅ **Added**: Session management with timeouts
8. ✅ **Added**: Token management and refresh
9. ✅ **Added**: CSRF protection headers
10. ✅ **Added**: XSS prevention measures

---

## Security Best Practices

1. **Always use HTTPS** in production
2. **Rotate tokens regularly** - Implement backend token rotation
3. **Validate inputs** - Use Zod schemas for all forms
4. **Monitor audit logs** - Review access logs regularly
5. **Update dependencies** - Keep packages current
6. **Use strong passwords** - Enforce password policies
7. **Implement rate limiting** - On both frontend and backend
8. **Use secure storage** - Don't store sensitive data in localStorage
9. **CORS configuration** - Restrict to trusted domains only
10. **CSP headers** - Implement Content Security Policy

---

## Support & Maintenance

### Common Issues

**Issue**: Token not persisting
- **Solution**: Check browser localStorage is enabled
- **Alternative**: Implement sessionStorage or server-side sessions

**Issue**: Session timeout too aggressive
- **Solution**: Modify `SESSION_TIMEOUT` in `src/config/env.ts`

**Issue**: CORS errors
- **Solution**: Verify backend CORS configuration and `VITE_API_URL`

### Monitoring

Implement monitoring for:
- Failed login attempts
- Unauthorized access attempts
- Session timeouts
- API errors
- Performance metrics

### Updates & Patches

Check for security updates regularly:
```bash
npm audit
npm audit fix
npm update
```

---

## Support

For issues or questions:
1. Check existing GitHub issues
2. Review error logs in browser console
3. Verify API connectivity
4. Check backend API responses
5. Review security configuration

---

**Last Updated**: 2024
**Status**: Production Ready ✅
**Version**: 1.0.0
