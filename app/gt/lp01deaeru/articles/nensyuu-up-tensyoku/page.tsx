import { type Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "../_components/ArticleLayout";
import {
  InsightCard,
  StatsBox,
  CheckList,
  InlineCTA,
  AlertBox,
  ComparisonTable,
} from "../_components/ArticleComponents";
import { ArrowRight, TrendingUp, DollarSign } from "lucide-react";

export const metadata: Metadata = {
  title: "年収アップを実現する転職術｜給与交渉で失敗しないコツ｜出会えるエージェント",
  description: "転職で年収を上げたい方必見。年収アップを実現するための具体的な戦略、交渉術、タイミング、エージェントの活用方法まで徹底解説します。",
  keywords: "年収アップ,転職,給与交渉,年収,エージェント,キャリアアップ",
  openGraph: {
    title: "年収アップを実現する転職術｜給与交渉で失敗しないコツ",
    description: "転職で年収を上げたい方必見。年収アップを実現するための具体的な戦略を徹底解説します。",
    type: "article",
  },
};

export default function Article() {
  const relatedArticles = [
    {
      title: "20代で年収100万UPさせる人がやってること",
      slug: "20dai-nensyuu-up-himitsu",
      category: "年収アップ",
    },
    {
      title: "年収300万円台から脱出する方法",
      slug: "20dai-nensyuu-300man-dasshutu",
      category: "年収アップ",
    },
    {
      title: "初めての転職で年収90万UP！成功の理由",
      slug: "20dai-first-tensyoku",
      category: "成功事例",
    },
  ];

  return (
    <ArticleLayout
      title="年収を最大化する転職テクニック"
      category="年収アップ"
      readTime={8}
      publishedDate="2026年1月29日"
      relatedArticles={relatedArticles}
    >
      <header className="mb-12">
        <h1 className="mb-4 text-4xl font-bold leading-tight">
          年収アップを実現する転職術
        </h1>
        <p className="text-lg text-gray-600">
          給与交渉で失敗しない。転職で確実に年収を上げる方法を解説します。
        </p>
      </header>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            転職で年収は本当に上がるのか？
          </h2>
          <p>
            結論から言えば、戦略的に転職活動を行えば、年収アップは十分に可能です。
            実際、転職経験者の約60%が年収アップに成功しているというデータもあります。
          </p>
          <div className="my-6 rounded-lg bg-green-50 p-6">
            <h3 className="mb-3 font-bold">年収アップ転職の実績データ</h3>
            <ul className="list-disc pl-6">
              <li>20代：平均10〜15%のアップ</li>
              <li>30代：平均15〜25%のアップ</li>
              <li>40代：平均20〜30%のアップ（専門性が高い場合）</li>
            </ul>
            <p className="mt-4 text-sm text-gray-600">
              ※エージェント経由での転職成功者の平均値
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            年収アップに成功する人の5つの特徴
          </h2>
          
          <div className="my-6 space-y-6">
            <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-6">
              <h3 className="mb-2 text-xl font-bold">1. 市場価値を正確に把握している</h3>
              <p>
                自分のスキルや経験が市場でどう評価されるか理解し、
                適正な年収水準を知っている。
              </p>
            </div>

            <div className="rounded-lg border-l-4 border-green-500 bg-green-50 p-6">
              <h3 className="mb-2 text-xl font-bold">2. 転職タイミングを見極めている</h3>
              <p>
                業界の需要動向、企業の採用時期、自身のキャリアの節目など、
                最適なタイミングで動いている。
              </p>
            </div>

            <div className="rounded-lg border-l-4 border-purple-500 bg-purple-50 p-6">
              <h3 className="mb-2 text-xl font-bold">3. 実績を数値化して伝えられる</h3>
              <p>
                「売上を150%向上させた」「コストを30%削減した」など、
                具体的な数値で成果を示せる。
              </p>
            </div>

            <div className="rounded-lg border-l-4 border-orange-500 bg-orange-50 p-6">
              <h3 className="mb-2 text-xl font-bold">4. 複数の選択肢を持っている</h3>
              <p>
                一社だけでなく、複数社から内定を得ることで、
                交渉の余地を作り出している。
              </p>
            </div>

            <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-6">
              <h3 className="mb-2 text-xl font-bold">5. プロのサポートを受けている</h3>
              <p>
                転職エージェントを活用し、市場動向の把握から給与交渉まで、
                プロの知見を借りている。
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            年収アップを実現する5つのステップ
          </h2>
          
          <h3 className="mb-3 mt-6 text-2xl font-bold">
            ステップ1: 自分の市場価値を知る
          </h3>
          <p>
            まずは、同業界・同職種での平均年収を調査しましょう。
            転職サイトの年収診断ツールや、エージェントへの相談を通じて、
            客観的な市場価値を把握することが重要です。
          </p>

          <h3 className="mb-3 mt-6 text-2xl font-bold">
            ステップ2: 実績の棚卸しと数値化
          </h3>
          <p>
            これまでのキャリアで達成した実績を洗い出し、可能な限り数値化します。
          </p>
          <div className="my-4 rounded-lg bg-gray-50 p-4">
            <p className="mb-2 font-bold">実績の数値化例：</p>
            <ul className="list-disc pl-6 text-sm">
              <li>新規顧客を年間50社獲得し、売上2億円に貢献</li>
              <li>業務効率化により、月間作業時間を40時間削減</li>
              <li>チームマネジメントで、メンバー5名の育成を実施</li>
              <li>プロジェクトを予算内・期限内で100%完遂</li>
            </ul>
          </div>

          <h3 className="mb-3 mt-6 text-2xl font-bold">
            ステップ3: 年収アップが期待できる企業を選ぶ
          </h3>
          <p>
            どんなに交渉してもも、企業の予算や給与レンジには限界があります。
            最初から年収アップが期待できる企業を選ぶことが重要です。
          </p>
          <ul className="my-4 list-disc pl-6">
            <li>成長産業・成長企業（IT、DX関連など）</li>
            <li>外資系企業（成果主義で年収が高い傾向）</li>
            <li>ベンチャー企業（ストックオプション含む）</li>
            <li>管理職・マネージャーポジション</li>
          </ul>

          <h3 className="mb-3 mt-6 text-2xl font-bold">
            ステップ4: 希望年収を戦略的に設定
          </h3>
          <p>
            希望年収は、現年収の10〜30%増を目安に設定しましょう。
            ただし、根拠なく高額を提示するのはNG。
            市場価値と実績に基づいた、説得力のある金額を提示することが重要です。
          </p>
          <div className="my-6 rounded-lg bg-yellow-50 p-6">
            <p className="mb-2 font-bold">交渉のポイント：</p>
            <ul className="list-disc pl-6 text-sm">
              <li>希望額は少し高めに設定（交渉の余地を作る）</li>
              <li>最低ラインも明確に持っておく</li>
              <li>年収だけでなく、福利厚生も含めて評価</li>
              <li>複数内定があることを示唆する</li>
            </ul>
          </div>

          <h3 className="mb-3 mt-6 text-2xl font-bold">
            ステップ5: エージェントに交渉を任せる
          </h3>
          <p>
            給与交渉は、自分で行うよりもエージェントに任せた方が成功率が高まります。
            エージェントは企業との交渉のプロであり、市場相場を熟知しています。
            また、あなたの代わりに交渉することで、企業との関係性を損なうこともありません。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            給与交渉で絶対にやってはいけないこと
          </h2>
          
          <div className="my-6 space-y-4">
            <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
              <h4 className="font-bold text-red-600">❌ 根拠なく高額を要求する</h4>
              <p className="mt-2 text-sm">
                市場価値とかけ離れた金額を提示すると、交渉そのものが破談になる可能性があります。
              </p>
            </div>
            <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
              <h4 className="font-bold text-red-600">❌ 現職の不満を理由にする</h4>
              <p className="mt-2 text-sm">
                「今の会社が安いから」ではなく、「自分の市場価値に見合った評価を」という
                ポジティブな理由を伝えましょう。
              </p>
            </div>
            <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
              <h4 className="font-bold text-red-600">❌ 内定後に大幅な増額を要求</h4>
              <p className="mt-2 text-sm">
                希望年収は選考の早い段階で伝えておくべき。
                内定後の大幅変更は、信頼を損ないます。
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            年代別：年収アップ転職の戦略
          </h2>
          
          <div className="my-6 rounded-lg bg-blue-50 p-6">
            <h3 className="mb-3 text-xl font-bold">20代：スキルアップ×年収アップ</h3>
            <p>
              20代は、年収だけでなく成長環境も重視しましょう。
              スキルが身につく環境で経験を積めば、30代でさらに大きな年収アップが期待できます。
            </p>
          </div>

          <div className="my-6 rounded-lg bg-green-50 p-6">
            <h3 className="mb-3 text-xl font-bold">30代：専門性×マネジメント</h3>
            <p>
              30代は専門性やマネジメント経験が評価される時期。
              これまでの実績をアピールし、管理職候補としてのポジションを狙いましょう。
              年収500万円→700万円といった大幅アップも十分可能です。
            </p>
          </div>

          <div className="my-6 rounded-lg bg-purple-50 p-6">
            <h3 className="mb-3 text-xl font-bold">40代以上：経験×ポジション</h3>
            <p>
              40代以上は、これまでの豊富な経験を活かせる経営層に近いポジションや、
              専門性の高いスペシャリストポジションで年収アップを狙いましょう。
              年収1000万円超えも視野に入ります。
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">まとめ</h2>
          <p>
            年収アップを実現する転職は、決して運任せではありません。
            市場価値の把握、実績の数値化、戦略的な企業選び、そして適切な交渉。
            これらのステップを踏むことで、確実に年収を上げることができます。
          </p>
          <p className="mt-4">
            特に重要なのが、給与交渉におけるエージェントの活用です。
            自分では言いにくい年収の話も、プロが代わりに交渉してくれるため、
            希望額を実現できる確率が大幅に上がります。
          </p>
        </section>

      <div className="my-12 overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 p-8 md:p-12 text-white shadow-2xl">
        <div className="text-center">
          <div className="mb-6">
            <div className="mb-2 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-bold backdrop-blur-sm">
              完全無料・30秒で完了
            </div>
          </div>
          <h3 className="mb-4 text-3xl font-bold md:text-4xl">
            年収アップに強い<br />
            エージェントを見つけよう
          </h3>
          <p className="mb-8 text-lg opacity-95">
            年収交渉のプロがいるエージェント<br />
            高年収求人が豊富なエージェント
          </p>
          <Link
            href="/gt/lp01deaeru/1"
            className="inline-flex items-center gap-3 rounded-full bg-white px-12 py-5 text-xl font-bold text-emerald-600 shadow-2xl transition hover:scale-105 hover:bg-gray-50"
          >
            無料診断をはじめる
            <ArrowRight className="h-6 w-6" />
          </Link>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
            <span>✓ 年収交渉のプロ</span>
            <span>✓ 高年収求人豊富</span>
          </div>
        </div>
      </div>
    </ArticleLayout>
  );
}
