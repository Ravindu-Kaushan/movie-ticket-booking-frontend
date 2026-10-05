import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'
import type { Role } from '../types'

interface ProtectedRouteProps {
  children: ReactNode
  role?: Role
}

function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/signin" replace />
  }

  if (role && user.role !== role) {
    return <Navigate to="/movies" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute