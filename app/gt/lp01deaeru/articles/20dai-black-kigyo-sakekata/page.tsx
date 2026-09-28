import { type Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "../_components/ArticleLayout";
import {
  InsightCard,
  StatsBox,
  CheckList,
  TestimonialCard,
  InlineCTA,
  AlertBox,
  ComparisonTable,
  QuoteBlock,
} from "../_components/ArticleComponents";
import { AlertTriangle, Shield, CheckCircle2, XCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "【20代向け】ブラック企業を100%避ける転職術｜出会えるエージェント",
  description: "「転職したらブラックだった...」そんな失敗、絶対に避けたいですよね。20代がブラック企業に入社しないための、超実践的な方法を教えます。",
  keywords: "20代,転職,ブラック企業,避ける,見分け方,エージェント",
  openGraph: {
    title: "【20代向け】ブラック企業を100%避ける転職術",
    description: "転職先がブラックだった...という最悪の失敗を避ける方法。",
    type: "article",
  },
};

export default function Article() {
  const relatedArticles = [
    {
      title: "転職エージェント選びで人生変わる話",
      slug: "20dai-agent-erabikata",
      category: "エージェント選び",
    },
    {
      title: "初めての転職で年収90万UP",
      slug: "20dai-first-tensyoku",
      category: "成功事例",
    },
    {
      title: "転職エージェントは3社使わないと損",
      slug: "20dai-3sha-tsukaou",
      category: "転職ノウハウ",
    },
  ];

  return (
    <ArticleLayout
      title="ブラック企業を100%避ける転職術"
      category="企業選びの極意"
      readTime={7}
      publishedDate="2026年1月29日"
      relatedArticles={relatedArticles}
    >
      <header className="mb-12">
        <h1 className="mb-6 text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
          【悲報】友達が転職したら<br />
          ブラック企業だった件
        </h1>
        <p className="text-lg leading-relaxed text-gray-600">
          「こんなはずじゃなかった...」<br />
          ブラック企業を避けるために、絶対知っておくべきこと
        </p>
      </header>

      {/* 警告ビジュアル */}
      <div className="my-10 overflow-hidden rounded-2xl bg-gradient-to-br from-red-100 via-orange-100 to-red-50 p-8 md:p-12 border-2 border-red-300">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <AlertTriangle className="h-24 w-24 text-red-600" />
          </div>
          <p className="mb-4 text-3xl font-bold text-gray-900">
            転職3ヶ月で「辞めたい」
          </p>
          <p className="text-gray-700">
            そんな最悪の事態を避ける方法、教えます
          </p>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">
          転職3ヶ月で「辞めたい」って言い出した友達の話
        </h2>
        
        <p className="mb-6 leading-relaxed text-gray-700">
          先月、友達のJくん（26歳）から突然LINE来ました。
        </p>

        <div className="my-8 rounded-xl border-2 border-gray-300 bg-gray-50 p-6 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <div className="rounded-full bg-gray-600 px-3 py-1">
              <p className="text-xs font-bold text-white">Jくんからのライン</p>
            </div>
          </div>
          <div className="space-y-3 text-gray-800">
            <p>「転職したけど、マジで最悪...」</p>
            <p>「求人票には『残業月20時間以下』って書いてあったのに、実際は月80時間超え。」</p>
            <p>「しかも、パワハラ上司がいて、毎日怒鳴られてる。」</p>
            <p className="font-bold text-red-600">「もう辞めたい...」</p>
          </div>
        </div>

        <p className="mb-6 text-xl font-bold text-gray-900">
          え、まって。<br />
          転職して<span className="text-red-600">たった3ヶ月</span>なのに、
          もう辞めたいって...？
        </p>

        <p className="mb-6 leading-relaxed text-gray-700">
          話を聞いたら、Jくんは<br />
          <strong className="font-bold text-red-600">「転職サイトで自分で求人を探して、
          そのまま応募した」</strong>らしい。
        </p>

        <AlertBox type="danger">
          <p className="text-xl font-bold">
            これが、最悪のパターンです。
          </p>
        </AlertBox>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">
          なぜブラック企業に入社してしまうのか？
        </h2>
        
        <div className="space-y-6">
          <div className="rounded-xl border-l-4 border-red-500 bg-red-50 p-6 shadow-sm">
            <h3 className="mb-3 text-xl font-bold text-red-900">
              原因① 求人票は「嘘」が書ける
            </h3>
            <p className="mb-4 leading-relaxed text-gray-700">
              実は、求人票って<strong className="font-bold">企業が自分で書いてる</strong>から、<br />
              都合の悪いことは書かないし、<br />
              <strong className="font-bold text-red-600">盛って書くことも普通にあります。</strong>
            </p>
            <div className="rounded-lg bg-white p-4 border border-red-200">
              <p className="mb-2 text-sm font-bold text-red-800">求人票の「嘘」の例：</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>🚩 「残業月20時間以下」→ 実際は月80時間</li>
                <li>🚩 「アットホームな職場」→ 実際はパワハラだらけ</li>
                <li>🚩 「若手が活躍」→ 実際は雑用ばかり</li>
                <li>🚩 「年収400万円〜」→ 実際は300万円スタート</li>
              </ul>
            </div>
          </div>

          <div className="rounded-xl border-l-4 border-orange-500 bg-orange-50 p-6 shadow-sm">
            <h3 className="mb-3 text-xl font-bold text-orange-900">
              原因② 企業の内部情報がわからない
            </h3>
            <p className="mb-4 leading-relaxed text-gray-700">
              面接で「残業どのくらいですか？」って聞いても、<br />
              <strong className="font-bold text-orange-700">本当のことを言ってくれるとは限りません。</strong>
            </p>
            <p className="text-sm text-gray-600">
              「忙しい時期は少し増えますが、基本的には20時間以内ですね」<br />
              → 実際は毎日終電、土日出勤も...みたいなこと、普通にあります。
            </p>
          </div>

          <div className="rounded-xl border-l-4 border-yellow-500 bg-yellow-50 p-6 shadow-sm">
            <h3 className="mb-3 text-xl font-bold text-yellow-900">
              原因③ ブラック企業は求人を出しまくってる
            </h3>
            <p className="mb-4 leading-relaxed text-gray-700">
              なぜか？<br />
              <strong className="font-bold text-yellow-700">人がすぐ辞めるから、常に募集してる</strong>んです。
            </p>
            <div className="rounded-lg bg-white p-3 text-sm text-yellow-800 border border-yellow-200">
              → つまり、転職サイトでよく見る求人ほど、ブラック企業の可能性が高い
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-2xl font-bold text-gray-900">
          じゃあ、どうすればブラック企業を避けられるの？
        </p>
      </section>

      <InlineCTA text="ブラック企業に入りたくないなら、今すぐ対策を" />

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">
          【結論】エージェントを使えば、ブラック企業は100%避けられる
        </h2>
        
        <p className="mb-6 leading-relaxed text-gray-700">
          なぜか？<br />
          <strong className="font-bold text-green-600">エージェントは企業の内部情報を知ってる</strong>
          からです。
        </p>

        <InsightCard type="success">
          <div>
            <p className="mb-4 font-bold text-lg flex items-center gap-2">
              <Shield className="h-6 w-6 text-green-600" />
              エージェントが知ってる内部情報
            </p>
            <CheckList
              type="success"
              items={[
                "実際の残業時間（月平均、繁忙期の実態）",
                "離職率（人がすぐ辞める会社はヤバい）",
                "社内の雰囲気（パワハラ、セクハラの有無）",
                "評価制度の実態（頑張っても評価されないとか）",
                "入社後のギャップ（前任者の退職理由など）",
              ]}
            />
            <p className="mt-4 text-sm font-bold">
              → これ、求人票には絶対書いてない情報です
            </p>
          </div>
        </InsightCard>

        <div className="my-8 rounded-xl bg-blue-50 border-2 border-blue-300 p-6">
          <p className="mb-4 font-bold text-blue-900">
            しかも、優良なエージェントは、ブラック企業を紹介しません。
          </p>
          <p className="text-sm text-gray-700">
            なぜなら、ブラック企業を紹介して、
            すぐ辞められたら、エージェントの評判が落ちるから。
          </p>
        </div>

        <div className="my-8 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center text-white shadow-xl">
          <p className="mb-2 text-lg">つまり、</p>
          <p className="text-3xl font-bold md:text-4xl">
            エージェントを使う<br />
            ＝<br />
            ブラック企業フィルター
          </p>
          <p className="mt-4 text-lg">がかかるってことです。</p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">
          エージェントが教えてくれた「裏情報」
        </h2>
        
        <p className="mb-6 leading-relaxed text-gray-700">
          実際、私が「出会えるエージェント」で紹介してもらったエージェントは、<br />
          こんな情報まで教えてくれました：
        </p>

        <div className="space-y-4">
          <div className="rounded-xl bg-blue-50 p-5 border-l-4 border-blue-500">
            <p className="mb-2 font-bold text-blue-800">教えてくれた情報①：</p>
            <p className="text-sm text-gray-700 italic">
              「この会社、求人票には『残業月20時間』って書いてますけど、
              実際は繁忙期だと40時間超えることあります。
              それでも大丈夫ですか？」
            </p>
            <p className="mt-3 rounded-lg bg-white p-2 text-xs text-blue-700 border border-blue-200">
              ✓ 入社前に実態がわかるから、ミスマッチを防げる！
            </p>
          </div>

          <div className="rounded-xl bg-purple-50 p-5 border-l-4 border-purple-500">
            <p className="mb-2 font-bold text-purple-800">教えてくれた情報②：</p>
            <p className="text-sm text-gray-700 italic">
              「この会社、最近離職率が上がってるんですよね。
              新しく来た部長がちょっと厳しいらしくて...。
              他の会社も見てみませんか？」
            </p>
            <p className="mt-3 rounded-lg bg-white p-2 text-xs text-purple-700 border border-purple-200">
              ✓ ヤバい会社は事前に避けられる！
            </p>
          </div>

          <div className="rounded-xl bg-green-50 p-5 border-l-4 border-green-500">
            <p className="mb-2 font-bold text-green-800">教えてくれた情報③：</p>
            <p className="text-sm text-gray-700 italic">
              「この求人、年収400万円〜って書いてますけど、
              実際は320万円スタートです。
              昇給も年5000円程度なので、
              最初から年収高いところ紹介しますね。」
            </p>
            <p className="mt-3 rounded-lg bg-white p-2 text-xs text-green-700 border border-green-200">
              ✓ 年収の「罠」も教えてくれる！
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-2xl font-bold text-gray-900">
          こんな情報、<br />
          <span className="text-red-600">転職サイトだけじゃ絶対にわからない</span>
          ですよね？
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">
          「出会えるエージェント」がブラック企業を避けるのに最強な理由
        </h2>
        
        <div className="space-y-6">
          <div className="rounded-xl border-2 border-green-300 bg-green-50 p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-green-500 p-3">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-green-900">
                理由① 優良エージェントしか紹介されない
              </h3>
            </div>
            <p className="mb-4 ml-15 leading-relaxed text-gray-700">
              「出会えるエージェント」は、<br />
              <strong className="font-bold">ブラック企業を紹介するような、
              質の悪いエージェントは排除してます。</strong>
            </p>
            <div className="ml-15 rounded-lg bg-white p-4 border border-green-200">
              <p className="text-sm font-bold text-green-800">
                ✓ 安心して使えるエージェントだけが紹介される
              </p>
            </div>
          </div>

          <div className="rounded-xl border-2 border-purple-300 bg-purple-50 p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-purple-500 p-3">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-purple-900">
                理由② 3社の情報を比較できる
              </h3>
            </div>
            <p className="mb-4 ml-15 leading-relaxed text-gray-700">
              同じ企業について、3社のエージェントから情報を聞けば、<br />
              <strong className="font-bold">どの情報が正しいか、判断できます。</strong>
            </p>
            <div className="ml-15 rounded-lg bg-white p-4 border border-purple-200">
              <p className="mb-2 text-sm text-gray-700">
                1社だけだと、その情報が正しいか不安。<br />
                でも3社が同じこと言ってたら、それが真実。
              </p>
              <p className="mt-2 text-sm font-bold text-purple-800">
                情報が矛盾してたら、「この会社怪しいな」って判断できる。
              </p>
            </div>
          </div>

          <div className="rounded-xl border-2 border-orange-300 bg-orange-50 p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-orange-500 p-3">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-orange-900">
                理由③ 「この会社やめた方がいい」って教えてくれる
              </h3>
            </div>
            <p className="mb-4 ml-15 leading-relaxed text-gray-700">
              いいエージェントは、<br />
              <strong className="font-bold">ヤバい会社を紹介しないどころか、
              「この会社はやめた方がいいです」って教えてくれます。</strong>
            </p>
            <div className="ml-15 rounded-lg bg-white p-4 border border-orange-200">
              <p className="text-sm text-gray-700">
                実際、私が興味持った会社について聞いたら、<br />
                「その会社、最近パワハラで退職者が続出してるので、
                おすすめしません」って教えてくれて、<br />
                ブラック企業に入社するのを回避できた。
              </p>
            </div>
          </div>
        </div>
      </section>

      <InlineCTA text="ブラック企業フィルターで、安心して転職しよう" />

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">
          【比較】転職サイト vs 出会えるエージェント
        </h2>
        
        <ComparisonTable
          items={[
            {
              label: "企業情報",
              before: "求人票だけ",
              after: "内部情報も教えてくれる",
            },
            {
              label: "ブラック企業",
              before: "見分けられない",
              after: "最初から排除",
            },
            {
              label: "入社後",
              before: "「聞いてないよ...」",
              after: "ミスマッチなし",
            },
            {
              label: "安心度",
              before: "低い",
              after: "超高い",
            },
          ]}
        />

        <p className="mt-8 text-center text-2xl font-bold text-gray-900">
          もう、<span className="text-green-600">使わない理由ないですよね？</span>
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">
          ブラック企業に入社すると、人生終わります
        </h2>
        
        <p className="mb-6 leading-relaxed text-gray-700">
          ちょっと強い言い方ですが、<br />
          <strong className="font-bold text-red-600">これ、マジです。</strong>
        </p>

        <div className="my-8 overflow-hidden rounded-2xl border-2 border-red-400">
          <div className="bg-red-600 px-6 py-4">
            <p className="font-bold text-white text-xl">ブラック企業に入社した場合の悪循環</p>
          </div>
          <div className="bg-red-50 p-6 space-y-4">
            {[
              { period: "3ヶ月後", text: "毎日終電、休日もなし、心身ともに疲弊" },
              { period: "6ヶ月後", text: "体調崩して休職、もしくは退職" },
              { period: "1年後", text: "「半年で辞めた」が職歴に。次の転職で不利に" },
              { period: "2年後", text: "転職回数が増えて、まともな会社に入れなくなる" },
            ].map((item, index) => (
              <div key={index} className="rounded-lg bg-white p-4 shadow-sm">
                <p className="mb-1 font-bold text-red-700">{item.period}</p>
                <p className="text-sm text-gray-700">{item.text}</p>
              </div>
            ))}
            <div className="mt-6 rounded-lg bg-red-600 p-4">
              <p className="text-center text-2xl font-bold text-white">
                人生、詰みます。
              </p>
            </div>
          </div>
        </div>

        <div className="my-8 overflow-hidden rounded-2xl border-2 border-green-400">
          <div className="bg-green-600 px-6 py-4">
            <p className="font-bold text-white text-xl">ホワイト企業に入社した場合の好循環</p>
          </div>
          <div className="bg-green-50 p-6 space-y-4">
            {[
              { period: "3ヶ月後", text: "残業少なく、プライベートも充実。ストレスフリー" },
              { period: "6ヶ月後", text: "仕事が楽しくて、スキルもどんどん身につく" },
              { period: "1年後", text: "昇給・昇格。年収も上がって、さらにモチベーションUP" },
              { period: "2年後", text: "「この会社でずっと働きたい」って本気で思える" },
            ].map((item, index) => (
              <div key={index} className="rounded-lg bg-white p-4 shadow-sm">
                <p className="mb-1 font-bold text-green-700">{item.period}</p>
                <p className="text-sm text-gray-700">{item.text}</p>
              </div>
            ))}
            <div className="mt-6 rounded-lg bg-green-600 p-4">
              <p className="text-center text-2xl font-bold text-white">
                人生、勝ち組です。
              </p>
            </div>
          </div>
        </div>

        <p className="my-8 text-center text-2xl font-bold text-gray-900">
          どっちの人生がいいですか？
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">
          だから、あなたには同じ失敗をしてほしくない
        </h2>
        
        <p className="mb-6 leading-relaxed text-gray-700">
          私は<strong className="font-bold text-green-600">「出会えるエージェント」</strong>使って、
          ブラック企業を避けられました。
        </p>

        <p className="mb-6 leading-relaxed text-gray-700">
          でも、友達のJくんは知らなくて、<br />
          ブラック企業に入社して、今すごく苦しんでます。
        </p>

        <p className="mb-6 text-xl font-bold text-gray-900">
          あなたには、そうなってほしくない。
        </p>

        <AlertBox type="warning">
          <div>
            <p className="mb-4 text-lg font-bold">完全無料・30秒で人生を守れます</p>
            <p className="text-sm">
              「出会えるエージェント」に登録するだけで、<br />
              ブラック企業に入社するリスクが<strong className="font-bold">ほぼゼロ</strong>になります。
            </p>
            <div className="mt-4 rounded-lg bg-white p-4">
              <p className="text-center font-bold text-yellow-800">
                30秒の行動が、あなたの人生を守ります。
              </p>
            </div>
          </div>
        </AlertBox>

        <p className="mt-6 text-center text-xl font-bold text-gray-900">
          今すぐ、登録してください。
        </p>
      </section>

      <div className="my-12 overflow-hidden rounded-2xl bg-gradient-to-r from-red-500 to-pink-600 p-8 md:p-12 text-white shadow-2xl">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <Shield className="h-16 w-16" />
          </div>
          <h3 className="mb-4 text-3xl font-bold md:text-4xl">
            ブラック企業に絶対入りたくない人へ
          </h3>
          <p className="mb-8 text-lg opacity-95">
            優良エージェントだけを厳選。<br />
            ブラック企業フィルターで、安心して転職できます
          </p>
          <Link
            href="/gt/lp01deaeru/1"
            className="inline-flex items-center gap-3 rounded-full bg-white px-12 py-5 text-xl font-bold text-red-600 shadow-2xl transition hover:scale-105 hover:bg-gray-50"
          >
            今すぐ無料診断をはじめる
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm opacity-90">
            <span>✓ 完全無料・30秒で完了</span>
            <span>✓ しつこい営業電話は一切なし</span>
            <span>✓ ブラック企業は紹介しません</span>
          </div>
        </div>
      </div>

      <div className="my-8 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
        <p className="mb-4 text-center font-bold text-2xl">
          P.S. 最後に本音を言います
        </p>
        <p className="text-center leading-relaxed">
          友達がブラック企業で苦しんでるのを見るのは、<br />
          本当に辛いです。<br />
          <br />
          あなたには、そうなってほしくない。<br />
          <br />
          だから、<br />
          <strong className="text-2xl">今すぐ行動してください。</strong><br />
          <br />
          1年後、笑って「転職してよかった」って言えるように。
        </p>
      </div>
    </ArticleLayout>
  );
}
