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
  QuoteBlock,
} from "../_components/ArticleComponents";
import { Users, TrendingDown, TrendingUp, Target, XCircle, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "【20代向け】転職エージェントの選び方で人生変わる話｜出会えるエージェント",
  description: "転職エージェント選びを間違えると、ブラック企業に入社したり、年収が下がったり...。20代が絶対に失敗しないエージェントの選び方を教えます。",
  keywords: "20代,転職エージェント,選び方,比較,おすすめ",
  openGraph: {
    title: "【20代向け】転職エージェントの選び方で人生変わる話",
    description: "エージェント選びを間違えると、人生損します。20代が知っておくべきエージェントの選び方。",
    type: "article",
  },
};

export default function Article() {
  const relatedArticles = [
    {
      title: "転職エージェントは3社使わないと損",
      slug: "20dai-3sha-tsukaou",
      category: "エージェント活用",
    },
    {
      title: "初めての転職で年収90万UP",
      slug: "20dai-first-tensyoku",
      category: "成功事例",
    },
    {
      title: "ブラック企業を100%避ける転職術",
      slug: "20dai-black-kigyo-sakekata",
      category: "企業選び",
    },
  ];

  return (
    <ArticleLayout
      title="転職エージェントの選び方で人生変わる話"
      category="エージェント選びの極意"
      readTime={6}
      publishedDate="2026年1月29日"
      relatedArticles={relatedArticles}
    >
      <header className="mb-12">
        <h1 className="mb-6 text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
          転職エージェント選びを間違えた友達が<br />
          ブラック企業に入社して後悔してる話
        </h1>
        <p className="text-lg leading-relaxed text-gray-600">
          マジでエージェント選び大事。私と友達の転職結果が真逆になった理由
        </p>
      </header>

      {/* ビジュアル比較 */}
      <div className="my-10 overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 p-8 md:p-12 border-2 border-gray-300">
        <p className="mb-8 text-center text-2xl font-bold text-gray-800">
          私と友達、同時に転職活動したのに結果が真逆に...
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border-2 border-green-400 bg-green-50 p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-center gap-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <p className="text-xl font-bold text-green-800">私の場合 🎉</p>
            </div>
            <CheckList
              type="success"
              items={[
                "年収90万UP（290万→380万）",
                "週2在宅勤務OK",
                "残業ほぼなし（月10時間以内）",
                "やりがいある仕事",
                "転職して本当によかった！",
              ]}
            />
          </div>

          <div className="rounded-xl border-2 border-red-400 bg-red-50 p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-center gap-2">
              <TrendingDown className="h-8 w-8 text-red-600" />
              <p className="text-xl font-bold text-red-800">友達の場合 😭</p>
            </div>
            <CheckList
              type="danger"
              items={[
                "年収変わらず",
                "フルリモート不可",
                "残業月40時間超え",
                "入社3ヶ月で辞めたくなってる",
                "「転職失敗した...」",
              ]}
            />
          </div>
        </div>
      </div>

      <p className="my-8 text-center text-2xl font-bold text-gray-900 md:text-3xl">
        なぜこんなに差がついたのか？
      </p>

      <div className="my-8 overflow-hidden rounded-2xl border-2 border-yellow-400">
        <div className="bg-yellow-500 px-6 py-4">
          <p className="text-center font-bold text-white text-xl">答え</p>
        </div>
        <div className="bg-yellow-50 p-8">
          <p className="mb-6 text-center text-3xl font-bold text-gray-900">
            使った転職エージェントが<br />
            <span className="text-red-600">違った</span>から
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-white p-5 shadow-md border border-green-200">
              <div className="mb-2 flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                <p className="font-bold text-green-700">私の場合：</p>
              </div>
              <p className="text-sm text-gray-700">
                「出会えるエージェント」で<br />
                <strong className="font-bold text-green-700">自分に合うエージェント3社</strong>を紹介してもらった
              </p>
            </div>
            <div className="rounded-lg bg-white p-5 shadow-md border border-red-200">
              <div className="mb-2 flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <p className="font-bold text-red-700">友達の場合：</p>
              </div>
              <p className="text-sm text-gray-700">
                CMでよく見る大手転職サイトに<br />
                <strong className="font-bold text-red-700">テキトーに登録しただけ</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">
          【衝撃】転職エージェントって全然違う
        </h2>
        
        <p className="mb-6 leading-relaxed text-gray-700">
          正直、転職エージェントって<br />
          <strong className="font-bold text-red-600">「どこも同じでしょ？」</strong>
          って思ってませんか？
        </p>

        <p className="mb-6 text-xl font-bold text-gray-900">
          私もそう思ってました。<br />
          でも、<span className="text-red-600">全っ然違います。</span>
        </p>

        <div className="my-8 space-y-6">
          <div className="rounded-xl border-l-4 border-red-500 bg-red-50 p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-bold text-red-900">
              違い① 紹介される求人の質
            </h3>
            <ComparisonTable
              items={[
                {
                  label: "求人の質",
                  before: "ブラック企業も平気で紹介",
                  after: "厳選された優良企業のみ",
                },
                {
                  label: "紹介の仕方",
                  before: "「とりあえず数打ちゃ当たる」",
                  after: "あなたに合う企業を厳選",
                },
                {
                  label: "離職率",
                  before: "高い会社が多い",
                  after: "長く働ける会社だけ",
                },
              ]}
            />
          </div>

          <div className="rounded-xl border-l-4 border-orange-500 bg-orange-50 p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-bold text-orange-900">
              違い② 年収交渉の本気度
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-white p-4 border border-red-200">
                <p className="mb-2 text-sm font-bold text-red-700">❌ 適当なエージェント</p>
                <ul className="space-y-1 text-xs text-gray-700">
                  <li>「この年収で決まりです」</li>
                  <li>交渉してくれない</li>
                  <li>早く決めたいだけ</li>
                </ul>
              </div>
              <div className="rounded-lg bg-white p-4 border border-green-200">
                <p className="mb-2 text-sm font-bold text-green-700">✅ いいエージェント</p>
                <ul className="space-y-1 text-xs text-gray-700">
                  <li>粘り強く交渉してくれる</li>
                  <li>+10〜30万円上乗せも</li>
                  <li>あなたの味方</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-xl border-l-4 border-blue-500 bg-blue-50 p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-bold text-blue-900">
              違い③ サポートの質
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-white p-4 border border-red-200">
                <p className="mb-2 text-sm font-bold text-red-700">❌ 適当なエージェント</p>
                <ul className="space-y-1 text-xs text-gray-700">
                  <li>「自分でやってください」</li>
                  <li>面接対策なし</li>
                  <li>連絡が遅い・雑</li>
                </ul>
              </div>
              <div className="rounded-lg bg-white p-4 border border-green-200">
                <p className="mb-2 text-sm font-bold text-green-700">✅ いいエージェント</p>
                <ul className="space-y-1 text-xs text-gray-700">
                  <li>職務経歴書を一緒に作成</li>
                  <li>模擬面接を何度でも</li>
                  <li>レスポンスが早い</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="my-10 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 p-8 text-white shadow-xl">
          <p className="mb-4 text-center text-2xl font-bold">つまり...</p>
          <p className="text-center leading-relaxed text-lg">
            <strong>エージェント選びを間違えると、</strong><br />
            転職活動が辛くなるし、<br />
            変な会社に入社しちゃうし、<br />
            年収も上がらない。<br />
            <br />
            <span className="text-3xl font-bold">マジで損します。</span>
          </p>
        </div>
      </section>

      <InlineCTA text="エージェント選びで失敗したくないなら、今すぐ" />

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">
          じゃあ、どうやって「いいエージェント」を見つけるの？
        </h2>
        
        <p className="mb-6 leading-relaxed text-gray-700">
          ここで問題なのが、<br />
          <strong className="font-bold text-red-600">「どのエージェントがいいか、使う前にはわからない」</strong>
          ってこと。
        </p>

        <InsightCard type="warning">
          <div>
            <p className="mb-4 font-bold text-lg">よくある失敗パターン</p>
            <CheckList
              type="danger"
              items={[
                "CMでよく見るから、とりあえず大手に登録",
                "友達が使ってたから同じの使う",
                "ネットで「おすすめ」って書いてあったから登録",
                "結局、合わなくて使わなくなる...",
              ]}
            />
          </div>
        </InsightCard>

        <div className="my-10 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center text-white shadow-xl">
          <p className="mb-4 text-2xl font-bold md:text-3xl">
            この問題を解決してくれるのが、
          </p>
          <p className="text-4xl font-bold md:text-5xl">
            「出会えるエージェント」
          </p>
          <p className="mt-4 text-lg">です！</p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">
          「出会えるエージェント」が神サービスな理由
        </h2>
        
        <div className="space-y-6">
          <div className="rounded-xl border-2 border-blue-300 bg-blue-50 p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-blue-500 p-3">
                <Users className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-blue-900">
                理由① あなた専用のエージェントを3社紹介
              </h3>
            </div>
            <p className="mb-4 ml-15 leading-relaxed text-gray-700">
              <strong className="font-bold">年齢、職歴、希望条件、価値観</strong>を入力すると、<br />
              AIが最適なエージェントを3社ピックアップしてくれます。
            </p>
            <div className="ml-15 rounded-lg bg-white p-5 border border-blue-200 shadow-sm">
              <p className="mb-3 text-sm font-bold text-blue-900">例えば私の場合：</p>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">20代・未経験OK求人に強いエージェント</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">年収交渉が得意なエージェント</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">ワークライフバランス重視の企業に詳しいエージェント</p>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-600">
                → 全部私の希望にピッタリ！無駄がない！
              </p>
            </div>
          </div>

          <div className="rounded-xl border-2 border-green-300 bg-green-50 p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-green-500 p-3">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-green-900">
                理由② 3社使うから、選択肢が爆増する
              </h3>
            </div>
            <p className="mb-4 ml-15 leading-relaxed text-gray-700">
              1社だけだと、紹介される求人は10〜20件くらい。<br />
              でも3社使えば、<strong className="font-bold text-red-600">30〜60件</strong>に増えます！
            </p>
            <div className="ml-15 rounded-lg bg-white p-5 border border-green-200 shadow-sm">
              <p className="mb-3 text-sm font-bold text-green-900">実際の数字：</p>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="text-center">
                  <p className="text-xs text-gray-600">A社</p>
                  <p className="text-2xl font-bold text-blue-600">15件</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">B社</p>
                  <p className="text-2xl font-bold text-blue-600">22件</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">C社</p>
                  <p className="text-2xl font-bold text-blue-600">18件</p>
                </div>
              </div>
              <div className="rounded-lg bg-green-100 p-3">
                <p className="text-center font-bold text-green-700">
                  = 合計<span className="text-2xl">55件</span>から選べる！
                </p>
              </div>
            </div>
            <p className="mt-4 ml-15 text-sm font-bold text-green-800">
              → 選択肢が多いから、本当に自分に合う会社が見つかる確率が上がる！
            </p>
          </div>

          <div className="rounded-xl border-2 border-purple-300 bg-purple-50 p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-purple-500 p-3">
                <Users className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-purple-900">
                理由③ 担当者の「当たり外れ」を回避できる
              </h3>
            </div>
            <p className="mb-4 ml-15 leading-relaxed text-gray-700">
              正直、<strong className="font-bold">同じエージェント会社でも、
              担当者によって全然違います。</strong>
            </p>
            <QuoteBlock author="友達の失敗談">
              <p className="text-sm">
                「担当者が超上から目線で、『あなたの経歴じゃ無理です』とか言われた。
                でも別のエージェントでは普通に内定もらえた...」
              </p>
            </QuoteBlock>
            <p className="ml-15 text-sm font-bold text-purple-800">
              → 3社使えば、合わない担当者に当たっても大丈夫。<br />
              相性のいい担当者が1人は絶対いる！
            </p>
          </div>

          <div className="rounded-xl border-2 border-orange-300 bg-orange-50 p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-orange-500 p-3">
                <CheckCircle2 className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-orange-900">
                理由④ 完全無料なのに、手厚すぎるサポート
              </h3>
            </div>
            <p className="mb-4 ml-15 leading-relaxed text-gray-700">
              3社それぞれから、<strong className="font-bold">無料で</strong>こんなサポートが受けられます：
            </p>
            <div className="ml-15 rounded-lg bg-white p-4 border border-orange-200">
              <CheckList
                type="success"
                items={[
                  "職務経歴書の添削（プロの視点でダメ出し）",
                  "面接対策・模擬面接（本番で緊張しなくなる）",
                  "年収交渉の代行（+10〜30万円狙える）",
                  "企業との日程調整（働きながらでも楽）",
                  "内定後のフォロー（入社まで安心）",
                ]}
              />
            </div>
            <p className="mt-4 ml-15 text-sm font-bold text-orange-800">
              → 3社分のサポートが受けられるって、マジでコスパ最強すぎません？
            </p>
          </div>
        </div>
      </section>

      <InlineCTA text="神サービス、使わないと損すぎる" />

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">
          「出会えるエージェント」を使わないと損する理由
        </h2>
        
        <div className="my-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border-2 border-red-400 bg-red-50 p-6 shadow-md">
            <p className="mb-4 text-center font-bold text-xl text-red-800">
              使わずに転職すると...
            </p>
            <CheckList
              type="danger"
              items={[
                "合わないエージェントに当たる",
                "求人の選択肢が少なすぎる",
                "年収交渉してもらえない",
                "ブラック企業に入社するリスク",
              ]}
            />
          </div>

          <div className="rounded-xl border-2 border-green-400 bg-green-50 p-6 shadow-md">
            <p className="mb-4 text-center font-bold text-xl text-green-800">
              使って転職すると...
            </p>
            <CheckList
              type="success"
              items={[
                "自分に合うエージェントが必ず見つかる",
                "求人の選択肢が3倍に増える",
                "年収交渉で+10〜30万円アップ",
                "優良企業だけを紹介してもらえる",
              ]}
            />
          </div>
        </div>

        <p className="my-8 text-center text-2xl font-bold text-gray-900">
          どっちがいいか、<br />
          <span className="text-green-600">もう答え出てますよね？</span>
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">
          最後に
        </h2>
        
        <p className="mb-6 leading-relaxed text-gray-700">
          転職って、人生の中でも超重要な決断ですよね。
        </p>

        <p className="mb-6 text-xl font-bold text-gray-900">
          だからこそ、<span className="text-red-600">エージェント選びで失敗してほしくない。</span>
        </p>

        <p className="mb-6 leading-relaxed text-gray-700">
          私は「出会えるエージェント」を使って、<br />
          本当に人生が変わりました。
        </p>

        <div className="my-8 grid gap-4 md:grid-cols-3">
          <StatsBox label="年収UP" value="+90万円" />
          <StatsBox label="転職期間" value="2ヶ月" />
          <StatsBox label="満足度" value="100%" />
        </div>

        <p className="mb-6 text-lg font-bold text-gray-900">
          あなたにも、この感覚を味わってほしいです。
        </p>

        <div className="my-8 rounded-xl bg-yellow-50 border-2 border-yellow-400 p-8">
          <p className="mb-4 text-center text-xl font-bold text-gray-800">
            20代の今だからこそ、<br />
            選択肢がたくさんあります。
          </p>
          <p className="text-center text-lg text-gray-700">
            その選択肢を最大限活かすために、<br />
            <span className="font-bold text-red-600">「出会えるエージェント」を使ってください。</span>
          </p>
        </div>

        <p className="text-center text-2xl font-bold text-gray-900">
          たった30秒で、<br />
          <span className="text-green-600">あなたの未来が変わります。</span>
        </p>
      </section>

      <div className="my-12 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 p-8 md:p-12 text-white shadow-2xl">
        <div className="text-center">
          <div className="mb-6">
            <div className="mb-2 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-bold backdrop-blur-sm">
              完全無料・30秒で完了
            </div>
          </div>
          <h3 className="mb-4 text-3xl font-bold md:text-4xl">
            エージェント選びで失敗しないために
          </h3>
          <p className="mb-8 text-lg opacity-95">
            今すぐ、あなた専用のエージェント3社を見つけよう！
          </p>
          <Link
            href="/gt/lp01deaeru/1"
            className="inline-flex items-center gap-3 rounded-full bg-white px-12 py-5 text-xl font-bold text-purple-600 shadow-2xl transition hover:scale-105 hover:bg-gray-50"
          >
            無料診断をはじめる
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
            <span>✓ しつこい営業電話なし</span>
            <span>✓ 相談だけでもOK</span>
            <span>✓ まずは気軽に登録してみてください</span>
          </div>
        </div>
      </div>
    </ArticleLayout>
  );
}
