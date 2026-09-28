import { ArrowRight, Check, Sparkles } from "lucide-react";

const LP_URL =
  "https://deaeru-agent.jp/deaeru/lp03z/default/?utm_source=deaeru-magazine&utm_medium=article&utm_campaign=service-cta";

const features = [
  "ユーザー満足度98.2%のエージェントのみ",
  "約1,000名のプロから厳選マッチング",
  "LINEで完結。たった1分で診断",
  "完全無料",
];

export default function DeaeruServiceCTA() {
  return (
    <div className="deaeru-lp-cta my-8 sm:my-12 relative overflow-hidden rounded-2xl border border-[#00C853]/20 bg-gradient-to-br from-white via-[#f0fdf4] to-[#ecfdf5] p-1 shadow-[0_20px_50px_-12px_rgba(0,200,83,0.18)]">
      {/* 外枠グロー */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-[0.45]"
        style={{
          background:
            "radial-gradient(900px 280px at 50% -20%, rgba(0,230,118,0.35), transparent 55%)",
        }}
      />
      <div className="relative rounded-[0.875rem] bg-white/80 p-5 backdrop-blur-sm sm:p-8 md:p-10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[0.875rem]">
          <div className="absolute -right-16 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full border border-[#00C853]/[0.12]" />
          <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full border border-[#00E676]/[0.1]" />
        </div>

        <div className="relative text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#00C853]/25 bg-[#00C853]/[0.08] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#008c3a] sm:text-xs">
            <Sparkles size={14} className="text-[#00C853]" aria-hidden />
            良いエージェントに出会える診断
          </div>

          <p className="mb-2 text-sm font-semibold text-[#00C853] sm:text-base">
            あなたにぴったりの転職エージェントが見つかる
          </p>
          <p className="mx-auto mb-6 max-w-xl text-2xl font-extrabold leading-snug tracking-tight text-gray-900 sm:text-3xl md:text-[1.85rem] md:leading-tight">
            たった<span className="text-[#00C853]">1分</span>で
            <br className="sm:hidden" />
            いい人に、いい求人に
            <span className="bg-gradient-to-r from-[#00C853] to-[#00E676] bg-clip-text text-transparent">
              出会える
            </span>
          </p>

          <div className="mx-auto mb-8 grid max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
            {features.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-2.5 rounded-xl border border-gray-100 bg-white/90 px-3 py-2.5 text-left text-xs text-gray-700 shadow-sm sm:text-sm"
              >
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#00C853]/10">
                  <Check
                    size={15}
                    className="text-[#00C853]"
                    strokeWidth={2.75}
                    aria-hidden
                  />
                </span>
                <span className="font-medium leading-snug">{feature}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-2">
            <a
              href={LP_URL}
              data-gtm-event="media_cta_click"
              data-cta-position="article-end-service"
              className="group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#00C853] to-[#00E676] px-8 py-3.5 text-base font-bold text-white shadow-[0_12px_30px_-8px_rgba(0,200,83,0.55)] transition-all hover:translate-y-[-1px] hover:shadow-[0_16px_36px_-8px_rgba(0,200,83,0.6)] hover:brightness-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00C853] sm:min-w-[280px] sm:text-lg"
            >
              エージェント診断START
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </a>
            <p className="text-[11px] text-gray-500 sm:text-xs">
              完全無料 · LINEで完結
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
