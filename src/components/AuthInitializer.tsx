import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { fetchCurrentUser } from '../redux/slices/authSlice'
import { useSession } from '@/hooks/useSession'
import { AuthProvider } from '@/contexts/auth.context'
import { Loader } from 'lucide-react'
import { tokenManager } from '@/utils/tokenManager'

interface AuthInitializerProps {
  children: React.ReactNode
}

function AuthInitializerContent({ children }: AuthInitializerProps) {
  const dispatch = useAppDispatch()
  const { initializing, token } = useAppSelector((state) => state.auth)
  useSession() // Initialize session management

  useEffect(() => {
    if (token) {
      // Verify token is valid before fetching user
      if (tokenManager.isTokenValid()) {
        dispatch(fetchCurrentUser())
      } else {
        // Clear invalid token
        tokenManager.clearTokens()
      }
    }
  }, [dispatch, token])

  if (initializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin text-primary mx-auto mb-4" size={40} />
          <p className="text-text-light">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default function AuthInitializer({ children }: AuthInitializerProps) {
  return (
    <AuthProvider>
      <AuthInitializerContent>{children}</AuthInitializerContent>
    </AuthProvider>
  )
}
