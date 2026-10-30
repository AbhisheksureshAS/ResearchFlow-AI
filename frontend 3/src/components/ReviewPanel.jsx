import { useState } from 'react'
import { CheckCircle2, RotateCcw } from 'lucide-react'
import FeedbackForm from './FeedbackForm'
import { Alert } from './ui'
import { MAX_REVISIONS } from '../context/WorkflowContext'

const APPROVE = {
  research: 'Approve research & start writing',
  writer: 'Approve draft & send to editor',
  editor: 'Approve final blog',
}

export default function ReviewPanel({ stage, revisions, busy, onApprove, onRevise }) {
  const [feedback, setFeedback] = useState('')
  const lastChance = revisions === MAX_REVISIONS - 1
  return (
    <section className="card fade-in space-y-4 p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-medium">Your review</h2>
        <span className="text-xs text-zinc-500">Revisions used: {revisions}/{MAX_REVISIONS}</span>
      </div>
      {lastChance && (
        <Alert kind="warning">
          Revision limit: requesting another revision will end the workflow without regenerating. Approve to continue.
        </Alert>
      )}
      <FeedbackForm value={feedback} onChange={setFeedback} disabled={!!busy} />
      <div className="flex flex-col gap-2 sm:flex-row">
        <button className="btn-primary" disabled={!!busy} onClick={() => onApprove(feedback.trim())}>
          <CheckCircle2 size={16} />{APPROVE[stage]}
        </button>
        <button className="btn-secondary" disabled={!!busy || !feedback.trim()} onClick={() => onRevise(feedback.trim())}>
          <RotateCcw size={16} />Request revision
        </button>
      </div>
    </section>
  )
}
