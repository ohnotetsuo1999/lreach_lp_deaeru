import Link from "next/link";
import Image from "next/image";
import { Clock, ChevronRight } from "lucide-react";
import DeaeruCategoryBadge from "./DeaeruCategoryBadge";

export default function DeaeruRelatedArticles({ articles }) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="bg-gray-50 py-8 sm:py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          <div className="w-1 h-6 bg-[#00C853] rounded-full" />
          <h2 className="text-lg font-bold text-gray-900">関連する記事</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/media/${article.slug}/`}
              className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-[#00C853]/20 transition-all duration-300"
            >
              <div className="relative aspect-[43/24] overflow-hidden">
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4 sm:p-5">
                <DeaeruCategoryBadge categoryId={article.category} />
                <h3 className="mt-2 text-sm sm:text-base font-bold text-gray-900 leading-snug group-hover:text-[#00C853] transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <div className="mt-3 pt-2.5 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] sm:text-xs text-gray-400">
                    <time dateTime={article.date}>{article.date}</time>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {article.readTime}
                    </span>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-gray-300 group-hover:text-[#00C853] transition-colors"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
