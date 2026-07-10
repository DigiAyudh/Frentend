# DigiAyudh ERP System - Backend API Structure

## Overview
This document outlines the complete API structure used by the DigiAyudh ERP frontend. The frontend currently uses a mock API layer that can be easily switched to a real backend by setting the `VITE_API_URL` environment variable.

**Base URL:** `http://localhost:5000/api` (or your deployment URL)

## Authentication

### Login
```
POST /auth/login
Request Body:
{
  email: string
  password: string
  expectedRole?: 'admin' | 'employee' | 'client'
}

Response:
{
  success: boolean
  message: string
  token: string
  refreshToken: string
  user: User
}
```

### Client Signup
```
POST /auth/signup
Request Body:
{
  name: string
  companyName: string
  email: string
  countryCode: string
  phone: string
  password: string
  confirmPassword: string
  companyType: string
  city: string
  state: string
  country: string
  termsAccepted: boolean
}

Response:
{
  success: boolean
  message: string
  token?: string
  user?: User
}
```

### Get Current User
```
GET /auth/me
Headers: Authorization: Bearer {token}

Response:
{
  success: boolean
  user: User
}
```

### Logout
```
POST /auth/logout
Headers: Authorization: Bearer {token}

Response:
{
  success: boolean
  message: string
}
```

### Send OTP (Phone Verification)
```
POST /auth/send-otp
Request Body:
{
  phone: string
  countryCode: string
}

Response:
{
  success: boolean
  message: string
}
```

### Verify OTP
```
POST /auth/verify-otp
Request Body:
{
  phone: string
  otp: string
}

Response:
{
  success: boolean
  token?: string
  user?: User
}
```

### Refresh Token
```
POST /auth/refresh
Request Body:
{
  refreshToken: string
}

Response:
{
  success: boolean
  token: string
  refreshToken?: string
}
```

---

## Users Management

### Get Users
```
GET /users?company={companyId}
Headers: Authorization: Bearer {token}

Response:
{
  success: boolean
  data: User[]
}
```

### Get User by ID
```
GET /users/{id}
Headers: Authorization: Bearer {token}

Response:
{
  success: boolean
  data: User
}
```

### Update User
```
PUT /users/{id}
Headers: Authorization: Bearer {token}
Request Body: Partial User object

Response:
{
  success: boolean
  data: User
}
```

---

## Employee Accounts (Admin Only)

### Get Employee Accounts
```
GET /users/employees
Headers: Authorization: Bearer {token}

Response:
{
  success: boolean
  data: User[]
}
```

### Create Employee Account
```
POST /users/employees
Headers: Authorization: Bearer {token}
Request Body:
{
  name: string
  email: string
  password?: string
  phone?: string
  countryCode?: string
  department?: string
  position?: string
  role?: 'employee'
}

Response:
{
  success: boolean
  data: User
}
```

### Update Employee Account
```
PUT /users/employees/{id}
Headers: Authorization: Bearer {token}
Request Body: Partial Employee data

Response:
{
  success: boolean
  data: User
}
```

### Reset Employee Password
```
POST /users/employees/{id}/reset-password
Headers: Authorization: Bearer {token}
Request Body:
{
  newPassword: string
}

Response:
{
  success: boolean
  message: string
}
```

### Delete Employee Account
```
DELETE /users/employees/{id}
Headers: Authorization: Bearer {token}

Response:
{
  success: boolean
  message: string
}
```

### Assign Client to Employee
```
POST /users/assign-client
Headers: Authorization: Bearer {token}
Request Body:
{
  clientId: string
  employeeId: string
}

Response:
{
  success: boolean
  message: string
}
```

---

## Clients & Verification

### Get Clients
```
GET /users/clients
Headers: Authorization: Bearer {token}

Response:
{
  success: boolean
  data: User[]
}
```

### Verify Client
```
POST /users/clients/{clientId}/verify
Headers: Authorization: Bearer {token}

Response:
{
  success: boolean
  message: string
  data: User
}
```

### Reject Client
```
POST /users/clients/{clientId}/reject
Headers: Authorization: Bearer {token}
Request Body:
{
  reason: string
}

Response:
{
  success: boolean
  message: string
}
```

---

## Projects

### Get Projects
```
GET /projects?company={companyId}
Headers: Authorization: Bearer {token}

Response:
{
  success: boolean
  data: Project[]
}
```

### Create Project
```
POST /projects
Headers: Authorization: Bearer {token}
Request Body:
{
  title: string
  description: string
  status: 'planning' | 'active' | 'completed' | 'on-hold'
  startDate: Date
  endDate?: Date
  budget?: number
  priority: 'low' | 'medium' | 'high' | 'critical'
  clientId: string
  managerId: string
  teamMembers?: string[]
  company: string
}

Response:
{
  success: boolean
  data: Project
}
```

### Get Project by ID
```
GET /projects/{id}
Headers: Authorization: Bearer {token}

Response:
{
  success: boolean
  data: Project
}
```

### Update Project
```
PUT /projects/{id}
Headers: Authorization: Bearer {token}
Request Body: Partial Project object

Response:
{
  success: boolean
  data: Project
}
```

### Delete Project
```
DELETE /projects/{id}
Headers: Authorization: Bearer {token}

Response:
{
  success: boolean
  message: string
}
```

---

## Tasks

### Get Tasks
```
GET /tasks?company={companyId}&projectId={projectId}
Headers: Authorization: Bearer {token}

Response:
{
  success: boolean
  data: Task[]
}
```

### Create Task
```
POST /tasks
Headers: Authorization: Bearer {token}
Request Body:
{
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'review' | 'completed'
  priority: 'low' | 'medium' | 'high'
  projectId: string
  assignedTo: string
  createdBy: string
  dueDate: Date
  estimatedHours?: number
  company: string
}

Response:
{
  success: boolean
  data: Task
}
```

### Get Task by ID
```
GET /tasks/{id}
Headers: Authorization: Bearer {token}

Response:
{
  success: boolean
  data: Task
}
```

### Update Task
```
PUT /tasks/{id}
Headers: Authorization: Bearer {token}
Request Body: Partial Task object

Response:
{
  success: boolean
  data: Task
}
```

### Delete Task
```
DELETE /tasks/{id}
Headers: Authorization: Bearer {token}

Response:
{
  success: boolean
  message: string
}
```

---

## Employees (HR Records)

### Get Employees
```
GET /employees?company={companyId}
Headers: Authorization: Bearer {token}

Response:
{
  success: boolean
  data: Employee[]
}
```

### Create Employee
```
POST /employees
Headers: Authorization: Bearer {token}
Request Body:
{
  userId: string
  name: string
  email: string
  position: string
  department: string
  salary?: number
  joiningDate: Date
  phone: string
  address: string
  city: string
  country: string
  emergencyContact?: string
  emergencyPhone?: string
  company: string
}

Response:
{
  success: boolean
  data: Employee
}
```

### Get Employee by ID
```
GET /employees/{id}
Headers: Authorization: Bearer {token}

Response:
{
  success: boolean
  data: Employee
}
```

### Update Employee
```
PUT /employees/{id}
Headers: Authorization: Bearer {token}
Request Body: Partial Employee object

Response:
{
  success: boolean
  data: Employee
}
```

### Delete Employee
```
DELETE /employees/{id}
Headers: Authorization: Bearer {token}

Response:
{
  success: boolean
  message: string
}
```

---

## Leads

### Get Leads
```
GET /leads?company_id={companyId}
Headers: Authorization: Bearer {token}

Response:
{
  success: boolean
  data: Lead[]
}
```

### Create Lead
```
POST /leads
Headers: Authorization: Bearer {token}
Request Body:
{
  name: string
  email: string
  phone: string
  company: string
  source: string
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed'
  budget?: number
  notes?: string
  assignedTo?: string
  company_id: string
}

Response:
{
  success: boolean
  data: Lead
}
```

### Get Lead by ID
```
GET /leads/{id}
Headers: Authorization: Bearer {token}

Response:
{
  success: boolean
  data: Lead
}
```

### Update Lead
```
PUT /leads/{id}
Headers: Authorization: Bearer {token}
Request Body: Partial Lead object

Response:
{
  success: boolean
  data: Lead
}
```

### Delete Lead
```
DELETE /leads/{id}
Headers: Authorization: Bearer {token}

Response:
{
  success: boolean
  message: string
}
```

---

## Messages & Chat

### Get Messages
```
GET /messages/{chatId}
Headers: Authorization: Bearer {token}

Response:
{
  success: boolean
  data: Message[]
}
```

### Send Message
```
POST /messages/{chatId}
Headers: Authorization: Bearer {token}
Request Body:
{
  content: string
}

Response:
{
  success: boolean
  data: Message
}
```

