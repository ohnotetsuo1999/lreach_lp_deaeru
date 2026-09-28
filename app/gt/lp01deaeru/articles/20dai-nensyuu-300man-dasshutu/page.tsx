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
  title: "【脱・年収300万円台】20代が絶対にやるべきこと｜出会えるエージェント",
  description: "年収300万円台から抜け出せない20代へ。あなたの市場価値、本当はもっと高いです。年収400万円以上を実現する具体的な方法を教えます。",
  keywords: "20代,年収300万円,脱出,年収アップ,市場価値,エージェント",
  openGraph: {
    title: "【脱・年収300万円台】20代が絶対にやるべきこと",
    description: "年収300万円台から抜け出す方法。あなたの市場価値、本当はもっと高いです。",
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
      title: "友達と年収150万円差がついた理由",
      slug: "20dai-tomodachi-nensyuu-hikaku",
      category: "年収比較",
    },
  ];

  return (
    <ArticleLayout
      title="年収300万円台から脱出する方法"
      category="年収アップ"
      readTime={5}
      publishedDate="2026年1月29日"
      relatedArticles={relatedArticles}
    >
      <header className="mb-12">
        <h1 className="mb-6 text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
          【衝撃】年収300万円のあなた、<br />
          本当は年収400万円の価値がある
        </h1>
        <p className="text-lg leading-relaxed text-gray-600">
          あなたが安く使われてるだけ。本当の市場価値、知ってますか？
        </p>
      </header>

      <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            年収300万円で満足してる場合じゃない
          </h2>
          
          <p className="mb-6">
            突然ですが、<br />
            あなたの今の年収、いくらですか？
          </p>

          <div className="my-6 rounded-lg bg-gray-100 p-6">
            <p className="mb-3">もし、こんな感じなら...</p>
            <ul className="space-y-2 text-sm">
              <li>💰 年収280万円〜320万円くらい</li>
              <li>📅 新卒で入社して2〜4年目</li>
              <li>😰 「給料安いな...」って思ってる</li>
              <li>😰 でも「こんなもんか」って諦めてる</li>
            </ul>
          </div>

          <p className="text-2xl font-bold text-center my-8">
            <span className="text-red-600">ちょっと待ってください。</span><br />
            <br />
            あなたの市場価値、<br />
            <span className="text-blue-600">本当はもっと高いかもしれません。</span>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            【真実】あなたは「安く使われてる」だけ
          </h2>
          
          <p className="mb-6">
            実は、<strong className="text-red-600">同じスキル・同じ経験でも、
            会社が変われば年収が100万円以上変わる</strong>
            ことって、普通にあります。
          </p>

          <div className="my-8 rounded-lg bg-yellow-50 border-2 border-yellow-400 p-6">
            <p className="mb-4 font-bold text-lg">実例：事務職の年収差</p>
            <div className="space-y-3">
              <div className="bg-white rounded p-4">
                <p className="font-bold mb-2">伝統的な日系企業の事務職</p>
                <p className="text-2xl font-bold">年収280万円</p>
                <p className="text-xs text-gray-600">
                  業務内容：データ入力、書類整理、電話対応
                </p>
              </div>
              <div className="bg-white rounded p-4">
                <p className="font-bold mb-2">IT企業の事務職</p>
                <p className="text-2xl font-bold text-green-600">年収380万円</p>
                <p className="text-xs text-gray-600">
                  業務内容：データ入力、書類整理、電話対応<br />
                  <strong>← 同じ業務内容なのに、年収100万円違う！</strong>
                </p>
              </div>
            </div>
          </div>

          <p className="text-xl font-bold mb-6">
            つまり、<br />
            <span className="text-blue-600">会社を変えるだけで、年収が上がる</span>
            ってことです。
          </p>

          <p className="mb-6">
            スキルアップしなくても、<br />
            資格を取らなくても、<br />
            <strong className="text-red-600">ただ環境を変えるだけで、年収100万円UP。</strong>
          </p>

          <p className="text-2xl font-bold text-center my-8">
            これ、<span className="text-red-600">知らないと一生損</span>ですよね？
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            あなたの本当の市場価値、知ってますか？
          </h2>
          
          <p className="mb-6">
            正直、<strong>自分の市場価値って、自分ではわかりません。</strong>
          </p>

          <p className="mb-6">
            「今の会社では年収300万円だから、自分の価値は300万円」<br />
            って思い込んでませんか？
          </p>

          <p className="text-xl font-bold mb-6">
            <span className="text-red-600">それ、完全に間違いです。</span>
          </p>

          <div className="my-8 rounded-lg bg-blue-50 border-2 border-blue-400 p-6">
            <p className="mb-4 font-bold text-blue-800">
              市場価値を知る方法
            </p>
            <p className="text-sm mb-4">
              一番確実なのは、<br />
              <strong>転職エージェントに聞くこと。</strong>
            </p>
            <div className="rounded bg-white p-4">
              <p className="text-xs mb-2">
                私の場合：<br />
                「出会えるエージェント」で紹介された3社に、<br />
                「私の市場価値っていくらですか？」って聞いたら...
              </p>
              <ul className="text-xs space-y-1 list-disc pl-4 mt-2">
                <li>A社：「380万円〜420万円くらいです」</li>
                <li>B社：「400万円は十分狙えます」</li>
                <li>C社：「経験を活かせる企業なら450万円も可能」</li>
              </ul>
              <p className="text-xs mt-3 font-bold text-blue-600">
                → 今の会社では290万円だけど、<br />
                本当は400万円以上の価値があったってこと！
              </p>
            </div>
          </div>

          <p className="text-2xl font-bold text-center my-8">
            あなたも、<br />
            <span className="text-red-600">本当の価値を知らないまま、
            安く使われてる</span>
            <br />
            かもしれません。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            年収300万円台から抜け出す、たった1つの方法
          </h2>
          
          <p className="mb-6">
            結論から言います。
          </p>

          <p className="text-3xl font-bold text-center my-8">
            <span className="text-blue-600">転職するしかない。</span>
          </p>

          <p className="mb-6">
            なぜなら、<br />
            <strong>今の会社で働き続けても、年収はほぼ上がらない</strong>
            から。
          </p>

          <div className="my-8 rounded-lg bg-gray-100 p-6">
            <p className="mb-4 font-bold">昇給の現実</p>
            <ul className="space-y-2 text-sm">
              <li>
                <strong>1年後：</strong>
                年収300万円 → 305万円（+5万円）
              </li>
              <li>
                <strong>2年後：</strong>
                年収305万円 → 310万円（+5万円）
              </li>
              <li>
                <strong>3年後：</strong>
                年収310万円 → 315万円（+5万円）
              </li>
            </ul>
            <p className="mt-4 font-bold text-center">
              3年我慢しても、<span className="text-red-600">たった+15万円</span>
            </p>
          </div>

          <div className="my-8 rounded-lg bg-green-50 border-2 border-green-400 p-6">
            <p className="mb-4 font-bold">転職した場合</p>
            <p className="text-sm mb-2">
              年収300万円 → <span className="text-3xl font-bold text-green-600">400万円</span>
            </p>
            <p className="text-center font-bold text-2xl text-green-700 mt-4">
              一気に+100万円！
            </p>
          </div>

          <p className="text-2xl font-bold text-center my-8">
            3年で+15万円 vs 一瞬で+100万円<br />
            <span className="text-blue-600">どっち選びますか？</span>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            今すぐ行動しないと、一生年収300万円台
          </h2>
          
          <p className="mb-6">
            厳しいこと言いますが、<br />
            <strong className="text-red-600">
              今行動しないと、30代になっても年収300万円台のまま
            </strong>
            です。
          </p>

          <p className="mb-6">
            なぜなら、<br />
            30代になると「即戦力」が求められるから、<br />
            未経験職種への転職が難しくなる。
          </p>

          <p className="mb-6">
            転職できる選択肢も減る。
          </p>

          <p className="mb-6 text-xl font-bold">
            <span className="text-blue-600">20代の今がラストチャンス</span>です。
          </p>

          <div className="my-8 rounded-lg bg-red-50 border-2 border-red-400 p-6">
            <p className="mb-4 text-xl font-bold text-red-700 text-center">
              このまま何もしなかったら...
            </p>
            <ul className="space-y-2 text-sm">
              <li>❌ 30歳になっても年収320万円</li>
              <li>❌ 同期は年収500万円超え</li>
              <li>❌ 転職したくても「即戦力じゃない」って落とされる</li>
              <li>❌ 「20代のうちに動けばよかった...」って後悔</li>
              <li>❌ 一生、年収300万円台で我慢</li>
            </ul>
          </div>

          <div className="my-8 rounded-lg bg-green-50 border-2 border-green-400 p-6">
            <p className="mb-4 text-xl font-bold text-green-700 text-center">
              今すぐ行動すれば...
            </p>
            <ul className="space-y-2 text-sm">
              <li>✅ 2ヶ月後には年収400万円の内定</li>
              <li>✅ 30歳には年収500万円超え</li>
              <li>✅ 同期に「年収いくら？」って自信持って答えられる</li>
              <li>✅ 「あの時行動してよかった」って思える</li>
              <li>✅ 経済的にも精神的にも余裕のある生活</li>
            </ul>
          </div>

          <p className="text-3xl font-bold text-center my-8">
            どっちの人生がいいですか？
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            最後に
          </h2>
          
          <p className="mb-6">
            年収300万円台って、<br />
            正直、生活キツイですよね。
          </p>

          <p className="mb-6">
            貯金もできない、<br />
            欲しいものも我慢、<br />
            友達の誘いも断る...
          </p>

          <p className="mb-6 text-xl font-bold">
            <span className="text-red-600">そんな生活、続けたいですか？</span>
          </p>

          <p className="mb-6">
            変えたいなら、<br />
            <strong>今すぐ行動してください。</strong>
          </p>

          <div className="my-8 rounded-lg bg-yellow-50 border-2 border-yellow-400 p-6">
            <p className="text-center mb-4">
              「出会えるエージェント」に登録するだけで、<br />
              <strong className="text-xl">年収400万円以上の求人</strong>
              が<br />
              たくさん紹介されます。
            </p>
            <p className="text-center text-sm mt-4">
              完全無料、30秒で完了。<br />
              リスクはゼロ。
            </p>
          </div>

          <p className="text-center text-xl font-bold">
            今すぐ、年収300万円台から抜け出しましょう。
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
            年収300万円台から脱出
          </h3>
          <p className="mb-8 text-lg opacity-95">
            あなたの本当の市場価値を知ろう<br />
            年収400万円以上の求人を、今すぐ紹介
          </p>
          <Link
            href="/gt/lp01deaeru/1"
            className="inline-flex items-center gap-3 rounded-full bg-white px-12 py-5 text-xl font-bold text-orange-600 shadow-2xl transition hover:scale-105 hover:bg-gray-50"
          >
            今すぐ無料診断をはじめる
            <ArrowRight className="h-6 w-6" />
          </Link>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
            <span>✓ 利用者の82%が年収400万円以上の求人を紹介</span>
            <span>✓ 平均年収UP額：+87万円</span>
          </div>
        </div>
      </div>

      <div className="my-8 rounded-xl bg-blue-50 border-2 border-blue-400 p-6">
        <p className="text-center font-bold text-xl mb-4 text-blue-900">
          P.S.
        </p>
        <p className="text-sm text-center text-gray-700 leading-relaxed">
          年収300万円で我慢し続けるのか、<br />
          年収400万円で余裕のある生活をするのか。<br />
          <br />
          その違いは、<br />
          今すぐクリックするかどうか、だけです。<br />
          <br />
          30秒で、人生変わります。
        </p>
      </div>
    </ArticleLayout>
  );
}
