import { type Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "../_components/ArticleLayout";
import {
  InsightCard,
  CheckList,
  InlineCTA,
  AlertBox,
} from "../_components/ArticleComponents";
import { ArrowRight, Home as HomeIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "【20代向け】週2在宅勤務を実現した私の転職術｜出会えるエージェント",
  description: "満員電車から解放されたい。家で仕事したい。20代でリモートワークを実現するための、超具体的な転職方法を教えます。",
  keywords: "20代,在宅勤務,リモートワーク,転職,テレワーク,エージェント",
  openGraph: {
    title: "【20代向け】週2在宅勤務を実現した私の転職術",
    description: "満員電車から解放。リモートワークを実現する転職方法。",
    type: "article",
  },
};

export default function Article() {
  const relatedArticles = [
    {
      title: "リモートワーク求人の探し方",
      slug: "remote-work-kyujin",
      category: "働き方改革",
    },
    {
      title: "IT業界への未経験転職を成功させる方法",
      slug: "it-gyoukai-tensyoku",
      category: "業界転職",
    },
    {
      title: "ベンチャー企業への転職で成功する方法",
      slug: "venture-tensyoku",
      category: "ベンチャー転職",
    },
  ];

  return (
    <ArticleLayout
      title="週2在宅勤務を実現した転職術"
      category="働き方改革"
      readTime={5}
      publishedDate="2026年1月29日"
      relatedArticles={relatedArticles}
    >
      <header className="mb-12">
        <h1 className="mb-6 text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
          満員電車に乗らなくなって<br />
          人生変わった話
        </h1>
        <p className="text-lg leading-relaxed text-gray-600">
          週2在宅勤務、最高すぎる。20代でリモートワークを実現する方法。
        </p>
      </header>

      <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            毎朝6時起き、満員電車1時間...もう無理
          </h2>
          
          <p className="mb-6">
            前の会社、毎朝6時起きで、<br />
            満員電車に1時間揺られて通勤してました。
          </p>

          <div className="my-6 rounded-lg bg-gray-100 p-6">
            <p className="mb-3 font-bold">前職の通勤地獄：</p>
            <ul className="space-y-2 text-sm">
              <li>😫 毎朝6時起床（眠すぎ）</li>
              <li>🚃 満員電車で片道1時間（地獄）</li>
              <li>😰 帰りも1時間（疲れてるのに）</li>
              <li>🏠 家に着くのは夜8時（何もできない）</li>
              <li>💤 寝るだけの生活</li>
            </ul>
          </div>

          <p className="mb-6">
            しかも、通勤時間って<br />
            <strong className="text-red-600">1日2時間＝年間500時間</strong>
            も無駄にしてるんですよね。
          </p>

          <p className="mb-6">
            500時間あったら、<br />
            副業できるし、勉強できるし、趣味に使えるし...
          </p>

          <p className="text-xl font-bold mb-6">
            <span className="text-red-600">マジで人生の無駄遣い</span>だと思いました。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            転職して週2在宅勤務になったら、QOL爆上がり
          </h2>
          
          <div className="my-8 rounded-lg bg-gradient-to-r from-green-100 to-blue-100 border-2 border-green-400 p-6">
            <p className="mb-4 text-xl font-bold text-green-800">
              今の生活（週2在宅勤務）
            </p>
            <ul className="space-y-3 text-sm">
              <li>
                <strong>✅ 在宅の日は8時起き</strong><br />
                <span className="text-xs text-gray-600">
                  → 2時間多く寝られる。体調めっちゃいい。
                </span>
              </li>
              <li>
                <strong>✅ 満員電車ゼロ</strong><br />
                <span className="text-xs text-gray-600">
                  → ストレスフリー。朝から機嫌いい。
                </span>
              </li>
              <li>
                <strong>✅ 浮いた通勤時間で副業</strong><br />
                <span className="text-xs text-gray-600">
                  → 月3万円稼げてる。年収プラス36万円。
                </span>
              </li>
              <li>
                <strong>✅ ランチ代の節約</strong><br />
                <span className="text-xs text-gray-600">
                  → 在宅の日は自炊。月1万円浮く。
                </span>
              </li>
              <li>
                <strong>✅ 仕事終わりに予定入れられる</strong><br />
                <span className="text-xs text-gray-600">
                  → 友達と会う時間が増えた。
                </span>
              </li>
            </ul>
          </div>

          <p className="text-2xl font-bold text-center my-8">
            QOL、<span className="text-green-600">爆上がりです。</span>
          </p>

          <p className="mb-6">
            マジで、<br />
            <strong className="text-blue-600">転職してよかった</strong>
            って心から思ってます。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            20代でリモートワーク実現する3つのポイント
          </h2>
          
          <div className="my-8 space-y-6">
            <div className="rounded-lg bg-blue-50 border-2 border-blue-400 p-6">
              <h3 className="mb-4 text-2xl font-bold text-blue-800">
                ポイント① IT・Web業界を狙う
              </h3>
              <p className="mb-4">
                リモートワーク率が一番高いのは、<br />
                <strong>IT・Web業界（約80%が導入）</strong>
              </p>
              <div className="rounded bg-white p-4">
                <p className="text-xs mb-2">おすすめの職種：</p>
                <ul className="text-xs space-y-1 list-disc pl-4">
                  <li>Webマーケター（未経験でも目指せる）</li>
                  <li>エンジニア（プログラミングスクール経由で）</li>
                  <li>デザイナー（ポートフォリオ作れば可能）</li>
                  <li>カスタマーサクセス（営業経験活かせる）</li>
                  <li>バックオフィス（人事、経理なども在宅化）</li>
                </ul>
              </div>
            </div>

            <div className="rounded-lg bg-purple-50 border-2 border-purple-400 p-6">
              <h3 className="mb-4 text-2xl font-bold text-purple-800">
                ポイント② 「リモートワーク重視」をエージェントに伝える
              </h3>
              <p className="mb-4 text-sm">
                エージェントに、<br />
                <strong>「リモートワーク可能な企業希望です」</strong>
                <br />
                って最初にはっきり伝えることが超重要。
              </p>
              <div className="rounded bg-white p-4">
                <p className="text-xs">
                  実際、私が「出会えるエージェント」で紹介された3社に<br />
                  「リモートワーク重視」って伝えたら、<br />
                  <br />
                  紹介された求人の<strong className="text-purple-600">約90%がリモートOK</strong>
                  でした。<br />
                  <br />
                  希望を伝えるだけで、こんなに変わる！
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-green-50 border-2 border-green-400 p-6">
              <h3 className="mb-4 text-2xl font-bold text-green-800">
                ポイント③ 面接で「リモート経験」をアピール
              </h3>
              <p className="mb-4 text-sm">
                コロナ禍でリモート経験ある人、多いはず。<br />
                それ、<strong>めっちゃアピールポイント</strong>です。
              </p>
              <div className="rounded bg-white p-4">
                <p className="text-xs mb-2">アピール例：</p>
                <p className="text-xs">
                  「前職でもリモートワークを経験しており、<br />
                  自己管理能力には自信があります。<br />
                  オンラインツール（Slack、Zoom、Notionなど）も使いこなせます。」<br />
                  <br />
                  → これだけで、企業の安心感が全然違う！
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            リモートワーク転職で失敗しないために
          </h2>
          
          <p className="mb-6">
            「リモートワーク可」って書いてあっても、<br />
            <strong className="text-red-600">実際は週4出社が必要</strong>
            <br />
            とかあるので注意！
          </p>

          <div className="my-8 rounded-lg bg-yellow-50 border-2 border-yellow-400 p-6">
            <p className="mb-4 font-bold">
              エージェントに確認すべきこと
            </p>
            <ul className="space-y-2 text-sm">
              <li>✅ 実際のリモート頻度（週何日？）</li>
              <li>✅ 入社してすぐリモート可能か？</li>
              <li>✅ 居住地の制限はあるか？</li>
              <li>✅ フルリモートは可能か？</li>
              <li>✅ 在宅勤務手当はあるか？</li>
            </ul>
          </div>

          <p className="mb-6">
            こういう<strong>細かい条件</strong>も、<br />
            エージェントなら事前に確認してくれます。
          </p>

          <p className="text-xl font-bold">
            自分で応募だと、入社してから「聞いてないよ...」ってなりがち。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            「出会えるエージェント」なら、リモート求人が見つかる
          </h2>
          
          <p className="mb-6">
            実は、「出会えるエージェント」で<br />
            <strong>「リモートワーク重視」</strong>
            <br />
            って入力すると...
          </p>

          <div className="my-8 rounded-lg bg-blue-50 border-2 border-blue-400 p-6">
            <p className="mb-4 font-bold text-blue-800">
              リモートワークに強いエージェントを優先的に紹介してくれます
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                ✅ IT・Web企業の求人が豊富なエージェント
              </li>
              <li>
                ✅ リモートワーク求人を多く保有するエージェント
              </li>
              <li>
                ✅ ベンチャー・スタートアップに強いエージェント<br />
                <span className="text-xs text-gray-600">
                  （ベンチャーはリモート率高い）
                </span>
              </li>
            </ul>
            <p className="mt-4 text-sm font-bold text-blue-700">
              → リモート求人が集まりやすい！
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            在宅勤務で変わったこと
          </h2>
          
          <div className="my-8 rounded-lg bg-green-50 p-6">
            <p className="mb-4 font-bold text-green-800">
              在宅勤務で得られたもの
            </p>
            <ul className="space-y-3 text-sm">
              <li>
                <strong>⏰ 時間：</strong>
                通勤時間2時間/日 → 年間500時間の自由時間ゲット
              </li>
              <li>
                <strong>💰 お金：</strong>
                ランチ代、交通費の節約で月2万円浮く → 年間24万円
              </li>
              <li>
                <strong>😊 ストレス：</strong>
                満員電車のストレスゼロ。QOL爆上がり
              </li>
              <li>
                <strong>💪 健康：</strong>
                睡眠時間が増えて、体調がめっちゃいい
              </li>
              <li>
                <strong>👫 人間関係：</strong>
                友達と会う時間が増えた。プライベート充実
              </li>
            </ul>
          </div>

          <p className="text-2xl font-bold text-center my-8">
            マジで、<span className="text-green-600">転職してよかった</span>です。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            最後に
          </h2>
          
          <p className="mb-6">
            毎朝、満員電車に揺られて、<br />
            疲れ果てて帰宅。
          </p>

          <p className="mb-6">
            そんな生活、<br />
            <strong className="text-red-600">もう終わりにしませんか？</strong>
          </p>

          <p className="mb-6">
            リモートワークできる会社、<br />
            <strong>めちゃくちゃあります。</strong>
          </p>

          <p className="mb-6">
            あとは、<br />
            <strong className="text-blue-600">その求人を紹介してくれるエージェントを見つけるだけ。</strong>
          </p>

          <div className="my-8 rounded-lg bg-yellow-50 border-2 border-yellow-400 p-6">
            <p className="text-center mb-4">
              「出会えるエージェント」で<br />
              <strong>「リモートワーク重視」</strong>
              って入力するだけで、<br />
              <br />
              リモート求人がたくさん紹介されます。
            </p>
          </div>

          <p className="text-center text-xl font-bold">
            今すぐ登録して、<br />
            <span className="text-green-600">満員電車から解放</span>
            されましょう。
          </p>
        </section>

      <div className="my-12 overflow-hidden rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-600 p-8 md:p-12 text-white shadow-2xl">
        <div className="text-center">
          <div className="mb-6">
            <div className="mb-2 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-bold backdrop-blur-sm">
              完全無料・30秒で完了
            </div>
          </div>
          <h3 className="mb-4 text-3xl font-bold md:text-4xl">
            満員電車から解放されたい人へ
          </h3>
          <p className="mb-8 text-lg opacity-95">
            週2〜3在宅勤務、フルリモート求人を<br />
            今すぐ紹介してもらおう
          </p>
          <Link
            href="/gt/lp01deaeru/1"
            className="inline-flex items-center gap-3 rounded-full bg-white px-12 py-5 text-xl font-bold text-cyan-600 shadow-2xl transition hover:scale-105 hover:bg-gray-50"
          >
            無料診断をはじめる
            <ArrowRight className="h-6 w-6" />
          </Link>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
            <span>✓ リモートワーク求人多数</span>
            <span>✓ 完全リモート求人もあり</span>
            <span>✓ QOL爆上がり</span>
          </div>
        </div>
      </div>
    </ArticleLayout>
  );
}
