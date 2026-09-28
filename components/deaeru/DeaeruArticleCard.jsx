import Link from "next/link";
import Image from "next/image";
import { Clock, ChevronRight } from "lucide-react";
import DeaeruCategoryBadge from "./DeaeruCategoryBadge";

export default function DeaeruArticleCard({ article, featured = false }) {
  return (
    <Link href={`/media/${article.slug}/`} className={featured ? "lg:col-span-2 lg:row-span-2" : ""}>
      <article
        className={`group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-[#00C853]/20 transition-all duration-300 h-full flex ${
          featured ? "flex-col" : "flex-col"
        }`}
      >
        <div
          className={`relative overflow-hidden ${
            featured ? "aspect-[2/1]" : "aspect-[43/24]"
          }`}
        >
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            sizes={featured ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-3 left-3">
            <DeaeruCategoryBadge categoryId={article.category} />
          </div>
        </div>

        <div className="p-4 sm:p-5 flex flex-col flex-1">
          <h3
            className={`${
              featured ? "text-lg sm:text-xl" : "text-sm sm:text-base"
            } font-bold text-gray-900 leading-snug group-hover:text-[#00C853] transition-colors line-clamp-2 flex-1`}
          >
            {article.title}
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-gray-500 leading-relaxed line-clamp-2">
            {article.excerpt}
          </p>
          <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3 text-[11px] sm:text-xs text-gray-400">
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
      </article>
    </Link>
  );
}
