import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Calendar, Edit3, Globe, Lock, Trash2 } from 'lucide-react'
import { blogApi } from '../services/api'
import LoadingIndicator from '../components/LoadingIndicator'
import { Alert, Badge, ConfirmModal, Markdown } from '../components/ui'
import { errMsg, fmtDate } from '../utils/format'

export default function BlogDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const [blog, setBlog] = useState(null)
  const [err, setErr] = useState('')
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({ title: '', content: '' })
  const [busy, setBusy] = useState(false)
  const [confirm, setConfirm] = useState(false)

  useEffect(() => { blogApi.get(id).then(setBlog).catch((e) => setErr(errMsg(e))) }, [id])

  const run = async (fn, after) => {
    setBusy(true); setErr('')
    try { const r = await fn(); after?.(r) } catch (e) { setErr(errMsg(e)) } finally { setBusy(false) }
  }
  const startEdit = () => { setDraft({ title: blog.title, content: blog.content }); setEditing(true) }
  const save = () => {
    // backend ignores empty strings on update, so require both
    if (!draft.title.trim() || !draft.content.trim()) return setErr('Title and content cannot be empty.')
    run(() => blogApi.update(id, { title: draft.title.trim(), content: draft.content }), (b) => { setBlog(b); setEditing(false) })
  }
  const toggle = () => run(() => (blog.is_public ? blogApi.unpublish(id) : blogApi.publish(id)), setBlog)
  const del = () => run(() => blogApi.remove(id), () => nav('/blogs'))

  if (!blog) return err ? <div className="space-y-4"><Alert>{err}</Alert><Link to="/blogs" className="btn-secondary">Back to blogs</Link></div> : <LoadingIndicator className="py-24" />

  return (
    <div className="space-y-5">
      <Link to="/blogs" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"><ArrowLeft size={15} />All blogs</Link>
      {err && <Alert>{err}</Alert>}
      <article className="card p-6 sm:p-8">
        {editing ? (
          <div className="space-y-4">
            <input className="input text-lg font-semibold" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} aria-label="Title" />
            <textarea className="input min-h-[50vh] resize-y font-mono" value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} aria-label="Content (Markdown)" />
            <div className="flex gap-2">
              <button className="btn-primary" onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button>
              <button className="btn-secondary" onClick={() => { setEditing(false); setErr('') }} disabled={busy}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-col gap-4 border-b border-zinc-200 pb-5 dark:border-zinc-800 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold">{blog.title}</h1>
                <div className="mt-2 flex items-center gap-3 text-xs text-zinc-500">
                  <span className="flex items-center gap-1.5"><Calendar size={13} />{fmtDate(blog.created_at)}</span>
                  <Badge tone={blog.is_public ? 'green' : 'gray'}>{blog.is_public ? 'Public' : 'Private'}</Badge>
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <button className="btn-secondary" onClick={toggle} disabled={busy}>{blog.is_public ? <><Lock size={15} />Unpublish</> : <><Globe size={15} />Publish</>}</button>
                <button className="btn-secondary" onClick={startEdit}><Edit3 size={15} />Edit</button>
                <button className="btn-secondary !text-red-600" onClick={() => setConfirm(true)}><Trash2 size={15} />Delete</button>
              </div>
            </div>
            <Markdown>{blog.content}</Markdown>
          </>
        )}
      </article>
      <ConfirmModal open={confirm} loading={busy} title="Delete this blog?" body="This permanently removes the blog and cannot be undone."
        confirmLabel="Delete" onConfirm={del} onCancel={() => setConfirm(false)} />
    </div>
  )
}
