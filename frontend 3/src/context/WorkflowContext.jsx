import { createContext, useContext, useEffect, useState } from 'react'
import { sessionApi } from '../services/api'
import { errMsg } from '../utils/format'
import { useAuth } from './AuthContext'

const Ctx = createContext(null)
export const useWorkflow = () => useContext(Ctx)

export const MAX_REVISIONS = 6 // mirrors max_revisions in session.py
const KEY = 'rf_session'
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) } catch { return null } }

/*
 session = {
   threadId, topic, blogType,
   stage: 'research' | 'writer' | 'editor',
   phase: 'review' | 'completed' | 'limit',
   outputs: { research, writer, editor },
   revisions
 }
 The same threadId is reused for every approve / revise call.
*/
export function WorkflowProvider({ children }) {
  const { token } = useAuth()
  const [session, setSession] = useState(load)
  const [busy, setBusy] = useState(null) // 'approve' | 'revise' | null
  const [error, setError] = useState('')

  useEffect(() => {
    session ? localStorage.setItem(KEY, JSON.stringify(session)) : localStorage.removeItem(KEY)
  }, [session])
  useEffect(() => { if (!token) setSession(null) }, [token])

  const reset = () => { setSession(null); setError('') }

  // Throws on failure so the Create page can show the error.
  const start = async (topic, blogType) => {
    const res = await sessionApi.start({ topic, blogType })
    setError('')
    setSession({
      threadId: res.thread_id, topic, blogType,
      stage: res.stage, phase: 'review', revisions: 0,
      outputs: { [res.stage]: res.content },
    })
  }

  const respond = async (approval, feedback = '') => {
    if (!session || busy) return
    setBusy(approval ? 'approve' : 'revise'); setError('')
    try {
      const res = await sessionApi.resume(session.threadId, { approval, feedback })
      const revisions = session.revisions + (approval ? 0 : 1)
      setSession((prev) => {
        if (res.stage) // paused again -> next review (or revised output)
          return { ...prev, stage: res.stage, phase: 'review', revisions, outputs: { ...prev.outputs, [res.stage]: res.content } }
        if (res.status === 'revision_limit_reached') return { ...prev, phase: 'limit', revisions }
        // No interrupt => graph reached END. (Backend leaves status as "running" here.)
        return { ...prev, phase: 'completed', revisions, outputs: { ...prev.outputs, editor: res.final_blog ?? prev.outputs.editor } }
      })
    } catch (e) {
      setError(errMsg(e))
    } finally { setBusy(null) }
  }

  return <Ctx.Provider value={{ session, busy, error, start, respond, reset }}>{children}</Ctx.Provider>
}
