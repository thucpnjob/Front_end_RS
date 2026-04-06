interface Props {
  rating: number
  size?: 'sm' | 'md'
}

export default function RatingStars({ rating, size = 'sm' }: Props) {
  const starSize = size === 'sm' ? 'text-xs' : 'text-sm'
  return (
    <span className={`text-gold font-semibold ${starSize} flex items-center gap-1`}>
      <span>★</span>
      <span>{rating.toFixed(1)}</span>
    </span>
  )
}
