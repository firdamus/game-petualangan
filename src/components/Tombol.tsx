interface TombolProps {
  label?: string;
  onClick?: () => void;
  className?: string;
}

export default function Tombol({
  label = 'Mulai Petualangan',
  onClick,
  className = '',
}: TombolProps) {
  return (
    <button
      type="button"
      className={`btn-mulai-petualangan ${className}`}
      onClick={onClick}
    >
      <div className="play-icon-circle">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
      <span className="play-btn-text">{label}</span>
    </button>
  );
}
