import Link from "next/link";
import DeaeruGeneralCTA from "./DeaeruGeneralCTA";

export default function DeaeruFooter() {
  return (
    <>
      <DeaeruGeneralCTA />

      <footer className="bg-white border-t border-gray-200 py-10 sm:py-14" role="contentinfo">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center gap-6 sm:gap-8">
            <Link
              href="/media"
              className="hover:opacity-80 transition-opacity"
            >
              <img
                src="/deaeru-magazine-logo.svg"
                alt="出会えるマガジン"
                width={320}
                height={88}
                className="h-14 sm:h-16 md:h-[4.5rem] w-auto max-w-[min(360px,85vw)] object-contain"
              />
            </Link>

            <nav
              className="flex items-center gap-5 sm:gap-8 text-xs sm:text-sm text-gray-500"
              aria-label="フッターナビゲーション"
            >
              <Link href="/media" className="hover:text-[#00C853] transition-colors">
                メディア
              </Link>
              <a href="https://deaeru-agent.jp/deaeru/lp03z/default/" className="hover:text-[#00C853] transition-colors">
                転職エージェント診断
              </a>
              <a
                href="https://deaeru-agent.jp/"
                className="hover:text-[#00C853] transition-colors"
              >
                出会えるエージェント
              </a>
              <a
                href="https://foresma.jp/company"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#00C853] transition-colors"
              >
                運営会社
              </a>
            </nav>
          </div>

          <div className="border-t border-gray-100 mt-8 sm:mt-10 pt-6 sm:pt-8 text-center text-[11px] sm:text-xs text-gray-400">
            © 2026 foresma Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
