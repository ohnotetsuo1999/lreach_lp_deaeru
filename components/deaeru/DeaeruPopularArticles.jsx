import Link from "next/link";
import { TrendingUp } from "lucide-react";

export default function DeaeruPopularArticles({ articles }) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="mt-6">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
        <TrendingUp size={14} />
        人気の記事
      </p>
      <div className="space-y-3">
        {articles.map((article, i) => (
          <Link
            key={article.slug}
            href={`/media/${article.slug}/`}
            className="group flex items-start gap-2.5"
          >
            <span className="text-xs font-bold text-[#00C853] mt-0.5 w-5 text-center flex-shrink-0">
              {i + 1}
            </span>
            <span className="text-sm text-gray-500 group-hover:text-[#00C853] transition-colors leading-snug line-clamp-2">
              {article.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
