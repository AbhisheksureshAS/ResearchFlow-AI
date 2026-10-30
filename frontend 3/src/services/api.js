import axios from 'axios'

const TOKEN_KEY = 'rf_token'
export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10 * 60 * 1000, // agent runs are slow
})

// Backend expects "Authorization: jwt <token>" (NOT "Bearer")
api.interceptors.request.use((c) => {
  const t = tokenStore.get()
  if (t) c.headers.Authorization = `jwt ${t}`
  return c
})

api.interceptors.response.use(
  (r) => r,
  (e) => {
    const s = e.response?.status
    const url = e.config?.url || ''
    const isAuthForm = url.includes('/user/login') || url.includes('/user/registration')
    if ((s === 401 || s === 402) && !isAuthForm) {
      tokenStore.clear()
      window.dispatchEvent(new Event('auth:expired'))
    }
    return Promise.reject(e)
  }
)

const d = (p) => p.then((r) => r.data)

export const authApi = {
  // backend field is literally named `password_hash` (it hashes it server-side)
  register: ({ username, email, password }) =>
    d(api.post('/user/registration', { username, email, password_hash: password })),
  login: ({ email, password }) => d(api.post('/user/login', { email, password_hash: password })),
  me: () => d(api.get('/user/get_auth')),
}

export const blogApi = {
  list: () => d(api.get('/blogs/blog')),
  listPublic: () => d(api.get('/blogs/public_blog')),
  get: (id) => d(api.get(`/blogs/${id}`)),
  create: ({ title, content }) => d(api.post('/blogs/blog', { title, content })),
  update: (id, body) => d(api.put(`/blogs/${id}`, body)),
  remove: (id) => d(api.delete(`/blogs/${id}`)),
  publish: (id) => d(api.patch(`/blogs/${id}/publish`)),
  unpublish: (id) => d(api.patch(`/blogs/${id}/unpublish`)),
}

export const sessionApi = {
  start: ({ topic, blogType }) =>
    d(api.post('/session/generate_response', { topic, blog_type: blogType })),
  resume: (threadId, { approval, feedback }) =>
    d(api.post(`/session/${threadId}/second_response`, { approval, feedback })),
}
