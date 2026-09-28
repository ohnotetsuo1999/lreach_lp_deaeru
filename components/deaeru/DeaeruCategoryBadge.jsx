import { getDeaeruCategoryById } from "@/lib/deaeru-categories";

export default function DeaeruCategoryBadge({ categoryId, size = "sm" }) {
  const category = getDeaeruCategoryById(categoryId);
  if (!category || categoryId === "all") return null;

  const sizeClasses =
    size === "md"
      ? "px-3 py-1 text-xs sm:text-sm"
      : "px-2 py-0.5 text-[11px] sm:text-xs";

  return (
    <span
      className={`inline-block font-semibold rounded-full backdrop-blur-sm ${sizeClasses}`}
      style={{
        color: category.color,
        backgroundColor: `${category.color}18`,
        border: `1px solid ${category.color}30`,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      {category.label}
    </span>
  );
}
