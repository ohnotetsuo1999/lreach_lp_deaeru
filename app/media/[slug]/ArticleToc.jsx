"use client";

import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";

export default function ArticleToc({ items }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -60% 0px" }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="space-y-1">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
        <BookOpen size={14} />
        目次
      </p>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={`block text-sm py-1.5 pl-3 border-l-2 transition-colors ${
            activeId === item.id
              ? "border-[#00C853] text-[#00C853] font-medium"
              : "border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200"
          }`}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
