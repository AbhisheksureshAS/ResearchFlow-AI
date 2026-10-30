import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Alert } from '../components/ui'
import LoadingIndicator from '../components/LoadingIndicator'
import { errMsg } from '../utils/format'

export default function AuthPage({ mode }) {
  const isReg = mode === 'register'
  const { token, login, register, expired } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()
  const [f, setF] = useState({ username: '', email: '', password: '' })
  const [show, setShow] = useState(false)
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  if (token) return <Navigate to="/" replace />
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    if (isReg && f.username.trim().length < 3) return setErr('Username must be at least 3 characters.')
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) return setErr('Enter a valid email address.')
    if (f.password.length < 6) return setErr('Password must be at least 6 characters.')
    setLoading(true)
    try {
      if (isReg) await register(f.username.trim(), f.email.trim(), f.password)
      else await login(f.email.trim(), f.password)
      nav(loc.state?.from?.pathname || '/', { replace: true })
    } catch (e2) {
      setErr(errMsg(e2))
    } finally { setLoading(false) }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 rounded-xl bg-indigo-600 p-2.5 text-white"><Sparkles size={22} /></span>
          <h1 className="text-xl font-semibold">{isReg ? 'Create your account' : 'Welcome back'}</h1>
          <p className="mt-1 text-sm text-zinc-500">ResearchFlow AI · research, write and edit with agents</p>
        </div>
        <form onSubmit={submit} className="card space-y-4 p-6" noValidate>
          {!isReg && expired && <Alert kind="warning">Your session expired. Please sign in again.</Alert>}
          {err && <Alert>{err}</Alert>}
          {isReg && (
            <div>
              <label className="label" htmlFor="u">Username</label>
              <input id="u" className="input" value={f.username} onChange={set('username')} autoComplete="username" />
            </div>
          )}
          <div>
            <label className="label" htmlFor="e">Email</label>
            <input id="e" type="email" className="input" value={f.email} onChange={set('email')} autoComplete="email" />
          </div>
          <div>
            <label className="label" htmlFor="p">Password</label>
            <div className="relative">
              <input id="p" type={show ? 'text' : 'password'} className="input pr-10" value={f.password} onChange={set('password')}
                autoComplete={isReg ? 'new-password' : 'current-password'} />
              <button type="button" className="absolute right-2.5 top-2.5 text-zinc-400" onClick={() => setShow(!show)} aria-label="Toggle password">
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button className="btn-primary w-full" disabled={loading}>
            {loading ? <LoadingIndicator label="Please wait…" size={16} className="!text-white" /> : isReg ? 'Create account' : 'Sign in'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-zinc-500">
          {isReg ? 'Already have an account?' : "Don't have an account?"}{' '}
          <Link className="font-medium text-indigo-600 hover:underline" to={isReg ? '/login' : '/register'}>{isReg ? 'Sign in' : 'Sign up'}</Link>
        </p>
      </div>
    </div>
  )
}
