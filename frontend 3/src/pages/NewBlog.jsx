import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { blogApi } from '../services/api'
import LoadingIndicator from '../components/LoadingIndicator'
import { Alert, Markdown } from '../components/ui'
import { errMsg } from '../utils/format'

// Manual blog: POST /blogs/blog { title, content } (content is Markdown)
export default function NewBlog() {
  const nav = useNavigate()
  const [f, setF] = useState({ title: '', content: '' })
  const [preview, setPreview] = useState(false)
  const [err, setErr] = useState('')
  const [saving, setSaving] = useState(false)

  const save = async (e) => {
    e.preventDefault()
    setErr('')
    if (!f.title.trim()) return setErr('Please add a title.')
    if (!f.content.trim()) return setErr('Please write some content.')
    setSaving(true)
    try {
      const blog = await blogApi.create({ title: f.title.trim(), content: f.content })
      nav(`/blogs/${blog.id}`)
    } catch (e2) { setErr(errMsg(e2)); setSaving(false) }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link to="/blogs" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"><ArrowLeft size={15} />All blogs</Link>
      <h1 className="text-2xl font-semibold">Write a blog</h1>
      <form onSubmit={save} className="card space-y-4 p-6" noValidate>
        {err && <Alert>{err}</Alert>}
        <div>
          <label className="label" htmlFor="t">Title</label>
          <input id="t" className="input" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium" htmlFor="c">Content <span className="font-normal text-zinc-400">(Markdown supported)</span></label>
            <div className="flex gap-1 rounded-lg border border-zinc-200 p-0.5 text-xs dark:border-zinc-700">
              {[['Write', false], ['Preview', true]].map(([l, v]) => (
                <button type="button" key={l} onClick={() => setPreview(v)}
                  className={`rounded-md px-2.5 py-1 ${preview === v ? 'bg-indigo-600 text-white' : 'text-zinc-500'}`}>{l}</button>
              ))}
            </div>
          </div>
          {preview ? (
            <div className="min-h-[50vh] rounded-lg border border-zinc-300 p-4 dark:border-zinc-700">
              {f.content.trim() ? <Markdown>{f.content}</Markdown> : <p className="text-sm text-zinc-400">Nothing to preview yet.</p>}
            </div>
          ) : (
            <textarea id="c" className="input min-h-[50vh] resize-y font-mono" value={f.content} onChange={(e) => setF({ ...f, content: e.target.value })}
              placeholder={'# My heading\n\nStart writing…'} />
          )}
        </div>
        <div className="flex gap-2">
          <button className="btn-primary" disabled={saving}>{saving ? <LoadingIndicator label="Saving…" size={16} className="!text-white" /> : 'Save blog'}</button>
          <Link to="/blogs" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
