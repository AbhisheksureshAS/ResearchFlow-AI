export default function FeedbackForm({ value, onChange, disabled }) {
  return (
    <div>
      <label htmlFor="fb" className="label">Feedback <span className="font-normal text-zinc-400">(required to request a revision)</span></label>
      <textarea id="fb" rows={4} className="input resize-y" disabled={disabled} value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="What should the agent change, add, or fix?" />
    </div>
  )
}
