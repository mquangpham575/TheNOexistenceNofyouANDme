interface SelectorRowProps {
  label: string;
  options: string[];
  selected: string;
  onSelect: (val: string) => void;
  subtitle: string;
  onMouseEnter: (subtitle: string) => void;
  onMouseLeave: () => void;
}

// Renders a row of mutually exclusive options
export function SelectorRow({
  label,
  options,
  selected,
  onSelect,
  subtitle,
  onMouseEnter,
  onMouseLeave,
}: SelectorRowProps) {
  return (
    <div className="flex items-center justify-between mb-3 p-1 transition-colors">
      <span className="text-white text-3xl w-56 font-bold text-right mr-20">
        {label}
      </span>
      <div className="flex-1 flex gap-8 text-white text-3xl font-bold">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt)} // Adjustment: triggers selection callback
            onMouseEnter={() => onMouseEnter(subtitle)}
            onMouseLeave={onMouseLeave}
            className={`transition-colors flex items-center ${
              selected === opt
                ? "text-white hover:text-[#FF959E]"
                : "text-white hover:text-[#FF959E]"
            }`}
          >
            {/* Visual indicator for selected option */}
            {selected === opt && (
              <span className="w-3.5 h-8 bg-white rounded-sm mr-2 inline-block"></span>
            )}
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
