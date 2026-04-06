import { Link } from 'react-router-dom'

interface Props {
  title: string
  showAll?: boolean
  to?: string
}

export default function SectionHeader({ title, showAll = true, to = '/' }: Props) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-white font-semibold text-base">{title}</h2>
      {showAll && (
        <Link to={to} className="text-accent text-xs hover:underline">
          Xem tất cả
        </Link>
      )}
    </div>
  )
}
