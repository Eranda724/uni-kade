import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * Wraps a route and redirects to /login if not authenticated.
 * If `role` is provided, also checks that user.role matches.
 */
export default function ProtectedRoute({ children, role }) {
  const { user, token, loading } = useAuth()

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Poppins, sans-serif',
          color: '#6B7280',
          fontSize: 15,
        }}
      >
        Loading...
      </div>
    )
  }

  if (!token || !user) return <Navigate to="/login" replace />

  // Role mismatch — redirect to their correct portal
  if (role && user.role !== role) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />
    if (user.role === 'seller') return <Navigate to="/seller/dashboard" replace />
    return <Navigate to="/student/home" replace />
  }

  return children
}
