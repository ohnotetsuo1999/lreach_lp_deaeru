import { ArrowRight } from "lucide-react";

export default function DeaeruGeneralCTA() {
  return (
    <section className="bg-gradient-to-br from-[#E8F5E9] via-[#F1F8E9] to-[#E8F5E9] py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-xs sm:text-sm text-[#00C853] font-semibold tracking-wide mb-3">
          完全無料・たった1分で診断
        </p>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
          あなたに合う転職エージェントを
          <br className="sm:hidden" />
          見つけよう
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-lg mx-auto">
          約1,000名のエージェントの中から、ユーザー満足度98.2%の厳選エージェントをマッチング。
        </p>
        <a
          href="https://deaeru-agent.jp/deaeru/lp03z/default/"
          data-gtm-event="media_cta_click"
          data-cta-position="general"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#00C853] hover:bg-[#00B248] text-white font-semibold rounded-lg transition-colors text-sm sm:text-base shadow-lg shadow-[#00C853]/20"
        >
          無料で診断する
          <ArrowRight size={18} />
        </a>
      </div>
    </section>
  );
}
