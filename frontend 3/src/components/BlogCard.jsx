import { Link } from 'react-router-dom'
import { Calendar, Trash2 } from 'lucide-react'
import { Badge } from './ui'
import { excerpt, fmtDate } from '../utils/format'

export default function BlogCard({ blog, onDelete, to }) {
  return (
    <div className="relative">
    <Link to={to || `/blogs/${blog.id}`} className="card fade-in flex h-full flex-col p-5 transition hover:border-indigo-400 dark:hover:border-indigo-600">
      <div className="flex items-start justify-between gap-3">
        <h3 className="line-clamp-2 font-medium">{blog.title}</h3>
        <Badge tone={blog.is_public ? 'green' : 'gray'}>{blog.is_public ? 'Public' : 'Private'}</Badge>
      </div>
      <p className="mt-2 line-clamp-3 flex-1 text-sm text-zinc-500">{excerpt(blog.content)}</p>
      <div className="mt-4 flex items-center gap-1.5 text-xs text-zinc-400"><Calendar size={13} />{fmtDate(blog.created_at)}</div>
    </Link>
    {onDelete && (
      <button aria-label="Delete blog" onClick={() => onDelete(blog)}
        className="absolute bottom-4 right-4 rounded-md p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40">
        <Trash2 size={15} />
      </button>
    )}
    </div>
  )
}
