import { type Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "../_components/ArticleLayout";
import {
  InsightCard,
  CheckList,
  InlineCTA,
  AlertBox,
} from "../_components/ArticleComponents";
import { ArrowRight, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "【緊急】20代、今すぐ転職しないとヤバい3つの理由｜出会えるエージェント",
  description: "「来年でいいや」って思ってる20代へ。1年遅れるだけで、選択肢が激減、年収も下がる。今すぐ動くべき理由を教えます。",
  keywords: "20代,転職,今すぐ,タイミング,緊急,エージェント",
  openGraph: {
    title: "【緊急】20代、今すぐ転職しないとヤバい3つの理由",
    description: "来年でいいや？それ、マジでヤバいです。今すぐ動くべき理由。",
    type: "article",
  },
};

export default function Article() {
  const relatedArticles = [
    {
      title: "1年前に転職してれば...後悔の話",
      slug: "20dai-1nen-go-koukai",
      category: "転職タイミング",
    },
    {
      title: "転職に最適なタイミングの見極め方",
      slug: "tensyoku-timing",
      category: "転職タイミング",
    },
    {
      title: "初めての転職で年収90万UP！成功の理由",
      slug: "20dai-first-tensyoku",
      category: "成功事例",
    },
  ];

  return (
    <ArticleLayout
      title="20代、今すぐ転職しないとヤバい3つの理由"
      category="転職タイミング"
      readTime={5}
      publishedDate="2026年1月29日"
      relatedArticles={relatedArticles}
    >
      <header className="mb-12">
        <h1 className="mb-6 text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
          【警告】「来年転職しよう」って<br />
          思ってる20代、マジでヤバいです
        </h1>
        <p className="text-lg leading-relaxed text-gray-600">
          1年後、絶対に後悔します。今すぐ動かないとヤバい理由を教えます。
        </p>
      </header>

      <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            27歳の友達が「もう遅い...」って泣いてた
          </h2>
          
          <p className="mb-6">
            先日、友達のQちゃん（27歳）が、<br />
            「転職したいけど、もう遅いかも...」って泣いてました。
          </p>

          <div className="my-6 rounded-lg bg-gray-100 p-6">
            <p className="mb-2 font-bold">Qちゃんの話：</p>
            <p className="text-sm">
              「24歳の時、『転職したいな』って思ってたの。<br />
              でも、『まだ若いし、いつでもできる』って先延ばしにしてた。<br />
              <br />
              気づいたら27歳。<br />
              <br />
              今になって転職活動始めたけど、<br />
              <strong className="text-red-600">
                24歳の時に見てた求人、もう応募できない...
              </strong><br />
              <br />
              『25歳まで』とか『26歳まで』って年齢制限ある求人、<br />
              めっちゃ多いんだよね。<br />
              <br />
              しかも、未経験OKの求人も激減。<br />
              <br />
              <strong className="text-red-600">
                『あの時やっておけば...』って、マジで後悔してる。
              </strong>
              」
            </p>
          </div>

          <p className="text-2xl font-bold text-center my-8">
            これ、<span className="text-red-600">他人事じゃないです。</span>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            【データで証明】25歳と29歳では、求人数が半分以下
          </h2>
          
          <div className="my-8 rounded-lg bg-red-50 border-2 border-red-400 p-6">
            <p className="mb-4 font-bold text-red-700 text-xl">
              年齢別：応募可能な求人数の変化
            </p>
            <div className="space-y-3">
              <div className="bg-white rounded p-4 flex justify-between items-center">
                <span className="font-bold">24〜25歳</span>
                <span className="text-2xl font-bold text-green-600">100%</span>
              </div>
              <div className="bg-white rounded p-4 flex justify-between items-center">
                <span className="font-bold">26〜27歳</span>
                <span className="text-2xl font-bold text-blue-600">75%</span>
              </div>
              <div className="bg-white rounded p-4 flex justify-between items-center">
                <span className="font-bold">28〜29歳</span>
                <span className="text-2xl font-bold text-orange-600">45%</span>
              </div>
              <div className="bg-white rounded p-4 flex justify-between items-center">
                <span className="font-bold">30歳以上</span>
                <span className="text-2xl font-bold text-red-600">30%</span>
              </div>
            </div>
            <p className="mt-6 text-center font-bold">
              <span className="text-red-600">25歳と29歳では、求人数が半分以下！</span>
            </p>
          </div>

          <p className="text-xl font-bold mb-6">
            つまり、<br />
            <span className="text-red-600">歳を取るほど、選択肢が減る</span>
            ってことです。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            20代が今すぐ転職すべき3つの理由
          </h2>
          
          <div className="my-8 space-y-6">
            <div className="rounded-lg bg-red-50 border-l-4 border-red-500 p-6">
              <h3 className="mb-3 text-xl font-bold text-red-700">
                理由① 1年後には、求人が25%減る
              </h3>
              <p className="text-sm mb-4">
                今24歳なら、1年後は25歳。<br />
                25歳なら、1年後は26歳。<br />
                <br />
                <strong>1歳上がるだけで、応募できる求人が約25%減ります。</strong>
              </p>
              <div className="rounded bg-white p-4">
                <p className="text-xs">
                  例えば、今なら40件の求人に応募できるのに、<br />
                  1年後には30件しか応募できない。<br />
                  <br />
                  <strong className="text-red-600">10件の選択肢を失う</strong>
                  ってことです。
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-orange-50 border-l-4 border-orange-500 p-6">
              <h3 className="mb-3 text-xl font-bold text-orange-700">
                理由② 未経験職種への転職が、どんどん難しくなる
              </h3>
              <p className="text-sm mb-4">
                「Webマーケターになりたい」<br />
                「エンジニアになりたい」<br />
                <br />
                未経験からの転職は、<strong>若ければ若いほど有利</strong>です。
              </p>
              <div className="rounded bg-white p-4">
                <p className="text-xs mb-2">
                  未経験採用の年齢制限（企業の本音）：
                </p>
                <ul className="text-xs space-y-1 list-disc pl-4">
                  <li>Webマーケター：できれば26歳まで</li>
                  <li>エンジニア：できれば28歳まで</li>
                  <li>デザイナー：できれば27歳まで</li>
                </ul>
                <p className="text-xs mt-3 text-red-600 font-bold">
                  → 30歳超えると、未経験はほぼ無理。
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-yellow-50 border-l-4 border-yellow-500 p-6">
              <h3 className="mb-3 text-xl font-bold text-yellow-700">
                理由③ 1年分の年収差が、永遠に埋まらない
              </h3>
              <p className="text-sm mb-4">
                今すぐ転職すれば年収400万円。<br />
                1年後に転職しても年収400万円。<br />
                <br />
                <strong className="text-red-600">でも、1年分の差（100万円）は戻ってきません。</strong>
              </p>
              <div className="rounded bg-white p-4">
                <p className="text-xs">
                  しかも、年収400万円でスタートすれば、<br />
                  昇給も400万円ベース。<br />
                  <br />
                  年収300万円でスタートすれば、<br />
                  昇給も300万円ベース。<br />
                  <br />
                  <strong className="text-red-600">
                    差は開く一方です。
                  </strong>
                </p>
              </div>
            </div>
          </div>

          <p className="text-3xl font-bold text-center my-8">
            もう、<span className="text-blue-600">待ってる場合じゃない</span>ですよね？
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            「出会えるエージェント」なら、今すぐ始められる
          </h2>
          
          <p className="mb-6">
            「転職したい」って思っても、<br />
            <strong>「何から始めればいいかわからない」</strong>
            <br />
            って人、多いですよね。
          </p>

          <p className="mb-6">
            大丈夫です。<br />
            <strong className="text-blue-600">「出会えるエージェント」に登録するだけ</strong>
            で、<br />
            あとは全部エージェントがサポートしてくれます。
          </p>

          <div className="my-8 rounded-lg bg-blue-50 border-2 border-blue-400 p-6">
            <p className="mb-4 font-bold text-blue-800">
              登録後の流れ
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <strong>登録後1〜2日：</strong>
                3社のエージェントから連絡が来る
              </li>
              <li>
                <strong>1週間以内：</strong>
                オンライン面談（希望条件を伝えるだけ）
              </li>
              <li>
                <strong>2週間後：</strong>
                求人を紹介してもらう（30〜60件）
              </li>
              <li>
                <strong>1ヶ月後：</strong>
                書類選考通過、面接スタート
              </li>
              <li>
                <strong>2ヶ月後：</strong>
                内定ゲット！
              </li>
            </ul>
            <p className="mt-4 text-center font-bold text-blue-700">
              → 今すぐ登録すれば、2ヶ月後には内定！
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            最後に
          </h2>
          
          <p className="mb-6">
            「来年でいいや」<br />
            「もう少し考えてから」<br />
            「準備ができてから」
          </p>

          <p className="mb-6 text-xl font-bold">
            <span className="text-red-600">その1年が、あなたの人生を変えます。</span>
          </p>

          <div className="my-8 rounded-lg bg-red-50 border-2 border-red-400 p-6">
            <p className="text-center mb-4 text-xl font-bold text-red-700">
              1年先延ばしにすると...
            </p>
            <ul className="space-y-2 text-sm">
              <li>❌ 求人が25%減る</li>
              <li>❌ 未経験転職が難しくなる</li>
              <li>❌ 年収100万円分損する</li>
              <li>❌ 友達との年収差が開く</li>
              <li>❌ 「もっと早く動けば...」って後悔</li>
            </ul>
          </div>

          <p className="mb-6 text-xl font-bold">
            <span className="text-blue-600">今が、ベストタイミングです。</span>
          </p>

          <p className="text-center text-2xl font-bold my-8">
            今すぐ、行動してください。
          </p>
        </section>

      <div className="my-12 overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 to-pink-700 p-8 md:p-12 text-white shadow-2xl">
        <div className="text-center">
          <div className="mb-6">
            <div className="mb-2 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-bold backdrop-blur-sm">
              完全無料・30秒で完了
            </div>
          </div>
          <h3 className="mb-4 text-3xl font-bold md:text-4xl">
            今すぐ動かないとヤバい
          </h3>
          <p className="mb-8 text-lg opacity-95">
            1年後に後悔しないために<br />
            30秒で人生が動き出します
          </p>
          <Link
            href="/gt/lp01deaeru/1"
            className="inline-flex items-center gap-3 rounded-full bg-white px-12 py-5 text-xl font-bold text-red-600 shadow-2xl transition hover:scale-105 hover:bg-gray-50"
          >
            今すぐ無料診断をはじめる
            <ArrowRight className="h-6 w-6" />
          </Link>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
            <span>✓ 今日登録すれば、2ヶ月後には内定</span>
            <span>✓ 1年遅れると年収100万円損</span>
          </div>
        </div>
      </div>

      <div className="my-8 rounded-xl bg-yellow-50 border-2 border-yellow-400 p-6">
        <p className="text-center font-bold text-xl mb-4 text-yellow-900">
          最後に、もう一度言います
        </p>
        <p className="text-sm text-center text-gray-700 leading-relaxed">
          今すぐ、クリックしてください。<br />
          <br />
          スマホを閉じる前に。<br />
          「あとで」にする前に。<br />
          <br />
          30秒の行動が、<br />
          1年後の年収を100万円変えます。<br />
          <br />
          今すぐ、動いてください。
        </p>
      </div>
    </ArticleLayout>
  );
}
