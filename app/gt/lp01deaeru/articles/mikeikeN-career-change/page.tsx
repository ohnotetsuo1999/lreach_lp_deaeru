import { type Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "../_components/ArticleLayout";
import {
  InsightCard,
  StepCard,
  CheckList,
  InlineCTA,
  AlertBox,
} from "../_components/ArticleComponents";
import { ArrowRight, Compass, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "未経験からのキャリアチェンジを成功させる完全ガイド｜出会えるエージェント",
  description: "未経験の業界・職種への転職は不安がつきもの。でも正しい戦略とサポートがあれば成功できます。未経験転職を成功させるための具体的な方法を解説します。",
  keywords: "未経験,キャリアチェンジ,転職,エージェント,異業種転職",
  openGraph: {
    title: "未経験からのキャリアチェンジを成功させる完全ガイド",
    description: "未経験の業界・職種への転職は不安がつきもの。でも正しい戦略とサポートがあれば成功できます。",
    type: "article",
  },
};

export default function Article() {
  const relatedArticles = [
    {
      title: "IT業界への未経験転職を成功させる方法",
      slug: "it-gyoukai-tensyoku",
      category: "業界転職",
    },
    {
      title: "第二新卒の転職完全ガイド",
      slug: "dainisinsotsu-tensyoku",
      category: "第二新卒",
    },
    {
      title: "20代が今すぐ動くべき3つの理由",
      slug: "20dai-ima-ugoku-riyuu",
      category: "転職タイミング",
    },
  ];

  return (
    <ArticleLayout
      title="未経験からのキャリアチェンジ成功法"
      category="キャリアチェンジ"
      readTime={7}
      publishedDate="2026年1月29日"
      relatedArticles={relatedArticles}
    >
      <header className="mb-12">
        <h1 className="mb-4 text-4xl font-bold leading-tight">
          未経験からのキャリアチェンジを成功させる完全ガイド
        </h1>
        <p className="text-lg text-gray-600">
          新しい業界・職種へのチャレンジ。不安を解消し、成功への道筋を明確にします。
        </p>
      </header>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            未経験転職は本当に可能なのか？
          </h2>
          <p>
            「未経験でも転職できるの？」これは多くの方が抱く疑問です。
            結論から言えば、答えは「YES」です。ただし、戦略的なアプローチが必要です。
          </p>
          <p>
            実際、転職市場では毎年多くの方が未経験の分野へのキャリアチェンジに成功しています。
            重要なのは、適切な準備と、未経験者の転職に強いエージェントのサポートです。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            未経験転職が成功しやすい業界・職種
          </h2>
          <div className="my-6 rounded-lg bg-gray-50 p-6">
            <h3 className="mb-3 text-xl font-bold">ポテンシャル採用が活発な分野</h3>
            <ul className="list-disc pl-6">
              <li className="mb-2">
                <strong>IT・Web業界：</strong>
                エンジニア、Webマーケター、デザイナーなど、スキル習得支援制度が充実
              </li>
              <li className="mb-2">
                <strong>営業職：</strong>
                コミュニケーション能力重視で、業界未経験者も歓迎
              </li>
              <li className="mb-2">
                <strong>人材業界：</strong>
                多様な業界経験が活かせるキャリアアドバイザー
              </li>
              <li className="mb-2">
                <strong>コンサルティング：</strong>
                業界特化型コンサルでは、その業界経験が強みに
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            転職可能性を高める3つのステップ
          </h2>
          
          <h3 className="mb-3 mt-6 text-2xl font-bold">
            ステップ1: 転用可能なスキルの棚卸し
          </h3>
          <p>
            未経験でも、これまでの経験で培ったスキルは必ず活かせます。
            例えば、プロジェクト管理能力、データ分析力、顧客折衝経験など、
            業界が変わっても価値のあるスキルを明確にしましょう。
          </p>

          <h3 className="mb-3 mt-6 text-2xl font-bold">
            ステップ2: 基礎知識・スキルの習得
          </h3>
          <p>
            完全に未経験よりも、基礎的な知識やスキルを身につけておくことで、
            採用確率は大きく上がります。オンライン学習プラットフォームを活用し、
            最低限の基礎を習得しておきましょう。
          </p>
          <ul className="my-4 list-disc pl-6">
            <li>IT：プログラミング基礎、資格取得（基本情報技術者など）</li>
            <li>マーケティング：Google Analytics、SNS運用の実践</li>
            <li>デザイン：ツールの基本操作、ポートフォリオ作成</li>
          </ul>

          <h3 className="mb-3 mt-6 text-2xl font-bold">
            ステップ3: 未経験転職に強いエージェントの活用
          </h3>
          <p>
            未経験転職で最も重要なのが、この分野に強いエージェントの選定です。
            一般的な転職エージェントでは、経験者優遇の求人が中心ですが、
            未経験者の転職支援に特化したエージェントなら、
            研修制度が充実した企業や、ポテンシャル採用を行う企業を紹介してもらえます。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            未経験転職を成功させるエージェントの選び方
          </h2>
          <div className="space-y-4">
            <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4">
              <h4 className="font-bold">未経験者向け求人の豊富さ</h4>
              <p className="mt-2 text-sm">
                「未経験歓迎」「ポテンシャル採用」の求人を多く保有しているか確認
              </p>
            </div>
            <div className="rounded-lg border-l-4 border-green-500 bg-green-50 p-4">
              <h4 className="font-bold">業界知識とネットワーク</h4>
              <p className="mt-2 text-sm">
                目指す業界に精通し、企業との強いパイプを持っているか
              </p>
            </div>
            <div className="rounded-lg border-l-4 border-purple-500 bg-purple-50 p-4">
              <h4 className="font-bold">サポート体制の充実度</h4>
              <p className="mt-2 text-sm">
                職務経歴書の添削、面接対策など、手厚いサポートがあるか
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">成功事例</h2>
          <div className="my-6 rounded-lg bg-yellow-50 p-6">
            <p className="mb-2">
              <strong>事務職 → Webマーケター（28歳・女性）</strong>
            </p>
            <p className="text-sm">
              独学でSNS運用を学び、エージェントの紹介で研修制度充実の企業へ。
              未経験ながら、前職での数値分析経験が評価され内定。
              年収は微減も、スキルアップできる環境を手に入れた。
            </p>
          </div>
          <div className="my-6 rounded-lg bg-yellow-50 p-6">
            <p className="mb-2">
              <strong>営業職 → ITエンジニア（32歳・男性）</strong>
            </p>
            <p className="text-sm">
              プログラミングスクールで基礎を学習後、エージェント経由で自社開発企業へ転職。
              前職の顧客折衝経験が、ユーザー視点を持つエンジニアとして評価された。
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">まとめ</h2>
          <p>
            未経験からのキャリアチェンジは、決して簡単な道ではありません。
            しかし、適切な準備と、信頼できるエージェントのサポートがあれば、
            確実に実現できる目標です。
          </p>
          <p className="mt-4">
            重要なのは、これまでの経験を活かしながら、新しい分野で求められる
            基礎スキルを身につけること。そして、未経験転職に強いエージェントを見つけ、
            二人三脚で転職活動を進めることです。
          </p>
        </section>

      <div className="my-12 overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 p-8 md:p-12 text-white shadow-2xl">
        <div className="text-center">
          <div className="mb-6">
            <div className="mb-2 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-bold backdrop-blur-sm">
              完全無料・30秒で完了
            </div>
          </div>
          <h3 className="mb-4 text-3xl font-bold md:text-4xl">
            未経験転職に強い<br />
            エージェントを見つけよう
          </h3>
          <p className="mb-8 text-lg opacity-95">
            あなたのキャリアに合ったエージェントを<br />
            無料診断で発見
          </p>
          <Link
            href="/gt/lp01deaeru/1"
            className="inline-flex items-center gap-3 rounded-full bg-white px-12 py-5 text-xl font-bold text-purple-600 shadow-2xl transition hover:scale-105 hover:bg-gray-50"
          >
            無料診断をはじめる
            <ArrowRight className="h-6 w-6" />
          </Link>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
            <span>✓ 未経験転職サポート</span>
            <span>✓ キャリアチェンジ成功率UP</span>
          </div>
        </div>
      </div>
    </ArticleLayout>
  );
}