### Get Chats
```
GET /chats?company={companyId}&userId={userId}
Headers: Authorization: Bearer {token}

Response:
{
  success: boolean
  data: Chat[]
}
```

### Create Chat
```
POST /chats
Headers: Authorization: Bearer {token}
Request Body:
{
  participants: string[]
  participantNames: string[]
  isGroup: boolean
  groupName?: string
  company: string
}

Response:
{
  success: boolean
  data: Chat
}
```

---

## Notifications

### Get Notifications
```
GET /notifications/{userId}
Headers: Authorization: Bearer {token}

Response:
{
  success: boolean
  data: Notification[]
}
```

### Mark Notification as Read
```
PUT /notifications/{id}/read
Headers: Authorization: Bearer {token}

Response:
{
  success: boolean
  data: Notification
}
```

### Mark All Notifications as Read
```
PUT /notifications/read-all
Headers: Authorization: Bearer {token}
Request Body:
{
  userId: string
}

Response:
{
  success: boolean
  message: string
}
```

---

## Contact Requests

### Get Contact Requests
```
GET /contact
Headers: Authorization: Bearer {token}

Response:
{
  success: boolean
  data: ContactRequest[]
}
```

### Create Contact Request
```
POST /contact
Request Body:
{
  name: string
  email: string
  phone?: string
  company?: string
  subject: string
  message: string
}

Response:
{
  success: boolean
  data: ContactRequest
}
```

### Update Contact Request
```
PUT /contact/{id}
Headers: Authorization: Bearer {token}
Request Body:
{
  status: 'new' | 'in-review' | 'responded' | 'closed'
}

Response:
{
  success: boolean
  data: ContactRequest
}
```

---

## Invoices

### Get Invoices
```
GET /invoices?clientId={clientId}
Headers: Authorization: Bearer {token}

Response:
{
  success: boolean
  data: Invoice[]
}
```

### Update Invoice
```
PUT /invoices/{id}
Headers: Authorization: Bearer {token}
Request Body:
{
  status: 'draft' | 'sent' | 'paid' | 'overdue'
}

Response:
{
  success: boolean
  data: Invoice
}
```

---

## Meetings

### Get Meetings
```
GET /meetings?clientId={clientId}
Headers: Authorization: Bearer {token}

Response:
{
  success: boolean
  data: Meeting[]
}
```

### Create Meeting
```
POST /meetings
Headers: Authorization: Bearer {token}
Request Body:
{
  title: string
  description?: string
  start: Date
  end: Date
  attendees: string[]
  organizerId: string
  clientId?: string
  location?: string
  link?: string
}

Response:
{
  success: boolean
  data: Meeting
}
```

---

## Documents

### Get Documents
```
GET /documents?ownerId={ownerId}
Headers: Authorization: Bearer {token}

Response:
{
  success: boolean
  data: DocumentFile[]
}
```

---

## Support Tickets

### Get Support Tickets
```
GET /support?createdBy={userId}
Headers: Authorization: Bearer {token}

Response:
{
  success: boolean
  data: SupportTicket[]
}
```

### Create Support Ticket
```
POST /support
Headers: Authorization: Bearer {token}
Request Body:
{
  subject: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: string
  createdBy: string
  createdByName: string
}

Response:
{
  success: boolean
  data: SupportTicket
}
```

### Reply to Support Ticket
```
POST /support/{id}/reply
Headers: Authorization: Bearer {token}
Request Body:
{
  message: string
}

Response:
{
  success: boolean
  data: SupportTicket
}
```

### Update Support Ticket
```
PUT /support/{id}
Headers: Authorization: Bearer {token}
Request Body:
{
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  assignedTo?: string
}

Response:
{
  success: boolean
  data: SupportTicket
}
```

---

## Audit Logs

### Get Audit Logs
```
GET /audit-logs
Headers: Authorization: Bearer {token}

Response:
{
  success: boolean
  data: AuditLog[]
}
```

---

## Attendance

### Get Attendance
```
GET /attendance
Headers: Authorization: Bearer {token}

Response:
{
  success: boolean
  data: Attendance[]
}
```

---

## Dashboard

### Get Dashboard Stats
```
GET /dashboard/stats?role={role}
Headers: Authorization: Bearer {token}

Response:
{
  success: boolean
  data: {
    totalProjects: DashboardStat
    activeProjects: DashboardStat
    completedProjects: DashboardStat
    revenue: DashboardStat
    totalClients: DashboardStat
    contactRequests: DashboardStat
    recentProjects: Project[]
    recentContacts: ContactRequest[]
    chartData: Array
  }
}
```

