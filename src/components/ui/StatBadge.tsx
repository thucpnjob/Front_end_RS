interface Props {
  icon: string
  value: string | number
  label?: string
}

function formatNumber(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return String(n)
}

export default function StatBadge({ icon, value, label }: Props) {
  const display = typeof value === 'number' ? formatNumber(value) : value
  return (
    <span className="flex items-center gap-1 text-slate-400 text-xs">
      <span>{icon}</span>
      <span>{display}</span>
      {label && <span>{label}</span>}
    </span>
  )
}
