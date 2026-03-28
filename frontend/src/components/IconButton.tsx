interface Props {
  onClick: () => void;
  tooltip: string;
  className?: string;
  children: React.ReactNode;
}

export default function IconButton({ onClick, tooltip, className, children }: Props) {
  return (
    <div className="relative group">
      <button onClick={onClick} title={tooltip} className={`p-1.5 border rounded-lg ${className}`}>
        {children}
      </button>
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
        {tooltip}
      </span>
    </div>
  );
}
