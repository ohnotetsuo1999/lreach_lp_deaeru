import { type Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "../_components/ArticleLayout";
import {
  InsightCard,
  CheckList,
  InlineCTA,
  AlertBox,
} from "../_components/ArticleComponents";
import { ArrowRight, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "【悲報】友達と年収150万円差がついた理由が判明｜出会えるエージェント",
  description: "同じ会社、同じ新卒なのに、3年後の年収が150万円も違う。その理由を聞いたら、マジで後悔した。知らないと一生損する転職の真実。",
  keywords: "20代,年収,差,友達,比較,転職,エージェント",
  openGraph: {
    title: "【悲報】友達と年収150万円差がついた理由が判明",
    description: "同期と年収150万円差。その理由を聞いて、マジで後悔した話。",
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
      title: "1年前に転職してれば...後悔の話",
      slug: "20dai-1nen-go-koukai",
      category: "転職タイミング",
    },
  ];

  return (
    <ArticleLayout
      title="友達と年収150万円差がついた理由"
      category="年収比較"
      readTime={5}
      publishedDate="2026年1月29日"
      relatedArticles={relatedArticles}
    >
      <header className="mb-12">
        <h1 className="mb-6 text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
          【悲報】同期と年収150万円差がついてて<br />
          マジで焦った話
        </h1>
        <p className="text-lg leading-relaxed text-gray-600">
          同じ会社、同じ新卒、同じ25歳。<br />
          なのに年収150万円も違うって、どういうこと...？
        </p>
      </header>

      <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            同期との飲み会で、衝撃の事実が発覚
          </h2>
          
          <p className="mb-6">
            先週、大学の同期5人で飲み会したんです。<br />
            みんな同じ25歳、新卒で入った会社で3年くらい働いてる。
          </p>

          <p className="mb-6">
            お酒が入って、なんとなく年収の話に。<br />
            「みんなどのくらいもらってるの？」って。
          </p>

          <div className="my-8 rounded-lg bg-gradient-to-r from-red-100 to-orange-100 border-2 border-red-300 p-6">
            <p className="text-2xl font-bold text-center mb-6">衝撃の結果</p>
            <div className="space-y-3">
              <div className="bg-white rounded p-4 flex justify-between items-center">
                <div>
                  <p className="font-bold">私</p>
                  <p className="text-xs text-gray-600">同じ会社で3年</p>
                </div>
                <span className="text-2xl font-bold">290万円</span>
              </div>
              <div className="bg-white rounded p-4 flex justify-between items-center">
                <div>
                  <p className="font-bold">Aちゃん</p>
                  <p className="text-xs text-gray-600">同じ会社で3年</p>
                </div>
                <span className="text-2xl font-bold">280万円</span>
              </div>
              <div className="bg-white rounded p-4 flex justify-between items-center">
                <div>
                  <p className="font-bold">Bくん</p>
                  <p className="text-xs text-gray-600">1回転職（2年目）</p>
                </div>
                <span className="text-2xl font-bold text-blue-600">380万円</span>
              </div>
              <div className="bg-white rounded p-4 flex justify-between items-center">
                <div>
                  <p className="font-bold">Cちゃん</p>
                  <p className="text-xs text-gray-600">1回転職（1年目）</p>
                </div>
                <span className="text-2xl font-bold text-blue-600">420万円</span>
              </div>
              <div className="bg-white rounded p-4 flex justify-between items-center">
                <div>
                  <p className="font-bold">Dくん</p>
                  <p className="text-xs text-gray-600">1回転職（半年）</p>
                </div>
                <span className="text-2xl font-bold text-purple-600">450万円</span>
              </div>
            </div>
            <p className="text-center mt-6 text-xl font-bold text-red-700">
              最大<span className="text-3xl">170万円</span>の差...
            </p>
          </div>

          <p className="text-2xl font-bold text-center my-8">
            え、待って。<br />
            <span className="text-red-600">同じ25歳なのに、なんでこんなに違うの？？</span>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            年収450万円のDくんに秘訣を聞いてみた
          </h2>
          
          <p className="mb-6">
            あまりにも衝撃的だったので、<br />
            Dくんに「どうやって年収450万円の会社見つけたの？」って聞きました。
          </p>

          <div className="my-8 rounded-lg bg-blue-50 border-2 border-blue-300 p-6">
            <p className="mb-4 font-bold text-blue-800">Dくんの回答：</p>
            <p className="text-sm mb-4">
              「『出会えるエージェント』っていうサービス使ったよ。<br />
              <br />
              自分に合う転職エージェント3社紹介してくれて、<br />
              その3社から合計60件くらい求人紹介してもらった。<br />
              <br />
              その中から、本当に条件いいところを選んで、<br />
              エージェントが年収交渉してくれて、<br />
              最初の提示より70万円アップしてくれたんだよね。<br />
              <br />
              <strong className="text-blue-600">
                これ使わないと、マジで損だよ。
              </strong>
              」
            </p>
          </div>

          <p className="text-2xl font-bold mb-6">
            え...そんなサービスあるの...？<br />
            <span className="text-red-600">知らなかった...。</span>
          </p>

          <p className="mb-6">
            しかも、Dくんに続けて聞いたら、
          </p>

          <div className="my-6 rounded-lg bg-green-50 border-2 border-green-300 p-6">
            <p className="mb-4 font-bold text-green-800">
              BくんもCちゃんも、同じサービス使ってたらしい...
            </p>
            <p className="text-sm">
              <strong>Bくん（年収380万円）：</strong><br />
              「3社から40件紹介してもらって、その中から選んだ。
              年収交渉もしてくれて+50万円になった」<br />
              <br />
              <strong>Cちゃん（年収420万円）：</strong><br />
              「未経験の職種だったけど、エージェントが『ポテンシャル採用してる企業』を
              見つけてくれて、しかも年収めっちゃ高かった」
            </p>
          </div>

          <p className="text-3xl font-bold text-center my-8">
            <span className="text-red-600">え、みんな知ってたの...？</span><br />
            <br />
            私と Aちゃんだけ、<br />
            <span className="text-red-600">知らなくて損してた...。</span>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            【計算してみた】知らないことで損した金額
          </h2>
          
          <p className="mb-6">
            もし、私も3年前に「出会えるエージェント」使って、<br />
            年収380万円の会社に転職してたら...
          </p>

          <div className="my-8 rounded-lg bg-red-50 border-2 border-red-400 p-6">
            <p className="mb-4 font-bold text-red-700 text-xl">
              損失額の計算
            </p>
            <div className="space-y-3 text-sm">
              <p>
                <strong>1年目：</strong>
                290万円（実際）vs 380万円（可能性）<br />
                <span className="text-red-600 font-bold">= -90万円の損</span>
              </p>
              <p>
                <strong>2年目：</strong>
                300万円（実際）vs 400万円（可能性）<br />
                <span className="text-red-600 font-bold">= -100万円の損</span>
              </p>
              <p>
                <strong>3年目：</strong>
                310万円（実際）vs 420万円（可能性）<br />
                <span className="text-red-600 font-bold">= -110万円の損</span>
              </p>
            </div>
            <div className="mt-6 pt-4 border-t-2 border-red-300">
              <p className="text-center text-3xl font-bold text-red-700">
                合計：<span className="text-4xl">-300万円</span>の損失
              </p>
            </div>
          </div>

          <p className="text-2xl font-bold text-center my-8">
            知らなかっただけで、<br />
            <span className="text-red-600">300万円損してた</span>ってこと...。
          </p>

          <p className="text-center mb-6">
            マジで後悔しかない。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            だから、あなたには同じ失敗をしてほしくない
          </h2>
          
          <p className="mb-6">
            私は<strong className="text-red-600">「知らなかった」</strong>から、
            3年間で300万円損しました。
          </p>

          <p className="mb-6">
            でも、あなたは今、<br />
            <strong className="text-blue-600">「知った」</strong>はずです。
          </p>

          <p className="mb-6 text-xl font-bold">
            あとは、<span className="text-red-600">行動するかどうか</span>だけ。
          </p>

          <div className="my-8 rounded-lg bg-yellow-50 border-2 border-yellow-400 p-6">
            <p className="text-center mb-4">
              <strong className="text-2xl">今すぐ登録すれば、</strong>
            </p>
            <ul className="space-y-2 text-sm">
              <li>✅ 年収100万円UPのチャンス</li>
              <li>✅ ブラック企業を避けられる</li>
              <li>✅ 理想の会社に転職できる</li>
              <li>✅ 友達に「年収いくら？」って聞かれても堂々と答えられる</li>
              <li>✅ 1年後、「あの時行動してよかった」って思える</li>
            </ul>
          </div>

          <div className="my-8 rounded-lg bg-red-50 border-2 border-red-400 p-6">
            <p className="text-center mb-4">
              <strong className="text-2xl">今日行動しなければ、</strong>
            </p>
            <ul className="space-y-2 text-sm">
              <li>❌ 1年後も同じ年収</li>
              <li>❌ 友達との年収差はさらに開く</li>
              <li>❌ 30歳になってから「もっと早く動けばよかった」って後悔</li>
              <li>❌ 一生、今の会社で我慢し続ける</li>
            </ul>
          </div>

          <p className="text-3xl font-bold text-center my-8">
            どっちの未来がいいですか？
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            登録しない理由、ありますか？
          </h2>
          
          <div className="my-8 space-y-4">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="font-bold mb-2">「お金かかるんじゃ...？」</p>
              <p className="text-sm">
                → <strong className="text-green-600">完全無料です。</strong>
                1円もかかりません。
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="font-bold mb-2">「時間かかりそう...」</p>
              <p className="text-sm">
                → <strong className="text-green-600">30秒で完了です。</strong>
                スタバでコーヒー頼むより早い。
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="font-bold mb-2">「しつこい営業電話来そう...」</p>
              <p className="text-sm">
                → <strong className="text-green-600">来ません。</strong>
                優良エージェントだけなので、しつこい営業は一切なし。
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="font-bold mb-2">「今すぐ転職する気ないし...」</p>
              <p className="text-sm">
                → <strong className="text-green-600">それでもOK。</strong>
                情報収集だけでも全然大丈夫です。
              </p>
            </div>
          </div>

          <p className="text-2xl font-bold text-center my-8">
            じゃあ、<span className="text-red-600">登録しない理由、ないですよね？</span>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            最後に
          </h2>
          
          <p className="mb-6">
            私は、「知らなかった」だけで、<br />
            3年間で300万円損しました。
          </p>

          <p className="mb-6">
            友達との年収差を見て、<br />
            <strong className="text-red-600">マジで後悔してます。</strong>
          </p>

          <p className="mb-6">
            でも、今から「出会えるエージェント」使って、<br />
            次の転職で取り返します。
          </p>

          <p className="mb-6 text-xl font-bold">
            あなたには、同じ後悔をしてほしくない。
          </p>

          <div className="my-8 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-white">
            <p className="text-center text-2xl font-bold mb-4">
              今すぐ登録してください。
            </p>
            <p className="text-center">
              1年後、友達と年収の話になった時、<br />
              <strong className="text-xl">堂々と答えられる自分</strong>
              でいるために。
            </p>
          </div>

          <p className="text-center text-xl">
            たった30秒の行動が、<br />
            <span className="text-blue-600">あなたの人生を変えます。</span>
          </p>
        </section>

      <div className="my-12 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 p-8 md:p-12 text-white shadow-2xl">
        <div className="text-center">
          <div className="mb-6">
            <div className="mb-2 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-bold backdrop-blur-sm">
              完全無料・30秒で完了
            </div>
          </div>
          <h3 className="mb-4 text-3xl font-bold md:text-4xl">
            友達と年収差をつけられたくない人へ
          </h3>
          <p className="mb-8 text-lg opacity-95">
            あなたも年収400万円超えのチャンス<br />
            今すぐ、最適なエージェントを見つけよう
          </p>
          <Link
            href="/gt/lp01deaeru/1"
            className="inline-flex items-center gap-3 rounded-full bg-white px-12 py-5 text-xl font-bold text-purple-600 shadow-2xl transition hover:scale-105 hover:bg-gray-50"
          >
            今すぐ無料診断をはじめる
            <ArrowRight className="h-6 w-6" />
          </Link>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
            <span>✓ 平均年収UP額：+87万円</span>
            <span>✓ 最短2ヶ月で内定実績あり</span>
            <span>✓ 20代利用者の94%が満足</span>
          </div>
        </div>
      </div>

      <div className="my-8 rounded-xl bg-red-50 border-2 border-red-400 p-6">
        <p className="text-center font-bold text-xl mb-4 text-red-700">
          最後に、本音を言います
        </p>
        <p className="text-sm text-center text-gray-700 leading-relaxed">
          友達と年収差がつくのって、<br />
          めっちゃ悔しいし、惨めです。<br />
          <br />
          「なんで私だけ...」って思います。<br />
          <br />
          でも、差がついたのは、<br />
          「知ってるか、知らないか」だけ。<br />
          <br />
          あなたは今、知りました。<br />
          <br />
          あとは、行動するだけです。
        </p>
      </div>
    </ArticleLayout>
  );
}
