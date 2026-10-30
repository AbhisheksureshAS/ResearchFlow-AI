import { Check, CheckCircle2, PenLine, Search, SpellCheck, UserCheck } from 'lucide-react'

const STEPS = [
  { label: 'Researcher', icon: Search },
  { label: 'Review', icon: UserCheck },
  { label: 'Writer', icon: PenLine },
  { label: 'Review', icon: UserCheck },
  { label: 'Editor', icon: SpellCheck },
  { label: 'Review', icon: UserCheck },
  { label: 'Completed', icon: CheckCircle2 },
]

/** active: index of current step (7 = everything finished). working: an agent is running. */
export default function WorkflowProgress({ active, working }) {
  return (
    <ol className="flex items-start">
      {STEPS.map(({ label, icon: Icon }, i) => {
        const done = i < active, current = i === active
        return (
          <li key={i} className="flex flex-1 flex-col items-center last:flex-none">
            <div className="flex w-full items-center">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition ${
                done ? 'border-indigo-600 bg-indigo-600 text-white'
                : current ? `border-indigo-600 text-indigo-600 ring-4 ring-indigo-500/20 ${working ? 'animate-pulse' : ''}`
                : 'border-zinc-300 text-zinc-400 dark:border-zinc-700'}`}>
                {done ? <Check size={15} /> : <Icon size={15} />}
              </div>
              {i < STEPS.length - 1 && <div className={`mx-1 h-0.5 flex-1 ${done ? 'bg-indigo-600' : 'bg-zinc-200 dark:bg-zinc-800'}`} />}
            </div>
            <span className={`mt-2 hidden self-start text-[11px] sm:block ${current ? 'font-medium text-indigo-600 dark:text-indigo-400' : 'text-zinc-400'}`}>{label}</span>
          </li>
        )
      })}
    </ol>
  )
}
