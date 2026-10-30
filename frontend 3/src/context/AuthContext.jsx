import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authApi, tokenStore } from '../services/api'
import { decodeJwt } from '../utils/format'

const Ctx = createContext(null)
export const useAuth = () => useContext(Ctx)

const validToken = () => {
  const t = tokenStore.get()
  const p = t && decodeJwt(t)
  if (!p || (p.exp && p.exp * 1000 <= Date.now())) { tokenStore.clear(); return null }
  return t
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(validToken)
  const [username, setUsername] = useState('')
  const [expired, setExpired] = useState(false)

  const logout = useCallback((wasExpired = false) => {
    tokenStore.clear()
    localStorage.removeItem('rf_session')
    setToken(null); setUsername(''); setExpired(wasExpired)
  }, [])

  // 401/402 from any request, and client-side expiry timer
  useEffect(() => {
    const h = () => logout(true)
    window.addEventListener('auth:expired', h)
    return () => window.removeEventListener('auth:expired', h)
  }, [logout])

  useEffect(() => {
    if (!token) return
    const exp = decodeJwt(token)?.exp
    if (!exp) return
    const id = setTimeout(() => logout(true), Math.max(exp * 1000 - Date.now(), 0))
    return () => clearTimeout(id)
  }, [token, logout])

  // Optional: username from GET /user/get_auth (silently ignored if the route differs)
  useEffect(() => {
    if (token) authApi.me().then((u) => u?.username && setUsername(u.username)).catch(() => {})
  }, [token])

  const login = async (email, password) => {
    const { token: t } = await authApi.login({ email, password })
    tokenStore.set(t); setExpired(false); setToken(t)
  }
  // Backend returns no token on registration, so sign in right after
  const register = async (username, email, password) => {
    await authApi.register({ username, email, password })
    await login(email, password)
  }

  const user = useMemo(() => {
    const p = token && decodeJwt(token)
    if (!p) return null
    return { email: p.email, exp: p.exp, username, name: username || p.email.split('@')[0] }
  }, [token, username])

  return <Ctx.Provider value={{ token, user, login, register, logout, expired }}>{children}</Ctx.Provider>
}
