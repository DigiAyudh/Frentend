import axios, { AxiosInstance, AxiosError } from 'axios'
import { mockApi, MockError } from '../mock/mockApi'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/**
 * When no VITE_API_URL is configured we run fully on the in-memory mock
 * backend (no server required). If a real API URL is provided, the axios
 * client is used instead. This keeps the API layer intact while allowing a
 * zero-backend demo experience.
 */
const USE_MOCK = !import.meta.env.VITE_API_URL

export type UserRole = 'admin' | 'employee' | 'client'

export interface ClientSignupData {
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
  verificationToken?: string
}

export interface CreateEmployeeData {
  name: string
  email: string
  password?: string
  phone?: string
  countryCode?: string
  department?: string
  position?: string
  role?: UserRole
}

class ApiClient {
  private client: AxiosInstance
  readonly useMock = USE_MOCK

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: { 
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
      timeout: 30000,
      withCredentials: true, // Enable CORS credentials
    })

    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      
      // Add CSRF token if available
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken
      }
      
      // Add request ID for tracing
      config.headers['X-Request-ID'] = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      return config
    })

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as typeof error.config & { _retry?: boolean }

        if (
          error.response?.status === 401 &&
          originalRequest &&
          !originalRequest._retry &&
          !originalRequest.url?.includes('/auth/login') &&
          !originalRequest.url?.includes('/auth/refresh') &&
          !originalRequest.url?.includes('/auth/signup')
        ) {
          originalRequest._retry = true
          try {
            const refreshToken = localStorage.getItem('refreshToken')
            if (!refreshToken) throw new Error('No refresh token')

            const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken })
            const { token, refreshToken: newRefreshToken } = response.data

            localStorage.setItem('token', token)
            if (newRefreshToken) {
              localStorage.setItem('refreshToken', newRefreshToken)
            }

            originalRequest.headers.Authorization = `Bearer ${token}`
            return this.client(originalRequest)
          } catch {
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/signup')) {
              window.location.href = '/login'
            }
          }
        }

        return Promise.reject(error)
      }
    )
  }

  getErrorMessage(error: unknown): string {
    if (error instanceof MockError) return error.message
    if (error && typeof error === 'object' && 'isMockError' in error) {
      return (error as { message?: string }).message ?? 'Request failed'
    }
    if (axios.isAxiosError(error)) {
      const data = error.response?.data as { message?: string; errors?: { message: string }[] }
      if (data?.errors?.length) {
        return data.errors.map((e) => e.message).join('. ')
      }
      if (data?.message) return data.message
      if (error.response?.status === 403) return 'You do not have permission to perform this action'
      if (error.response?.status === 404) return 'Resource not found'
      if (error.response?.status === 500) return 'Server error. Please try again later'
      if (!error.response) return 'Network error. Please check your connection'
    }
    if (error instanceof Error) return error.message
    return 'An unexpected error occurred'
  }



  
  sendEmailOtp(email: string) {
    if (USE_MOCK) {
      return mockApi.sendOtp()
    }

    return this.client.post("/auth/send-email-otp", {
      email,
    })
  }

  verifyEmailOtp(email: string, otp: string) {
    if (USE_MOCK) {
      return mockApi.verifyOtp(email, otp)
    }

    return this.client.post("/auth/verify-email-otp", {
      email,
      otp,
    })
  }

  resendEmailOtp(email: string) {
    if (USE_MOCK) {
      return mockApi.sendOtp()
    }

    return this.client.post("/auth/resend-email-otp", {
      email,
    })
  }

  // Auth
  login(email: string, password: string, expectedRole?: UserRole) {
    if (USE_MOCK) return mockApi.login(email, password, expectedRole)
    return this.client.post('/auth/login', { email, password, expectedRole })
  }

  clientSignup(data: ClientSignupData) {
    if (USE_MOCK) return mockApi.clientSignup(data as unknown as Record<string, unknown>)
    return this.client.post('/auth/signup', data)
  }

  getMe() {
    if (USE_MOCK) return mockApi.getMe()
    return this.client.get('/auth/me')
  }

  logout() {
    if (USE_MOCK) return mockApi.logout()
    return this.client.post('/auth/logout')
  }

  sendOtp(phone: string, countryCode: string) {
    if (USE_MOCK) return mockApi.sendOtp()
    return this.client.post('/auth/send-otp', { phone, countryCode })
  }

  verifyOtp(phone: string, otp: string) {
    if (USE_MOCK) return mockApi.verifyOtp(phone, otp)
    return this.client.post('/auth/verify-otp', { phone, otp })
  }

  refresh(refreshToken: string) {
    if (USE_MOCK) return mockApi.refresh(refreshToken)
    return this.client.post('/auth/refresh', { refreshToken })
  }

  requestPasswordReset(email: string) {
    if (USE_MOCK) return mockApi.requestPasswordReset(email)
    return this.client.post('/auth/forgot-password', { email })
  }

  verifyPasswordResetToken(token: string) {
    if (USE_MOCK) return mockApi.verifyPasswordResetToken(token)
    return this.client.post('/auth/verify-reset-token', { token })
  }

  resetPassword(token: string, password: string) {
    if (USE_MOCK) return mockApi.resetPassword(token, password)
    return this.client.post('/auth/reset-password', { token, password })
  }

  // Admin employee management
  getEmployeeAccounts() {
    if (USE_MOCK) return mockApi.getEmployeeAccounts()
    return this.client.get('/users/employees')
  }
  createEmployeeAccount(data: CreateEmployeeData) {
    if (USE_MOCK) return mockApi.createEmployeeAccount(data as unknown as Record<string, unknown>)
    return this.client.post('/users/employees', data)
  }
  updateEmployeeAccount(id: string, data: Record<string, unknown>) {
    if (USE_MOCK) return mockApi.updateEmployeeAccount(id, data)
    return this.client.put(`/users/employees/${id}`, data)
  }
  resetEmployeePassword(id: string, newPassword: string) {
    if (USE_MOCK) return mockApi.resetEmployeePassword(id, newPassword)
    return this.client.post(`/users/employees/${id}/reset-password`, { newPassword })
  }
  deleteEmployeeAccount(id: string) {
    if (USE_MOCK) return mockApi.deleteEmployeeAccount(id)
    return this.client.delete(`/users/employees/${id}`)
  }
  assignClientToEmployee(clientId: string, employeeId: string) {
    if (USE_MOCK) return mockApi.assignClientToEmployee(clientId, employeeId)
    return this.client.post('/users/assign-client', { clientId, employeeId })
  }

  // Clients & verification
  getClients() {
    if (USE_MOCK) return mockApi.getClients()
    return this.client.get('/users/clients')
  }
  verifyClient(clientId: string) {
    if (USE_MOCK) return mockApi.verifyClient(clientId)
    return this.client.post(`/users/clients/${clientId}/verify`)
  }
  rejectClient(clientId: string, reason: string) {
    if (USE_MOCK) return mockApi.rejectClient(clientId, reason)
    return this.client.post(`/users/clients/${clientId}/reject`, { reason })
  }

  // Users
  getUsers(company: string) {
    if (USE_MOCK) return mockApi.getUsers()
    return this.client.get(`/users?company=${company}`)
  }
  getUserById(id: string) {
    if (USE_MOCK) return mockApi.getUserById(id)
    return this.client.get(`/users/${id}`)
  }
  updateUser(id: string, data: Record<string, unknown>) {
    if (USE_MOCK) return mockApi.updateUser(id, data)
    return this.client.put(`/users/${id}`, data)
  }

  // Projects
  getProjects(company: string) {
    if (USE_MOCK) return mockApi.getProjects()
    return this.client.get(`/projects?company=${company}`)
  }
  createProject(data: Record<string, unknown>) {
    if (USE_MOCK) return mockApi.createProject(data)
    return this.client.post('/projects', data)
  }
  getProjectById(id: string) {
    if (USE_MOCK) return mockApi.getProjectById(id)
    return this.client.get(`/projects/${id}`)
  }
  updateProject(id: string, data: Record<string, unknown>) {
    if (USE_MOCK) return mockApi.updateProject(id, data)
    return this.client.put(`/projects/${id}`, data)
  }
  deleteProject(id: string) {
    if (USE_MOCK) return mockApi.deleteProject(id)
    return this.client.delete(`/projects/${id}`)
  }

  // Tasks
  getTasks(company: string, projectId?: string) {
    if (USE_MOCK) return mockApi.getTasks(company, projectId)
    const url = projectId
      ? `/tasks?company=${company}&projectId=${projectId}`
      : `/tasks?company=${company}`
    return this.client.get(url)
  }
  createTask(data: Record<string, unknown>) {
    if (USE_MOCK) return mockApi.createTask(data)
    return this.client.post('/tasks', data)
  }
  getTaskById(id: string) {
    return this.client.get(`/tasks/${id}`)
  }
  updateTask(id: string, data: Record<string, unknown>) {
    if (USE_MOCK) return mockApi.updateTask(id, data)
    return this.client.put(`/tasks/${id}`, data)
  }
  deleteTask(id: string) {
    if (USE_MOCK) return mockApi.deleteTask(id)
    return this.client.delete(`/tasks/${id}`)
  }

  // Employees (HR records)
  getEmployees(company: string) {
    if (USE_MOCK) return mockApi.getEmployees()
    return this.client.get(`/employees?company=${company}`)
  }
  createEmployee(data: Record<string, unknown>) {
    if (USE_MOCK) return mockApi.createEmployee(data)
    return this.client.post('/employees', data)
  }
  getEmployeeById(id: string) {
    return this.client.get(`/employees/${id}`)
  }
  updateEmployee(id: string, data: Record<string, unknown>) {
    if (USE_MOCK) return mockApi.updateEmployee(id, data)
    return this.client.put(`/employees/${id}`, data)
  }
  deleteEmployee(id: string) {
    if (USE_MOCK) return mockApi.deleteEmployee(id)
    return this.client.delete(`/employees/${id}`)
  }

  // Leads
  getLeads(company: string) {
    if (USE_MOCK) return mockApi.getLeads()
    return this.client.get(`/leads?company_id=${company}`)
  }
  createLead(data: Record<string, unknown>) {
    if (USE_MOCK) return mockApi.createLead(data)
    return this.client.post('/leads', data)
  }
  getLeadById(id: string) {
    return this.client.get(`/leads/${id}`)
  }
  updateLead(id: string, data: Record<string, unknown>) {
    if (USE_MOCK) return mockApi.updateLead(id, data)
    return this.client.put(`/leads/${id}`, data)
  }
  deleteLead(id: string) {
    if (USE_MOCK) return mockApi.deleteLead(id)
    return this.client.delete(`/leads/${id}`)
  }

  // Messages & chats
  getMessages(chatId: string) {
    if (USE_MOCK) return mockApi.getMessages(chatId)
    return this.client.get(`/messages/${chatId}`)
  }
  sendMessage(chatId: string, content: string) {
    if (USE_MOCK) return mockApi.sendMessage(chatId, content)
    return this.client.post(`/messages/${chatId}`, { content })
  }
  getChats(company: string, userId: string) {
    if (USE_MOCK) return mockApi.getChats()
    return this.client.get(`/chats?company=${company}&userId=${userId}`)
  }
  createChat(data: Record<string, unknown>) {
    if (USE_MOCK) return mockApi.createChat(data)
    return this.client.post('/chats', data)
  }

  // Notifications
  getNotifications(userId: string) {
    if (USE_MOCK) return mockApi.getNotifications(userId)
    return this.client.get(`/notifications/${userId}`)
  }
  markNotificationAsRead(id: string) {
    if (USE_MOCK) return mockApi.markNotificationAsRead(id)
    return this.client.put(`/notifications/${id}/read`)
  }
  markAllNotificationsRead(userId: string) {
    if (USE_MOCK) return mockApi.markAllNotificationsRead(userId)
    return this.client.put(`/notifications/read-all`, { userId })
  }

  // Contact requests
  createContactRequest(data: Record<string, unknown>) {
    if (USE_MOCK) return mockApi.createContactRequest(data)
    return this.client.post('/contact', data)
  }
  getContactRequests() {
    if (USE_MOCK) return mockApi.getContactRequests()
    return this.client.get('/contact')
  }
  updateContactRequest(id: string, data: Record<string, unknown>) {
    if (USE_MOCK) return mockApi.updateContactRequest(id, data)
    return this.client.put(`/contact/${id}`, data)
  }

  // Invoices
  getInvoices(clientId?: string) {
    if (USE_MOCK) return mockApi.getInvoices(clientId)
    return this.client.get(clientId ? `/invoices?clientId=${clientId}` : '/invoices')
  }
  updateInvoice(id: string, data: Record<string, unknown>) {
    if (USE_MOCK) return mockApi.updateInvoice(id, data)
    return this.client.put(`/invoices/${id}`, data)
  }

  // Meetings
  getMeetings(clientId?: string) {
    if (USE_MOCK) return mockApi.getMeetings(clientId)
    return this.client.get(clientId ? `/meetings?clientId=${clientId}` : '/meetings')
  }
  createMeeting(data: Record<string, unknown>) {
    if (USE_MOCK) return mockApi.createMeeting(data)
    return this.client.post('/meetings', data)
  }
  updateMeeting(id: string, data: Record<string, unknown>) {
    if (USE_MOCK) return mockApi.updateMeeting(id, data)
    return this.client.put(`/meetings/${id}`, data)
  }
  deleteMeeting(id: string) {
    if (USE_MOCK) return mockApi.deleteMeeting(id)
    return this.client.delete(`/meetings/${id}`)
  }

  // Documents
  getDocuments(ownerId?: string) {
    if (USE_MOCK) return mockApi.getDocuments(ownerId)
    return this.client.get(ownerId ? `/documents?ownerId=${ownerId}` : '/documents')
  }

  // Support tickets
  getSupportTickets(createdBy?: string) {
    if (USE_MOCK) return mockApi.getSupportTickets(createdBy)
    return this.client.get(createdBy ? `/support?createdBy=${createdBy}` : '/support')
  }
  createSupportTicket(data: Record<string, unknown>) {
    if (USE_MOCK) return mockApi.createSupportTicket(data)
    return this.client.post('/support', data)
  }
  replySupportTicket(id: string, message: string) {
    if (USE_MOCK) return mockApi.replySupportTicket(id, message)
    return this.client.post(`/support/${id}/reply`, { message })
  }
  updateSupportTicket(id: string, data: Record<string, unknown>) {
    if (USE_MOCK) return mockApi.updateSupportTicket(id, data)
    return this.client.put(`/support/${id}`, data)
  }

  // Audit logs
  getAuditLogs() {
    if (USE_MOCK) return mockApi.getAuditLogs()
    return this.client.get('/audit-logs')
  }

  // Attendance
  getAttendance(company: string, date?: string) {
    if (USE_MOCK) return mockApi.getAttendance()
    const params = new URLSearchParams()
    if (company) params.append('company', company)
    if (date) params.append('date', date)
    return this.client.get(`/attendance?${params.toString()}`)
  }
  markAttendance(data: Record<string, unknown>) {
    if (USE_MOCK) return mockApi.markAttendance(data)
    return this.client.post('/attendance', data)
  }

  // Leave Requests
  getLeaveRequests(company: string) {
    if (USE_MOCK) return mockApi.getLeaveRequests(company)
    return this.client.get(`/leaves?company=${company}`)
  }
  createLeaveRequest(data: Record<string, unknown>) {
    if (USE_MOCK) return mockApi.createLeaveRequest(data)
    return this.client.post('/leaves', data)
  }
  approveLeaveRequest(id: string, approvedBy: string) {
    if (USE_MOCK) return mockApi.approveLeaveRequest(id, approvedBy)
    return this.client.put(`/leaves/${id}/approve`, { approvedBy })
  }
  rejectLeaveRequest(id: string, reason: string) {
    if (USE_MOCK) return mockApi.rejectLeaveRequest(id, reason)
    return this.client.put(`/leaves/${id}/reject`, { rejectionReason: reason })
  }

  // Dashboard
  getDashboardStats(role: string) {
    if (USE_MOCK) return mockApi.getDashboardStats(role)
    return this.client.get(`/dashboard/stats?role=${role}`)
  }

  // Reports
  getReports(company: string) {
    return this.client.get(`/reports?company=${company}`)
  }
  createReport(data: Record<string, unknown>) {
    return this.client.post('/reports', data)
  }
  exportReport(reportId: string) {
    return this.client.get(`/reports/${reportId}/export`, { responseType: 'blob' })
  }
}

export default new ApiClient()
