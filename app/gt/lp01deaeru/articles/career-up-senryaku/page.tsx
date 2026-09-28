import { type Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "../_components/ArticleLayout";
import {
  InsightCard,
  StatsBox,
  CheckList,
  InlineCTA,
  AlertBox,
} from "../_components/ArticleComponents";
import { ArrowRight, TrendingUp, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "キャリアアップのための転職戦略｜市場価値を高める方法｜出会えるエージェント",
  description: "キャリアアップを実現する転職戦略。市場価値の高め方、スキルアップの方法、キャリアプランの立て方まで徹底解説します。",
  keywords: "キャリアアップ,転職,戦略,市場価値,スキルアップ,エージェント",
  openGraph: {
    title: "キャリアアップのための転職戦略｜市場価値を高める方法",
    description: "キャリアアップを実現する転職戦略を徹底解説します。",
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
      title: "年収を最大化する転職テクニック",
      slug: "nensyuu-up-tensyoku",
      category: "年収アップ",
    },
    {
      title: "30代の転職で使うべきエージェント",
      slug: "30dai-tensyoku-agent",
      category: "30代転職",
    },
  ];

  return (
    <ArticleLayout
      title="キャリアアップのための転職戦略"
      category="キャリアアップ"
      readTime={8}
      publishedDate="2026年1月29日"
      relatedArticles={relatedArticles}
    >
      <header className="mb-12">
        <h1 className="mb-4 text-4xl font-bold leading-tight">
          キャリアアップのための転職戦略
        </h1>
        <p className="text-lg text-gray-600">
          戦略的に動く。市場価値を最大化し、理想のキャリアを築く方法。
        </p>
      </header>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            キャリアアップとは何か？
          </h2>
          <p>
            キャリアアップとは、単に「年収が上がること」ではありません。
            より責任のある立場、より専門性の高いポジション、
            より大きな裁量権を持って働けること。
            これらすべてを含む、総合的な成長がキャリアアップです。
          </p>
          <div className="my-6 rounded-lg bg-blue-50 p-6">
            <h3 className="mb-3 font-bold">キャリアアップの3つの軸</h3>
            <ul className="list-disc pl-6">
              <li><strong>報酬：</strong>年収、福利厚生の向上</li>
              <li><strong>ポジション：</strong>役職、責任範囲の拡大</li>
              <li><strong>専門性：</strong>スキル、知識、経験の深化</li>
            </ul>
            <p className="mt-4 text-sm text-gray-600">
              この3つをバランスよく高めることが、
              真のキャリアアップにつながります。
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            市場価値を高める5つの要素
          </h2>
          
          <div className="my-6 space-y-6">
            <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-6">
              <h3 className="mb-2 text-xl font-bold">1. 専門スキル（Technical Skills）</h3>
              <p>
                職種特有の専門的なスキル。
                エンジニアならプログラミング、営業なら交渉力など、
                その道のプロフェッショナルとして認められるレベルのスキルです。
              </p>
              <ul className="mt-3 list-disc pl-6 text-sm">
                <li>最新の技術トレンドをキャッチアップ</li>
                <li>資格取得でスキルを可視化</li>
                <li>実務での実績を積み上げる</li>
              </ul>
            </div>

            <div className="rounded-lg border-l-4 border-green-500 bg-green-50 p-6">
              <h3 className="mb-2 text-xl font-bold">2. ポータブルスキル（Transferable Skills）</h3>
              <p>
                業界・職種が変わっても通用する汎用的なスキル。
                これがあることで、キャリアの選択肢が広がります。
              </p>
              <ul className="mt-3 list-disc pl-6 text-sm">
                <li>ロジカルシンキング・問題解決能力</li>
                <li>コミュニケーション能力</li>
                <li>プロジェクトマネジメント</li>
                <li>データ分析力</li>
              </ul>
            </div>

            <div className="rounded-lg border-l-4 border-purple-500 bg-purple-50 p-6">
              <h3 className="mb-2 text-xl font-bold">3. 業界知識・人脈（Industry Knowledge & Network）</h3>
              <p>
                特定業界での深い知見と、信頼できる人脈は、
                転職市場で大きな差別化要因になります。
              </p>
              <ul className="mt-3 list-disc pl-6 text-sm">
                <li>業界の最新動向を常にフォロー</li>
                <li>業界イベント・勉強会への参加</li>
                <li>SNSでの情報発信・交流</li>
              </ul>
            </div>

            <div className="rounded-lg border-l-4 border-orange-500 bg-orange-50 p-6">
              <h3 className="mb-2 text-xl font-bold">4. マネジメント経験（Management Experience）</h3>
              <p>
                30代以降は、マネジメント経験の有無が大きな分かれ道に。
                チームを率いた経験は、市場価値を大きく高めます。
              </p>
              <ul className="mt-3 list-disc pl-6 text-sm">
                <li>何名のチームを管理したか</li>
                <li>予算管理、採用、育成の経験</li>
                <li>プロジェクト全体の統括経験</li>
              </ul>
            </div>

            <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-6">
              <h3 className="mb-2 text-xl font-bold">5. 成果・実績（Track Record）</h3>
              <p>
                何を成し遂げたか。数値で示せる明確な実績が、
                市場価値を最も直接的に証明します。
              </p>
              <ul className="mt-3 list-disc pl-6 text-sm">
                <li>売上貢献額、コスト削減額</li>
                <li>新規顧客獲得数、プロジェクト成功数</li>
                <li>受賞歴、メディア掲載など</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            年代別：キャリアアップの戦略
          </h2>
          
          <h3 className="mb-3 mt-6 text-2xl font-bold">
            20代：基礎を固め、専門性を見つける時期
          </h3>
          <div className="my-4 rounded-lg bg-blue-50 p-6">
            <p className="mb-3"><strong>重点的に伸ばすべきもの：</strong></p>
            <ul className="mb-4 list-disc pl-6 text-sm">
              <li>ポータブルスキル（特にロジカルシンキング）</li>
              <li>専門スキルの基礎</li>
              <li>多様な経験（色々な業務に挑戦）</li>
            </ul>
            <p className="mb-3"><strong>転職のポイント：</strong></p>
            <ul className="list-disc pl-6 text-sm">
              <li>成長できる環境を最優先に選ぶ</li>
              <li>年収よりもスキル習得を重視</li>
              <li>未経験職種へのチャレンジもできる最後のチャンス</li>
            </ul>
          </div>

          <h3 className="mb-3 mt-6 text-2xl font-bold">
            30代：専門性を深め、マネジメントへ
          </h3>
          <div className="my-4 rounded-lg bg-green-50 p-6">
            <p className="mb-3"><strong>重点的に伸ばすべきもの：</strong></p>
            <ul className="mb-4 list-disc pl-6 text-sm">
              <li>専門性の深化（その分野のプロになる）</li>
              <li>マネジメントスキル</li>
              <li>数値で示せる実績</li>
            </ul>
            <p className="mb-3"><strong>転職のポイント：</strong></p>
            <ul className="list-disc pl-6 text-sm">
              <li>マネージャー、リーダーポジションを狙う</li>
              <li>専門性を活かした年収アップ</li>
              <li>次の会社では5年以上勤める覚悟で選ぶ</li>
            </ul>
          </div>

          <h3 className="mb-3 mt-6 text-2xl font-bold">
            40代以上：経験を活かし、経営に近づく
          </h3>
          <div className="my-4 rounded-lg bg-purple-50 p-6">
            <p className="mb-3"><strong>重点的に伸ばすべきもの：</strong></p>
            <ul className="mb-4 list-disc pl-6 text-sm">
              <li>経営的視点</li>
              <li>事業全体を見渡す力</li>
              <li>次世代の育成力</li>
            </ul>
            <p className="mb-3"><strong>転職のポイント：</strong></p>
            <ul className="list-disc pl-6 text-sm">
              <li>経営幹部、CxOポジションを狙う</li>
              <li>業界の知見を活かせる企業へ</li>
              <li>ハイクラス・エグゼクティブ向けエージェント活用必須</li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            キャリアアップのための転職タイミング
          </h2>
          
          <div className="my-6 space-y-4">
            <div className="rounded-lg border-2 border-green-200 bg-green-50 p-6">
              <h3 className="mb-3 text-xl font-bold text-green-600">
                転職すべきタイミング
              </h3>
              <ul className="list-disc pl-6 text-sm">
                <li>現職で成長が止まったと感じた時</li>
                <li>明確にやりたいことが見つかった時</li>
                <li>市場価値が高まっている時（スカウトが増えたなど）</li>
                <li>重要なプロジェクトを成功させた直後</li>
                <li>マネジメント経験を積んだ時</li>
              </ul>
            </div>

            <div className="rounded-lg border-2 border-red-200 bg-red-50 p-6">
              <h3 className="mb-3 text-xl font-bold text-red-600">
                転職を待つべきタイミング
              </h3>
              <ul className="list-disc pl-6 text-sm">
                <li>入社1年未満（よほどの理由がない限り）</li>
                <li>重要なプロジェクトの途中</li>
                <li>昇進・昇給が目前に控えている時</li>
                <li>スキルが中途半端な状態</li>
                <li>感情的になっている時</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            キャリアプランの立て方
          </h2>
          
          <h3 className="mb-3 mt-6 text-2xl font-bold">
            ステップ1: 理想のキャリアゴールを設定
          </h3>
          <p>
            5年後、10年後、どうなっていたいか？
            具体的なゴールを設定しましょう。
          </p>
          <div className="my-4 rounded-lg bg-gray-50 p-4">
            <p className="mb-2 text-sm font-bold">例：</p>
            <ul className="list-disc pl-6 text-sm">
              <li>「10年後には、IT企業のCTOになりたい」</li>
              <li>「5年後には、年収1000万円を達成したい」</li>
              <li>「将来は、マーケティングのスペシャリストとして独立したい」</li>
            </ul>
          </div>

          <h3 className="mb-3 mt-6 text-2xl font-bold">
            ステップ2: 現在地を把握する
          </h3>
          <p>
            自分の現在のスキル、経験、市場価値を客観的に評価しましょう。
          </p>
          <ul className="my-4 list-disc pl-6">
            <li>何ができるか（保有スキル）</li>
            <li>何が足りないか（スキルギャップ）</li>
            <li>現在の市場価値（年収診断ツール、エージェントの評価）</li>
          </ul>

          <h3 className="mb-3 mt-6 text-2xl font-bold">
            ステップ3: ギャップを埋める行動計画を立てる
          </h3>
          <p>
            理想と現実のギャップを埋めるために、
            何をすべきか具体的なアクションプランを作りましょう。
          </p>
          <div className="my-4 rounded-lg bg-blue-50 p-6">
            <p className="mb-2 text-sm font-bold">行動計画の例：</p>
            <ul className="list-disc pl-6 text-sm">
              <li>半年以内：プロジェクトマネージャー資格を取得</li>
              <li>1年以内：社内で小規模チームのリーダーを経験</li>
              <li>2年以内：5名以上のチームマネジメント経験を積む</li>
              <li>3年以内：管理職候補として転職</li>
            </ul>
          </div>

          <h3 className="mb-3 mt-6 text-2xl font-bold">
            ステップ4: 定期的に見直す
          </h3>
          <p>
            キャリアプランは、状況に応じて柔軟に見直すことが重要です。
            半年〜1年に一度、現在地を確認し、計画を修正しましょう。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            スキルアップの具体的な方法
          </h2>
          
          <h3 className="mb-3 mt-6 text-2xl font-bold">
            1. 実務での経験
          </h3>
          <p>
            最も効果的なのは、実務での経験です。
            新しいプロジェクトに積極的に手を挙げ、
            チャレンジングな業務に取り組みましょう。
          </p>

          <h3 className="mb-3 mt-6 text-2xl font-bold">
            2. 資格取得
          </h3>
          <p>
            資格は、スキルを客観的に証明する手段です。
            特に、IT、会計、語学などの分野では有効です。
          </p>
          <ul className="my-4 list-disc pl-6 text-sm">
            <li>IT：基本情報技術者、AWS認定、CCNA など</li>
            <li>会計：簿記、公認会計士、税理士 など</li>
            <li>語学：TOEIC、TOEFL、中国語検定 など</li>
            <li>PM：PMP、プロジェクトマネージャ など</li>
          </ul>

          <h3 className="mb-3 mt-6 text-2xl font-bold">
            3. オンライン学習
          </h3>
          <p>
            Udemy、Coursera、Progateなど、
            オンライン学習プラットフォームを活用しましょう。
            自分のペースで、必要なスキルを学べます。
          </p>

          <h3 className="mb-3 mt-6 text-2xl font-bold">
            4. 副業・個人プロジェクト
          </h3>
          <p>
            本業で経験できないことを、副業や個人プロジェクトで補いましょう。
            ポートフォリオとしても活用できます。
          </p>

          <h3 className="mb-3 mt-6 text-2xl font-bold">
            5. 情報発信
          </h3>
          <p>
            ブログ、Qiita、noteなどで学んだことを発信しましょう。
            アウトプットすることで理解が深まり、認知度も上がります。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            キャリアアップ転職の成功事例
          </h2>
          
          <div className="my-6 space-y-6">
            <div className="rounded-lg bg-yellow-50 p-6">
              <p className="mb-2 font-bold">
                事例1: エンジニア → テックリード
              </p>
              <p className="mb-2 text-sm">
                <strong>28歳・男性 / 年収：550万円 → 750万円</strong>
              </p>
              <p className="text-sm">
                Web開発エンジニアとして4年勤務後、
                より技術的にチャレンジングな環境を求めて転職。
                OSS活動やQiitaでの技術発信が評価され、
                成長中のスタートアップのテックリードとして採用された。
                少数精鋭チームで、技術選定から開発まで幅広く担当。
              </p>
            </div>

            <div className="my-6 rounded-lg bg-yellow-50 p-6">
              <p className="mb-2 font-bold">
                事例2: 営業 → 営業マネージャー
              </p>
              <p className="mb-2 text-sm">
                <strong>33歳・女性 / 年収：600万円 → 800万円</strong>
              </p>
              <p className="text-sm">
                営業として7年間、トップセールスの実績を残した後、
                マネジメント経験を積むために転職を決意。
                前職での営業成績（目標達成率150%、新規顧客80社獲得）が評価され、
                成長中のSaaS企業で営業マネージャーとして採用。
                10名のチームを率い、組織づくりに挑戦中。
              </p>
            </div>

            <div className="my-6 rounded-lg bg-yellow-50 p-6">
              <p className="mb-2 font-bold">
                事例3: マーケター → CMO候補
              </p>
              <p className="mb-2 text-sm">
                <strong>38歳・男性 / 年収：750万円 → 1000万円（+SO）</strong>
              </p>
              <p className="text-sm">
                大手企業でマーケティング部門のマネージャーとして10年勤務。
                より経営に近いポジションで働きたいと考え、
                ベンチャー企業のCMO候補として転職。
                マーケティング戦略の立案から実行まで、
                全権を任され、やりがいを感じている。
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">まとめ</h2>
          <p>
            キャリアアップは、一朝一夕には実現できません。
            明確なゴール設定、現状把握、そして具体的なアクションプラン。
            この3つを繰り返すことで、着実にキャリアは上昇していきます。
          </p>
          <p className="mt-4">
            転職は、キャリアアップの有力な手段の一つです。
            しかし、闇雲に転職を繰り返すのではなく、
            「今の転職が、5年後・10年後のキャリアにどう繋がるか」を
            常に意識することが重要です。
          </p>
          <p className="mt-4">
            市場価値を高め、理想のキャリアを実現するために、
            キャリアに精通したエージェントのアドバイスを受けることも有効です。
            客観的な視点でのキャリア相談、市場価値の診断、
            キャリアプランの策定など、プロの力を借りることで、
            より戦略的なキャリア形成が可能になります。
          </p>
        </section>

      <div className="my-12 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 p-8 md:p-12 text-white shadow-2xl">
        <div className="text-center">
          <div className="mb-6">
            <div className="mb-2 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-bold backdrop-blur-sm">
              完全無料・30秒で完了
            </div>
          </div>
          <h3 className="mb-4 text-3xl font-bold md:text-4xl">
            キャリアアップを支援してくれる<br />
            エージェントを見つけよう
          </h3>
          <p className="mb-8 text-lg opacity-95">
            あなたのキャリアゴールに合わせて最適な転職先を提案<br />
            長期的なキャリア形成をサポート
          </p>
          <Link
            href="/gt/lp01deaeru/1"
            className="inline-flex items-center gap-3 rounded-full bg-white px-12 py-5 text-xl font-bold text-orange-600 shadow-2xl transition hover:scale-105 hover:bg-gray-50"
          >
            無料診断をはじめる
            <ArrowRight className="h-6 w-6" />
          </Link>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
            <span>✓ キャリア相談も可能</span>
            <span>✓ 長期的なキャリア形成をサポート</span>
          </div>
        </div>
      </div>
    </ArticleLayout>
  );
}
