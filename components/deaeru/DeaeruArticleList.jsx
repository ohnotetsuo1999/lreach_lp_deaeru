"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles } from "lucide-react";
import { deaeruCategories } from "@/lib/deaeru-categories";
import DeaeruArticleCard from "./DeaeruArticleCard";

export default function DeaeruArticleList({ allPosts }) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [activeCategory, setActiveCategory] = useState(
    categoryParam || "all"
  );

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && deaeruCategories.some((c) => c.id === cat)) {
      setActiveCategory(cat);
    } else if (!cat) {
      setActiveCategory("all");
    }
  }, [searchParams]);

  const filteredPosts =
    activeCategory === "all"
      ? allPosts
      : allPosts.filter((p) => p.category === activeCategory);

  const showFeatured = activeCategory === "all";
  const featuredPosts = showFeatured ? allPosts.filter((p) => p.isPillar).slice(0, 3) : [];
  const featuredSlugs = new Set(featuredPosts.map((p) => p.slug));
  const remainingPosts = showFeatured
    ? filteredPosts.filter((p) => !featuredSlugs.has(p.slug))
    : filteredPosts;

  return (
    <>
      <div className="sticky top-20 md:top-[5.5rem] z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1.5 sm:gap-2 py-3 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {deaeruCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                  activeCategory === cat.id
                    ? "bg-[#00C853] text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {featuredPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
          <div className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
            <Sparkles size={18} className="text-[#00C853]" />
            <h2 className="text-lg font-bold text-gray-900">注目の記事</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-auto">
            {featuredPosts.map((article, i) => (
              <DeaeruArticleCard
                key={article.slug}
                article={article}
                featured={i === 0}
              />
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 md:py-14">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="w-1 h-6 bg-[#00C853] rounded-full" />
          <h2 className="text-lg font-bold text-gray-900">
            {activeCategory === "all"
              ? `すべての記事（${filteredPosts.length}件）`
              : `${deaeruCategories.find((c) => c.id === activeCategory)?.label}の記事（${filteredPosts.length}件）`}
          </h2>
        </div>
        {remainingPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {remainingPosts.map((article) => (
              <DeaeruArticleCard key={article.slug} article={article} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-12">
            このカテゴリの記事はまだありません。
          </p>
        )}
      </section>
    </>
  );
}
