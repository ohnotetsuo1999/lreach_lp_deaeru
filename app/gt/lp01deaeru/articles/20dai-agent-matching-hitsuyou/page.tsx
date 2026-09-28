import { type Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "../_components/ArticleLayout";
import {
  InsightCard,
  CheckList,
  InlineCTA,
  AlertBox,
  ComparisonTable,
} from "../_components/ArticleComponents";
import { ArrowRight, Target, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "【真実】転職エージェント、テキトーに選ぶと100万円損します｜出会えるエージェント",
  description: "「どのエージェントも同じでしょ？」って思ってる人、マジで損してます。エージェント選びで年収が100万円変わる真実を暴露します。",
  keywords: "転職エージェント,選び方,マッチング,20代,損,比較",
  openGraph: {
    title: "【真実】転職エージェント、テキトーに選ぶと100万円損します",
    description: "どのエージェントも同じ？それ、100万円損します。",
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
      title: "転職エージェントは3社使わないと損",
      slug: "20dai-3sha-tsukaou",
      category: "エージェント活用",
    },
    {
      title: "20代で年収100万UPさせる人がやってること",
      slug: "20dai-nensyuu-up-himitsu",
      category: "年収アップ",
    },
  ];

  return (
    <ArticleLayout
      title="エージェント違いで年収50万円差"
      category="エージェント選び"
      readTime={5}
      publishedDate="2026年1月29日"
      relatedArticles={relatedArticles}
    >
      <header className="mb-12">
        <h1 className="mb-4 text-4xl font-bold leading-tight">
          【衝撃】同じ会社の内定なのに、<br />
          エージェント違いで年収50万円差
        </h1>
        <p className="text-lg text-gray-600">
          「どのエージェントでも同じ」って思ってる人、マジで損してます。
        </p>
      </header>

      <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            友達2人、同じ会社に転職したのに年収が違う
          </h2>
          
          <p className="mb-6">
            これ、実話です。<br />
            友達のRくんとSちゃん、<br />
            <strong className="text-blue-600">同じ会社に同じタイミングで転職</strong>
            しました。
          </p>

          <p className="mb-6">
            同じ会社、同じ職種、同じ新卒3年目。<br />
            なのに...
          </p>

          <div className="my-8 rounded-lg bg-red-50 border-2 border-red-400 p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-white rounded p-4">
                <p className="font-bold mb-2">Rくん</p>
                <p className="text-sm mb-2">
                  <strong>使ったエージェント：</strong><br />
                  CMでよく見る大手転職サイト
                </p>
                <p className="text-3xl font-bold">年収350万円</p>
              </div>
              <div className="bg-white rounded p-4">
                <p className="font-bold mb-2">Sちゃん</p>
                <p className="text-sm mb-2">
                  <strong>使ったエージェント：</strong><br />
                  「出会えるエージェント」経由の3社
                </p>
                <p className="text-3xl font-bold text-green-600">年収400万円</p>
              </div>
            </div>
            <p className="mt-6 text-center text-2xl font-bold text-red-700">
              <span className="text-3xl">50万円</span>の差...
            </p>
          </div>

          <p className="text-2xl font-bold text-center my-8">
            同じ会社なのに、<br />
            <span className="text-red-600">エージェント違いで年収50万円も違う</span>
            って、<br />
            ヤバくないですか？
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            なぜエージェントで年収が変わるのか？
          </h2>
          
          <div className="my-8 space-y-6">
            <div className="rounded-lg bg-blue-50 p-6">
              <h3 className="mb-3 text-xl font-bold text-blue-700">
                理由① 年収交渉の本気度が違う
              </h3>
              <p className="text-sm mb-4">
                <strong className="text-red-600">Rくんのエージェント：</strong><br />
                「この年収で決まりです」<br />
                → 交渉ゼロ。提示された金額そのまま。
              </p>
              <p className="text-sm">
                <strong className="text-green-600">Sちゃんのエージェント：</strong><br />
                「市場価値を考えると、もう少し上げられるはずです。交渉してみますね」<br />
                → 企業に粘り強く交渉。+50万円アップ！
              </p>
            </div>

            <div className="rounded-lg bg-purple-50 p-6">
              <h3 className="mb-3 text-xl font-bold text-purple-700">
                理由② エージェントの企業との関係性
              </h3>
              <p className="text-sm">
                年収交渉に強いエージェント：<br />
                企業との信頼関係が深く、「このエージェントの推薦なら」って
                企業も年収アップに応じやすい。<br />
                <br />
                適当なエージェント：<br />
                企業との関係が薄く、交渉しても聞いてもらえない。
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            「エージェント選び」が転職の90%を決める
          </h2>
          
          <p className="mb-6">
            正直に言います。<br />
            <strong className="text-red-600 text-xl">
              エージェント選びで、転職の90%が決まります。
            </strong>
          </p>

          <p className="mb-6">
            いいエージェントに当たれば、<br />
            • 年収100万円UP<br />
            • ホワイト企業に入社<br />
            • 2ヶ月で転職成功<br />
            • 人生が変わる
          </p>

          <p className="mb-6">
            悪いエージェントに当たれば、<br />
            • 年収変わらず<br />
            • ブラック企業に入社<br />
            • 半年かかって疲弊<br />
            • 人生が詰む
          </p>

          <p className="text-2xl font-bold text-center my-8">
            <span className="text-blue-600">エージェント選び、超重要</span>です。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            でも、「いいエージェント」ってどうやって見つけるの？
          </h2>
          
          <p className="mb-6">
            ここが問題なんです。<br />
            <strong className="text-red-600">使う前には、いいかどうかわからない。</strong>
          </p>

          <div className="my-6 rounded-lg bg-gray-100 p-6">
            <p className="mb-3 font-bold">よくある失敗パターン：</p>
            <ul className="space-y-2 text-sm">
              <li>❌ CMでよく見るから、とりあえず大手に登録</li>
              <li>❌ ネットで「おすすめ」って書いてあったから登録</li>
              <li>❌ 友達が使ってたから、同じの使う</li>
              <li>❌ 登録してみたけど、全然合わなくて使わなくなる</li>
              <li>❌ 結局、妥協した転職をする</li>
            </ul>
          </div>

          <p className="text-xl font-bold mb-6">
            この問題を解決するのが、<br />
            <span className="text-blue-600">「出会えるエージェント」</span>
            です。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            「出会えるエージェント」＝エージェントマッチングサービス
          </h2>
          
          <p className="mb-6">
            「出会えるエージェント」は、<br />
            <strong>転職エージェントじゃなくて、
            あなたに合うエージェントを見つけるサービス</strong>
            です。
          </p>

          <div className="my-8 rounded-lg bg-blue-50 border-2 border-blue-400 p-6">
            <p className="mb-4 font-bold text-blue-800">
              仕組みはこう：
            </p>
            <ol className="space-y-3 text-sm list-decimal pl-6">
              <li>
                あなたの情報を入力<br />
                <span className="text-xs text-gray-600">
                  （年齢、職歴、希望条件、価値観など）
                </span>
              </li>
              <li>
                AIが最適なエージェントを選定<br />
                <span className="text-xs text-gray-600">
                  （数千社の中から、あなたに合う3社を厳選）
                </span>
              </li>
              <li>
                3社のエージェントを紹介<br />
                <span className="text-xs text-gray-600">
                  （それぞれ得意分野が違う、相性のいいエージェント）
                </span>
              </li>
              <li>
                転職活動スタート！<br />
                <span className="text-xs text-gray-600">
                  （3社があなたの転職を全力サポート）
                </span>
              </li>
            </ol>
          </div>

          <p className="text-xl font-bold text-center my-8">
            つまり、<br />
            <span className="text-blue-600">「エージェント選び」を失敗しない</span>
            <br />
            仕組みってことです。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            エージェントマッチングを使わないと損する理由
          </h2>
          
          <div className="my-8 space-y-4">
            <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
              <h4 className="font-bold text-red-700 mb-2">
                ❌ 使わない場合：外れエージェントに当たるリスク
              </h4>
              <p className="text-sm">
                • 年収交渉してくれない → 50万円損<br />
                • 希望と違う求人ばかり → 時間の無駄<br />
                • サポートが雑 → 書類落ち、面接落ち<br />
                • ブラック企業を紹介される → 人生詰む
              </p>
            </div>

            <div className="rounded-lg border-l-4 border-green-500 bg-green-50 p-4">
              <h4 className="font-bold text-green-700 mb-2">
                ✅ 使う場合：当たりエージェントに確実に出会える
              </h4>
              <p className="text-sm">
                • 年収交渉で+50〜100万円<br />
                • 希望にピッタリの求人紹介<br />
                • 手厚いサポートで内定率UP<br />
                • ホワイト企業だけを紹介
              </p>
            </div>
          </div>

          <p className="text-3xl font-bold text-center my-8">
            もう、<span className="text-blue-600">使わない理由ないですよね？</span>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            最後に
          </h2>
          
          <p className="mb-6">
            転職って、<br />
            <strong>人生の中でも超重要なイベント</strong>ですよね。
          </p>

          <p className="mb-6">
            なのに、<br />
            <strong className="text-red-600">エージェント選びをテキトーにする</strong>
            って、<br />
            マジでヤバいです。
          </p>

          <p className="mb-6 text-xl font-bold">
            エージェント選びで、<br />
            <span className="text-red-600">年収が100万円変わる</span>んです。
          </p>

          <p className="mb-6">
            だから、<br />
            <strong className="text-blue-600">「出会えるエージェント」で、
            ちゃんと選んでください。</strong>
          </p>

          <div className="my-8 rounded-lg bg-yellow-50 border-2 border-yellow-400 p-6">
            <p className="text-center mb-4">
              たった30秒の登録で、<br />
              <strong className="text-xl">あなたに合うエージェント3社</strong>
              が見つかります。
            </p>
            <p className="text-center text-sm mt-4">
              これだけで、<br />
              年収100万円UP、<br />
              ホワイト企業への転職、<br />
              2ヶ月で内定、<br />
              <br />
              <strong className="text-lg">全部が現実になります。</strong>
            </p>
          </div>

          <p className="text-center text-2xl font-bold my-8">
            今すぐ、クリックしてください。
          </p>
        </section>

        <section className="bg-gradient-to-r from-violet-500 to-purple-700 p-8 md:p-12 text-white shadow-2xl">
          <div className="text-center">
          <div className="mb-6">
            <div className="mb-2 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-bold backdrop-blur-sm">
              完全無料・30秒で完了
            </div>
          </div>
          <h3 className="mb-4 text-3xl font-bold md:text-4xl">
            エージェント選びで100万円損したくない人へ
          </h3>
          <p className="mb-8 text-lg opacity-95">
            AIが最適なエージェント3社を選定<br />
            エージェント選びで失敗しない
          </p>
          <Link
            href="/gt/lp01deaeru/1"
            className="inline-flex items-center gap-3 rounded-full bg-white px-12 py-5 text-xl font-bold text-purple-600 shadow-2xl transition hover:scale-105 hover:bg-gray-50"
          >
            今すぐ最適なエージェントを見つける
            <ArrowRight className="h-6 w-6" />
          </Link>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
            <span>✓ エージェント選びの成功率：98%</span>
            <span>✓ 外れエージェントリスク：ほぼゼロ</span>
          </div>
          </div>
        </section>

      <div className="my-8 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 p-6 text-white">
        <p className="text-center font-bold text-2xl mb-4">
          P.S. 最後にもう一度
        </p>
        <p className="text-sm text-center leading-relaxed">
          エージェント選びをテキトーにすると、<br />
          年収100万円損します。<br />
          <br />
          でも、「出会えるエージェント」使えば、<br />
          その損失を100%避けられます。<br />
          <br />
          完全無料、30秒で完了。<br />
          <br />
          今すぐ、クリックしてください。
        </p>
      </div>
    </ArticleLayout>
  );
}
