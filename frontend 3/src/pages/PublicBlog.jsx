import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Calendar } from 'lucide-react'
import { blogApi } from '../services/api'
import LoadingIndicator from '../components/LoadingIndicator'
import { Alert, Markdown } from '../components/ui'
import { errMsg, fmtDate } from '../utils/format'

// Read-only view. The backend's GET /blogs/{id} only returns the caller's own blogs,
// so a public blog is looked up from the public list (which includes full content).
export default function PublicBlog() {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    blogApi.listPublic()
      .then((all) => {
        const b = all.find((x) => String(x.id) === id)
        b ? setBlog(b) : setErr('This blog is not public or no longer exists.')
      })
      .catch((e) => setErr(errMsg(e)))
  }, [id])

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link to="/explore" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"><ArrowLeft size={15} />Public blogs</Link>
      {err && <Alert>{err}</Alert>}
      {!blog && !err && <LoadingIndicator className="py-24" />}
      {blog && (
        <article className="card p-6 sm:p-8">
          <h1 className="text-2xl font-semibold">{blog.title}</h1>
          <div className="mb-6 mt-2 flex items-center gap-1.5 border-b border-zinc-200 pb-5 text-xs text-zinc-500 dark:border-zinc-800"><Calendar size={13} />{fmtDate(blog.created_at)}</div>
          <Markdown>{blog.content}</Markdown>
        </article>
      )}
    </div>
  )
}
