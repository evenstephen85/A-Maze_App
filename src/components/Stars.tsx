import { StarIcon } from './icons';

interface Props {
  count: number;
  size?: number;
  animate?: boolean;
}

export default function Stars({ count, size = 20, animate = false }: Props) {
  return (
    <span className={animate ? 'stars animate' : 'stars'} aria-label={`${count} of 3 stars`}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={i < count ? 'star on' : 'star'}
          style={{ animationDelay: `${i * 180}ms` }}
        >
          <StarIcon size={size} filled={i < count} />
        </span>
      ))}
    </span>
  );
}
