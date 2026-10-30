import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute() {
  const { token } = useAuth()
  const loc = useLocation()
  return token ? <Outlet /> : <Navigate to="/login" state={{ from: loc }} replace />
}
