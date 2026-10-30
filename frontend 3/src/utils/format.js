export const decodeJwt = (t) => {
  try {
    const p = t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(p))
  } catch { return null }
}

// FastAPI errors: { detail: "text" } or { detail: [{ msg }] } for 422
export const errMsg = (e, fallback = 'Something went wrong. Please try again.') => {
  const d = e?.response?.data?.detail
  if (typeof d === 'string') return d
  if (Array.isArray(d)) return d.map((x) => x.msg).join('; ')
  if (e?.code === 'ECONNABORTED') return 'The request timed out.'
  if (!e?.response) return 'Cannot reach the server. Is the backend running?'
  return fallback
}

export const fmtDate = (d) =>
  new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })

export const excerpt = (md = '', n = 170) =>
  md.replace(/[#*_`>[\]()|-]/g, '').replace(/\s+/g, ' ').trim().slice(0, n)