---

## Reports

### Get Reports
```
GET /reports?company={companyId}
Headers: Authorization: Bearer {token}

Response:
{
  success: boolean
  data: Report[]
}
```

### Create Report
```
POST /reports
Headers: Authorization: Bearer {token}
Request Body:
{
  title: string
  type: 'projects' | 'employees' | 'tasks' | 'finances' | 'leads'
  filters: Record<string, any>
  company: string
}

Response:
{
  success: boolean
  data: Report
}
```

### Export Report
```
GET /reports/{reportId}/export
Headers: Authorization: Bearer {token}

Response: Binary file (CSV/PDF)
```

---

## Data Models

### User
```typescript
interface User {
  _id: string
  name: string
  email: string
  phone?: string
  role: 'admin' | 'employee' | 'client'
  profileImage?: string
  department?: string
  position?: string
  joinDate: Date
  isActive: boolean
  company?: string
  companyName?: string
  city?: string
  state?: string
  country?: string
  verificationStatus?: 'pending' | 'verified' | 'rejected'
  rejectionReason?: string
  assignedEmployeeId?: string
  bio?: string
  createdAt: Date
  updatedAt: Date
}
```

### Project
```typescript
interface Project {
  _id: string
  title: string
  description: string
  status: 'planning' | 'active' | 'completed' | 'on-hold'
  startDate: Date
  endDate?: Date
  budget?: number
  budget_used?: number
  priority: 'low' | 'medium' | 'high' | 'critical'
  clientId: string
  managerId: string
  teamMembers: string[]
  company: string
  createdAt: Date
  updatedAt: Date
}
```

### Task
```typescript
interface Task {
  _id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'review' | 'completed'
  priority: 'low' | 'medium' | 'high'
  projectId: string
  assignedTo: string
  createdBy: string
  dueDate: Date
  estimatedHours?: number
  actualHours?: number
  attachments?: string[]
  company: string
  createdAt: Date
  updatedAt: Date
}
```

### Lead
```typescript
interface Lead {
  _id: string
  name: string
  email: string
  phone: string
  company: string
  source: string
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed'
  budget?: number
  notes?: string
  assignedTo?: string
  company_id: string
  createdAt: Date
  updatedAt: Date
}
```

### Invoice
```typescript
interface Invoice {
  _id: string
  number: string
  clientId: string
  clientName: string
  projectId?: string
  amount: number
  tax: number
  total: number
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  issueDate: Date
  dueDate: Date
  items: { description: string; quantity: number; rate: number }[]
  createdAt: Date
}
```

### ContactRequest
```typescript
interface ContactRequest {
  _id: string
  name: string
  email: string
  phone?: string
  company?: string
  subject: string
  message: string
  status: 'new' | 'in-review' | 'responded' | 'closed'
  createdAt: Date
  updatedAt: Date
}
```

### SupportTicket
```typescript
interface SupportTicket {
  _id: string
  subject: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  category: string
  createdBy: string
  createdByName: string
  assignedTo?: string
  replies: { authorId: string; authorName: string; message: string; createdAt: Date }[]
  createdAt: Date
  updatedAt: Date
}
```

---

## Environment Variables

```bash
# Frontend (.env)
VITE_API_URL=http://localhost:5000/api
```

When `VITE_API_URL` is NOT set, the app uses the in-memory mock API. When it IS set, all API calls go to your real backend.

---

## Error Handling

All endpoints return responses in this format:

```typescript
interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
  error?: string
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (no permission)
- `404` - Not Found
- `500` - Server Error

---

## Authentication Flow

1. User logs in with email/password → receives `token` and `refreshToken`
2. Frontend stores both in localStorage
3. All subsequent requests include `Authorization: Bearer {token}` header
4. When token expires (401 response), frontend uses `refreshToken` to get new token
5. If refresh fails, redirect to login

---

## Notes for Backend Development

1. All timestamps should be ISO 8601 format
2. IDs use MongoDB ObjectId format (`_id` field)
3. Always validate user permissions based on role
4. Audit all user actions (create AuditLog entry)
5. Use JWT for authentication with reasonable expiration (15-30 min for token, 7 days for refreshToken)
6. Implement rate limiting on auth endpoints
7. Hash passwords with bcrypt or similar
8. Support soft deletes where applicable (set `isActive: false` instead of removing)
