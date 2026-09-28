import { ArrowRight, Shield, Users, Zap } from "lucide-react";

const LP_URL =
  "https://deaeru-agent.jp/deaeru/lp03z/default/?utm_source=deaeru-magazine&utm_medium=article&utm_campaign=about-section";

const highlights = [
  { icon: Users, line1: "約1,000名の厳選", line2: "キャリアアドバイザー" },
  { icon: Shield, line1: "ユーザー満足度", line2: "98.2%" },
  { icon: Zap, line1: "LINEで完結", line2: "たった1分で診断" },
];

export default function DeaeruAboutSection() {
  return (
    <section className="relative my-10 overflow-hidden rounded-2xl border border-gray-200/80 bg-gradient-to-br from-white via-[#fafafa] to-[#f0fdf4] p-1 shadow-[0_16px_40px_-16px_rgba(15,23,42,0.12)] sm:my-14">
      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#00C853] via-[#00E676] to-[#69F0AE]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          background:
            "radial-gradient(700px 220px at 100% 0%, rgba(0,200,83,0.12), transparent 50%)",
        }}
      />

      <div className="relative px-5 py-7 sm:px-8 sm:py-9 md:px-10 md:py-10">
        <div className="mb-6 flex flex-col gap-4 border-b border-gray-100/80 pb-6 sm:flex-row sm:items-start sm:gap-8 md:gap-10">
          <div className="flex shrink-0 justify-center sm:justify-start sm:pt-1">
            <img
              src="/deaeru_logo.svg"
              alt="出会えるエージェント"
              width={220}
              height={56}
              className="h-11 w-auto max-w-[min(100%,220px)] object-contain object-center sm:h-12 md:h-14"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <p
              className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#00C853] sm:text-xs"
              style={{ fontFamily: "var(--font-outfit-deaeru), sans-serif" }}
            >
              About Service
            </p>
            <h2 className="mb-3 text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl md:text-[1.65rem]">
              出会えるエージェントとは？
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
              「出会えるエージェント」は、転職エージェントマッチングサービスです。あなたの経歴・希望条件をもとに、
              約1,000名のキャリアアドバイザーの中からぴったりの担当者を無料でご紹介します。
            </p>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          {highlights.map(({ icon: Icon, line1, line2 }) => (
            <div
              key={`${line1}-${line2}`}
              className="flex min-h-[4.5rem] items-start gap-3 rounded-xl border border-gray-100 bg-white/90 p-3.5 shadow-sm backdrop-blur-sm sm:min-h-[4.75rem]"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#00C853]/15 to-[#00E676]/10">
                <Icon size={18} className="text-[#00C853]" aria-hidden />
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 pt-0.5">
                <span className="text-xs font-semibold leading-snug text-gray-900 sm:text-sm">
                  {line1}
                </span>
                <span className="text-xs font-semibold leading-snug text-gray-700 sm:text-sm">
                  {line2}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href={LP_URL}
            data-gtm-event="media_cta_click"
            data-cta-position="about-section"
            className="group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#00C853] to-[#00E676] px-7 py-3 text-sm font-bold text-white shadow-[0_12px_28px_-10px_rgba(0,200,83,0.5)] transition-all hover:translate-y-[-1px] hover:shadow-[0_14px_32px_-10px_rgba(0,200,83,0.55)] hover:brightness-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00C853] sm:px-8 sm:text-base"
          >
            無料でエージェント診断する
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </a>
          <p className="mt-3 text-[11px] text-gray-500 sm:text-xs">
            完全無料 · 1分で完了
          </p>
        </div>
      </div>
    </section>
  );
}
