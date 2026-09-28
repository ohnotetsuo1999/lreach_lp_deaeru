import { type Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "../_components/ArticleLayout";
import {
  InsightCard,
  CheckList,
  InlineCTA,
  AlertBox,
} from "../_components/ArticleComponents";
import { ArrowRight, Users, Briefcase } from "lucide-react";

export const metadata: Metadata = {
  title: "30代の転職でエージェントを使うべき5つの理由｜出会えるエージェント",
  description: "30代の転職活動では、エージェントの活用が成功の鍵。キャリアの転換期である30代だからこそ、プロのサポートが必要な理由を徹底解説します。",
  keywords: "30代,転職,エージェント,キャリアチェンジ,年収アップ",
  openGraph: {
    title: "30代の転職でエージェントを使うべき5つの理由",
    description: "30代の転職活動では、エージェントの活用が成功の鍵。キャリアの転換期である30代だからこそ、プロのサポートが必要な理由を徹底解説します。",
    type: "article",
  },
};

export default function Article() {
  const relatedArticles = [
    {
      title: "40代の転職成功マニュアル",
      slug: "40dai-tensyoku",
      category: "40代転職",
    },
    {
      title: "キャリアアップのための転職戦略",
      slug: "career-up-senryaku",
      category: "キャリアアップ",
    },
    {
      title: "転職エージェントを最大活用する方法",
      slug: "tensyoku-agent-katsuyou",
      category: "エージェント活用",
    },
  ];

  return (
    <ArticleLayout
      title="30代の転職で使うべきエージェント"
      category="30代転職"
      readTime={6}
      publishedDate="2026年1月29日"
      relatedArticles={relatedArticles}
    >
      <header className="mb-12">
        <h1 className="mb-4 text-4xl font-bold leading-tight">
          30代の転職でエージェントを使うべき5つの理由
        </h1>
        <p className="text-lg text-gray-600">
          キャリアの転換期を迎える30代。転職を成功させるためには、プロのサポートが不可欠です。
        </p>
      </header>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">30代転職の現実</h2>
          <p>
            30代は、キャリアにおいて重要な転換期です。20代とは異なり、即戦力としての経験やスキルが求められる一方で、
            40代ほど選択肢が限られているわけでもありません。この微妙なバランスの中で、最適な転職先を見つけるには、
            市場を熟知したエージェントのサポートが欠かせません。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            理由1: 非公開求人へのアクセス
          </h2>
          <p>
            30代向けの好条件求人の多くは、非公開求人として扱われています。これは企業が即戦力となる人材を、
            競合他社に知られずに採用したいためです。転職エージェントを利用することで、
            一般には公開されていない年収800万円以上のポジションや、管理職候補の求人にアクセスできます。
          </p>
          <ul className="my-4 list-disc pl-6">
            <li>管理職・マネージャー候補の非公開求人</li>
            <li>年収アップが期待できるハイクラス案件</li>
            <li>企業の戦略的ポジションの求人</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            理由2: 市場価値の客観的な評価
          </h2>
          <p>
            30代になると、自分の市場価値を正確に把握することが難しくなります。
            これまでの経験やスキルが、現在の転職市場でどの程度評価されるのか、
            プロの視点でアドバイスを受けることができます。
          </p>
          <p>
            転職エージェントは、業界動向や企業のニーズを熟知しており、
            あなたのキャリアを最大限に活かせる転職先を提案してくれます。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            理由3: 年収交渉のプロによるサポート
          </h2>
          <p>
            30代の転職では、年収交渉が成功の鍵を握ります。しかし、自分で交渉するのは心理的にも難しく、
            適切な金額を提示できないことも。エージェントは、市場相場を踏まえた上で、
            あなたの価値を最大限に引き出す交渉を代行してくれます。
          </p>
          <div className="my-6 rounded-lg bg-blue-50 p-6">
            <p className="font-semibold">実績例：</p>
            <p>
              現職年収600万円 → 転職後年収750万円（25%アップ）
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            理由4: 効率的な転職活動の実現
          </h2>
          <p>
            30代は仕事が最も忙しい時期。転職活動に割ける時間は限られています。
            エージェントを利用すれば、求人の選定から応募書類の作成サポート、
            面接日程の調整まで、すべてを代行してもらえます。
          </p>
          <ul className="my-4 list-disc pl-6">
            <li>希望条件に合った求人の厳選提案</li>
            <li>職務経歴書の添削・アドバイス</li>
            <li>面接日程の調整代行</li>
            <li>複数社の選考進行管理</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            理由5: 転職後のキャリア設計支援
          </h2>
          <p>
            優れたエージェントは、単に転職先を紹介するだけでなく、
            その先のキャリアパスまで見据えたアドバイスを提供します。
            30代での転職は、40代、50代のキャリアを左右する重要な決断。
            長期的な視点でのサポートが受けられます。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">まとめ</h2>
          <p>
            30代の転職は、キャリアの重要な分岐点です。
            経験とスキルを最大限に活かし、次のステージへ進むためには、
            プロフェッショナルなサポートが不可欠です。
          </p>
          <p className="mt-4">
            転職エージェントは、非公開求人へのアクセス、市場価値の評価、年収交渉、
            効率的な活動支援、そして長期的なキャリア設計まで、
            あなたの転職成功をトータルでサポートします。
          </p>
        </section>

      <div className="my-12 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 p-8 md:p-12 text-white shadow-2xl">
        <div className="text-center">
          <div className="mb-6">
            <div className="mb-2 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-bold backdrop-blur-sm">
              完全無料・30秒で完了
            </div>
          </div>
          <h3 className="mb-4 text-3xl font-bold md:text-4xl">
            あなたに最適な<br />
            エージェントを見つけませんか？
          </h3>
          <p className="mb-8 text-lg opacity-95">
            あなたのキャリアや希望に合わせて<br />
            最適な転職エージェントをご紹介
          </p>
          <Link
            href="/gt/lp01deaeru/1"
            className="inline-flex items-center gap-3 rounded-full bg-white px-12 py-5 text-xl font-bold text-blue-600 shadow-2xl transition hover:scale-105 hover:bg-gray-50"
          >
            無料診断をはじめる
            <ArrowRight className="h-6 w-6" />
          </Link>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
            <span>✓ 30代特化型エージェント</span>
            <span>✓ キャリアアップサポート</span>
          </div>
        </div>
      </div>
    </ArticleLayout>
  );
}
