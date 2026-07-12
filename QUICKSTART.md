# Quick Start Guide - DigiAyudh Frontend

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 16.x or higher
- npm or pnpm
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/DigiAyudh/Frontend.git
cd Frontend
```

2. **Install dependencies**
```bash
npm install
# or
pnpm install
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env and set your API URL
```

4. **Start development server**
```bash
npm run dev
```

The application will open at `http://localhost:5173`

---

## 📝 Demo Accounts

Test the application with these demo credentials:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@digiayudh.com | admin123 |
| Employee | employee@digiayudh.com | emp123 |
| Client | client@acme.com | client123 |

**Note**: Demo accounts work when `VITE_API_URL` is not configured (mock mode).

### Session Persistence

- User sessions automatically persist across page refreshes
- Authentication token stored in localStorage
- Session restored automatically on app load
- Login redirects to role-specific dashboard
- "Dashboard" button appears in navbar when logged in
- One-click logout clears session completely

---

## 🔧 Development

### Project Structure
```
src/
├── components/       # Reusable components
├── pages/           # Page components
├── layouts/         # Layout components
├── redux/           # Redux store & slices
├── contexts/        # React contexts
├── services/        # API & external services
├── hooks/           # Custom hooks
├── utils/           # Utility functions
├── config/          # Configuration files
├── types/           # TypeScript types
└── constants/       # Constants
```

### Key Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format
```

---

## 🔐 Security Features

### Built-in Security
- ✅ JWT authentication with refresh tokens
- ✅ Role-based access control (RBAC)
- ✅ Session timeout (30 minutes inactivity)
- ✅ XSS protection
- ✅ CSRF token support
- ✅ Secure headers
- ✅ Input sanitization

### How to Use Security Hooks

```typescript
// Check user permissions
import { usePermission } from '@/hooks/usePermission'

function MyComponent() {
  const { can, isAdmin } = usePermission()
  
  if (can('manage:projects')) {
    return <ProjectManager />
  }
}

// Manage user sessions
import { useSession } from '@/hooks/useSession'

function Dashboard() {
  const { notifyActivity } = useSession()
  
  const handleAction = () => {
    notifyActivity() // Reset inactivity timer
  }
}
```

---

## 🚢 Build & Deploy

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

Set environment variables in Vercel dashboard:
- `VITE_API_URL`: Your production API URL

### Deploy to Other Platforms

**Netlify:**
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

**Traditional Server:**
1. Run `npm run build`
2. Upload `dist` folder to your server
3. Configure server to serve `index.html` for all routes

---

## 🐛 Troubleshooting

### Issue: "Cannot find VITE_API_URL"
**Solution**: Create `.env` file with `VITE_API_URL` configured

### Issue: Port 5173 already in use
**Solution**: Kill the process or use different port:
```bash
npm run dev -- --port 3000
```

### Issue: CORS errors
**Solution**: 
1. Check backend API is running
2. Verify `VITE_API_URL` is correct
3. Check backend CORS configuration

### Issue: Authentication failing
**Solution**:
1. Verify backend auth endpoints
2. Check token storage in browser DevTools
3. Check network requests in DevTools

### Issue: Styles not loading
**Solution**: Clear cache and restart:
```bash
rm -rf node_modules/.vite
npm run dev
```

---

## 📚 API Integration

### Connect to Your Backend

1. **Set API URL in .env**
```env
VITE_API_URL=https://your-api.com/api
```

2. **Implement required endpoints** (see DEPLOYMENT.md for full list)

3. **Test API connection**
- Open DevTools Network tab
- Perform login action
- Check API request/response

### Example API Response Format
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGc...",
  "refreshToken": "refresh...",
  "user": {
    "_id": "123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "verificationStatus": "verified"
  }
}
```

---

## 📱 Features Overview

### Admin Dashboard
- 📊 Analytics & Reports
- 👥 User Management
- ✅ Client Verification
- 💰 Financial Management
- 📋 Project Oversight
- 🔍 Audit Logs

### Employee Dashboard
- 📁 Project Management
- ✓ Task Board (Kanban)
- ⏱️ Time Tracking
- 📤 File Uploads
- 💬 Client Communication
- 📊 Performance Metrics

### Client Dashboard
- 📁 Project Tracking
- 📄 Document Access
- 💵 Invoice Management
- 🗓️ Meeting Scheduling
- 🎫 Support Tickets
- 💬 Messaging

---

## 🔄 Updating the Application

### Update Dependencies
```bash
npm update
```

### Check for Security Issues
```bash
npm audit
npm audit fix
```

### Update to Latest Version
```bash
git pull origin main
npm install
npm run build
```

---

## 📞 Support

### Debug Mode
Enable detailed logging in development:

```typescript
// In your component
console.log('[v0] Debug info:', data)
```

Check browser console (F12) for detailed logs.

### Common Solutions

1. **Clear browser cache**: Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
2. **Restart dev server**: Kill process and run `npm run dev`
3. **Clear node_modules**: `rm -rf node_modules && npm install`
4. **Check Network tab**: DevTools > Network tab to see API requests

---

## 📖 Documentation

- [Full Deployment Guide](DEPLOYMENT.md) - Production deployment
- [API Integration](DEPLOYMENT.md#api-integration) - Backend setup
- [Security Features](DEPLOYMENT.md#security-features-implemented) - Security details
- [Role Permissions](DEPLOYMENT.md#permission-system) - Permission system

---

## 🎯 Next Steps

1. ✅ Review DEPLOYMENT.md for production setup
2. ✅ Configure your backend API URL
3. ✅ Test with demo accounts
4. ✅ Implement backend endpoints
5. ✅ Deploy to production

---

**Version**: 1.0.0  
**Status**: Production Ready ✅  
**Last Updated**: 2024
