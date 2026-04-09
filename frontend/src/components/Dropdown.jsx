import { useState, useRef, useEffect } from "react";

export function Dropdown({ value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-sm text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
      >
        {selected?.label}
        <svg
          className={`h-3.5 w-3.5 text-neutral-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 z-50 mt-1 max-h-60 min-w-35 overflow-x-hidden overflow-y-auto rounded-md border border-neutral-700 bg-neutral-900 py-1 shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`block w-full px-3 py-1.5 text-left text-sm hover:bg-neutral-800 ${value === option.value ? "text-blue-400" : "text-white"} cursor-pointer`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
