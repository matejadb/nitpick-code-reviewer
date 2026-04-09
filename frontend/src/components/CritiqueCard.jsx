const CATEGORY_CONFIG = {
  bug: {
    label: "Bug",
    badge: "bg-red-500 text-neutral-0 border-red-500",
    border: "border-red-500",
  },
  security: {
    label: "Security",
    badge: "bg-orange-500 text-neutral-0 border-orange-500",
    border: "border-orange-500",
  },
  performance: {
    label: "Performance",
    badge: "bg-blue-500 text-neutral-0 border-blue-500",
    border: "border-blue-500",
  },
  style: {
    label: "Style",
    badge: "bg-purple-500 text-neutral-0 border-purple-500",
    border: "border-purple-500",
  },
};

const FALLBACK = {
  label: "Other",
  badge: "bg-neutral-500 text-neutral-0 border-neutral-500",
  border: "border-neutral-500",
};

function CritiqueCard({ text, category }) {
  const config = CATEGORY_CONFIG[category] ?? FALLBACK;

  return (
    <div className={`rounded-lg border bg-neutral-900 p-4 ${config.border} `}>
      <span
        className={`mb-2 inline-block rounded-full border px-2 py-0.5 text-xs font-semibold tracking-wide uppercase ${config.badge}`}
      >
        {config.label}
      </span>
      <p className="text-sm leading-relaxed text-neutral-200">{text}</p>
    </div>
  );
}

export default CritiqueCard;
