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
import { ArrowRight, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "【拡散希望】20代の転職、みんな知らないで損してる｜出会えるエージェント",
  description: "転職サイトだけ使ってる人、マジで損してます。20代の85%が知らない、転職で年収を最大化する方法を暴露します。",
  keywords: "20代,転職,知らないと損,裏技,秘密,エージェント",
  openGraph: {
    title: "【拡散希望】20代の転職、みんな知らないで損してる",
    description: "転職サイトだけ使ってる人、マジで損してます。",
    type: "article",
  },
};

export default function Article() {
  const relatedArticles = [
    {
      title: "初めての転職で年収90万UP！成功の理由",
      slug: "20dai-first-tensyoku",
      category: "成功事例",
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
      title="知らないと損する20代転職の真実"
      category="転職基礎"
      readTime={7}
      publishedDate="2026年1月29日"
      relatedArticles={relatedArticles}
    >
      <header className="mb-12">
        <h1 className="mb-6 text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
          【拡散希望】転職サイトだけ使ってる人、<br />
          マジで損してます
        </h1>
        <p className="text-lg leading-relaxed text-gray-600">
          20代の85%が知らない。転職で年収を最大化する「裏技」を暴露します。
        </p>
      </header>

      <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            「リクナビ」「マイナビ」だけで転職してませんか？
          </h2>
          
          <p className="mb-6">
            ぶっちゃけ聞きます。<br />
            転職するとき、<br />
            <strong className="text-red-600">「リクナビ」「マイナビ」とかの
            大手転職サイトだけ見てませんか？</strong>
          </p>

          <div className="my-8 rounded-lg bg-red-50 border-2 border-red-400 p-6">
            <p className="text-2xl font-bold text-center mb-4 text-red-700">
              ⚠️ それ、超もったいないです
            </p>
            <p className="text-center">
              転職サイトだけ使うと、<br />
              <strong className="text-xl">年収100万円以上損する可能性</strong>
              があります。
            </p>
          </div>

          <p className="mb-6 text-lg">
            なぜか？
          </p>

          <p className="mb-6 text-xl font-bold">
            それは、<br />
            <span className="text-blue-600">「本当にいい求人は、転職サイトに載ってない」</span>
            <br />
            からです。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            【衝撃の事実】いい求人の80%は「非公開」
          </h2>
          
          <p className="mb-6">
            実は、企業が出してる求人の<br />
            <strong className="text-red-600 text-2xl">約80%は「非公開求人」</strong>
            なんです。
          </p>

          <div className="my-8 rounded-lg bg-yellow-50 border-2 border-yellow-400 p-6">
            <p className="mb-4 font-bold">なんで非公開なの？</p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <span className="mr-2">💡</span>
                <span>
                  <strong>理由①：</strong>
                  競合他社に知られたくない重要ポジションだから<br />
                  <span className="text-xs text-gray-600">
                    （新規事業の責任者、戦略的なポジションなど）
                  </span>
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">💡</span>
                <span>
                  <strong>理由②：</strong>
                  応募が殺到しすぎるのを避けたいから<br />
                  <span className="text-xs text-gray-600">
                    （人気企業の好条件求人は、公開すると応募が数百件に）
                  </span>
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">💡</span>
                <span>
                  <strong>理由③：</strong>
                  質の高い人材だけを採用したいから<br />
                  <span className="text-xs text-gray-600">
                    （エージェント経由の方が、スクリーニング済み）
                  </span>
                </span>
              </li>
            </ul>
          </div>

          <div className="my-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
            <p className="text-2xl font-bold text-center mb-4">
              つまり！
            </p>
            <p className="text-center text-lg">
              転職サイトだけ見てると、<br />
              <strong className="text-3xl">80%の求人を見逃してる</strong>
              <br />
              ってことです。
            </p>
          </div>

          <p className="text-xl font-bold mb-6">
            非公開求人の特徴：
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-green-50 p-4">
              <p className="font-bold mb-2 text-green-700">✅ 年収が高い</p>
              <p className="text-xs">
                公開求人：年収300万円〜<br />
                非公開求人：年収400万円〜
              </p>
            </div>
            <div className="rounded-lg bg-green-50 p-4">
              <p className="font-bold mb-2 text-green-700">✅ 働きやすい</p>
              <p className="text-xs">
                リモートOK、残業少なめ、<br />
                福利厚生充実など
              </p>
            </div>
            <div className="rounded-lg bg-green-50 p-4">
              <p className="font-bold mb-2 text-green-700">✅ 競争率が低い</p>
              <p className="text-xs">
                公開求人：100人応募<br />
                非公開求人：10人程度
              </p>
            </div>
            <div className="rounded-lg bg-green-50 p-4">
              <p className="font-bold mb-2 text-green-700">✅ 優良企業が多い</p>
              <p className="text-xs">
                成長企業、安定企業、<br />
                ホワイト企業が中心
              </p>
            </div>
          </div>

          <p className="mt-8 text-center text-xl font-bold">
            この非公開求人にアクセスできるのが、<br />
            <span className="text-blue-600">「出会えるエージェント」</span>です！
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            【比較】転職サイト vs 出会えるエージェント
          </h2>
          
          <div className="overflow-x-auto my-8">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-3 text-left">項目</th>
                  <th className="border border-gray-300 px-4 py-3 text-center bg-red-50">
                    転職サイトだけ
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-center bg-green-50">
                    出会えるエージェント
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 font-bold">求人数</td>
                  <td className="border border-gray-300 px-4 py-3 text-center bg-red-50">
                    公開求人のみ（20%）
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center bg-green-50">
                    公開+非公開（100%）
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 font-bold">年収交渉</td>
                  <td className="border border-gray-300 px-4 py-3 text-center bg-red-50">
                    自分でやる（難しい）
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center bg-green-50">
                    プロが代行（+10〜50万円）
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 font-bold">書類作成</td>
                  <td className="border border-gray-300 px-4 py-3 text-center bg-red-50">
                    自分で全部やる
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center bg-green-50">
                    添削してくれる
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 font-bold">面接対策</td>
                  <td className="border border-gray-300 px-4 py-3 text-center bg-red-50">
                    なし
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center bg-green-50">
                    模擬面接あり
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 font-bold">企業情報</td>
                  <td className="border border-gray-300 px-4 py-3 text-center bg-red-50">
                    求人票だけ
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center bg-green-50">
                    内部情報も教えてくれる
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 font-bold">成功率</td>
                  <td className="border border-gray-300 px-4 py-3 text-center bg-red-50 font-bold text-red-700">
                    低い
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center bg-green-50 font-bold text-green-700">
                    高い
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-2xl font-bold text-center my-8">
            もう、<span className="text-blue-600">使わない理由ないですよね？</span>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            【実話】転職サイトだけで失敗した人の後悔
          </h2>
          
          <div className="my-8 space-y-6">
            <div className="rounded-lg bg-gray-100 p-6 border-l-4 border-gray-500">
              <p className="mb-2 font-bold">Gさん（27歳・男性）の後悔</p>
              <p className="text-sm mb-3">
                「リクナビで見つけた会社に転職したけど、入社してみたら残業月80時間超え。
                しかも年収は前職と変わらず...。
                <strong className="text-red-600">エージェント使えばよかった</strong>って、
                今すごく後悔してる。」
              </p>
            </div>

            <div className="rounded-lg bg-gray-100 p-6 border-l-4 border-gray-500">
              <p className="mb-2 font-bold">Hさん（24歳・女性）の後悔</p>
              <p className="text-sm mb-3">
                「マイナビで自分で応募して、内定もらえた。
                でも、後から友達に聞いたら、
                <strong className="text-red-600">同じ会社でもエージェント経由なら
                年収50万円高かった</strong>らしい...。
                知らなくて損した。」
              </p>
            </div>

            <div className="rounded-lg bg-gray-100 p-6 border-l-4 border-gray-500">
              <p className="mb-2 font-bold">Iくん（26歳・男性）の後悔</p>
              <p className="text-sm mb-3">
                「転職サイトで10社応募したけど、全部書類落ち。
                職務経歴書の書き方が悪かったっぽい。
                <strong className="text-red-600">エージェントに添削してもらえば、
                もっと早く内定もらえたのに</strong>...。
                時間無駄にした。」
              </p>
            </div>
          </div>

          <p className="text-center text-xl font-bold my-8">
            こんな後悔、したくないですよね？
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            なぜ「出会えるエージェント」なのか？
          </h2>
          
          <p className="mb-6">
            「転職エージェントがいいのはわかったけど、<br />
            なんで『出会えるエージェント』なの？」
          </p>

          <p className="mb-6">
            って思いますよね。<br />
            理由は簡単です。
          </p>

          <div className="my-8 space-y-6">
            <div className="rounded-lg bg-blue-50 border-2 border-blue-400 p-6">
              <h3 className="mb-4 text-2xl font-bold text-blue-800">
                理由① 「エージェント選び」が一番難しいから
              </h3>
              <p className="mb-4">
                転職エージェントって、<strong>日本に数千社</strong>あるの知ってました？
              </p>
              <div className="rounded bg-white p-4">
                <p className="text-sm mb-2">エージェント選びの現実：</p>
                <ul className="text-xs space-y-2 list-disc pl-4">
                  <li>大手だけで10社以上ある</li>
                  <li>特化型も含めると数千社</li>
                  <li>どこがいいか、調べるだけで疲れる</li>
                  <li>ネットの情報は、ステマっぽくて信用できない</li>
                  <li>結局、CMでよく見る大手に適当に登録</li>
                  <li>→ 合わなくて後悔...</li>
                </ul>
              </div>
              <p className="mt-4 text-sm font-bold text-blue-700">
                「出会えるエージェント」なら、<br />
                <strong>あなたに合うエージェントを自動で選んでくれる</strong>から、
                迷わない！
              </p>
            </div>

            <div className="rounded-lg bg-purple-50 border-2 border-purple-400 p-6">
              <h3 className="mb-4 text-2xl font-bold text-purple-800">
                理由② 3社使うのが最強だから
              </h3>
              <p className="mb-4">
                転職のプロは、みんな<strong>「最低3社は使え」</strong>って言います。
              </p>
              <div className="rounded bg-white p-4">
                <p className="text-sm mb-2">3社使うメリット：</p>
                <ul className="text-xs space-y-1 list-disc pl-4">
                  <li>求人の選択肢が3倍になる</li>
                  <li>担当者を比較できる（相性いい人が見つかる）</li>
                  <li>複数内定で年収交渉しやすい</li>
                  <li>エージェント同士を競わせられる</li>
                </ul>
              </div>
              <p className="mt-4 text-sm font-bold text-purple-700">
                でも、3社それぞれ登録するの、めっちゃ面倒...<br />
                <br />
                「出会えるエージェント」なら、<br />
                <strong>1回の入力で3社に一括登録！</strong><br />
                超ラク！
              </p>
            </div>

            <div className="rounded-lg bg-orange-50 border-2 border-orange-400 p-6">
              <h3 className="mb-4 text-2xl font-bold text-orange-800">
                理由③ 変なエージェントを避けられるから
              </h3>
              <p className="mb-4">
                正直、エージェントの中には、<br />
                <strong className="text-red-600">「とりあえず適当な会社に入れればいい」</strong>
                <br />
                って考えの、ヤバいところもあります。
              </p>
              <div className="rounded bg-white p-4">
                <p className="text-sm mb-2">ヤバいエージェントの特徴：</p>
                <ul className="text-xs space-y-1 list-disc pl-4">
                  <li>ブラック企業も平気で紹介</li>
                  <li>年収交渉してくれない</li>
                  <li>サポートが雑</li>
                  <li>入社後のフォローなし</li>
                </ul>
              </div>
              <p className="mt-4 text-sm font-bold text-orange-700">
                「出会えるエージェント」は、<br />
                <strong>優良エージェントだけを厳選</strong>してるから、<br />
                ヤバいところに当たるリスクがない！
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            今すぐ登録すべき人
          </h2>
          
          <div className="my-8 rounded-lg bg-yellow-50 border-2 border-yellow-400 p-6">
            <p className="mb-4 font-bold text-lg">
              1つでも当てはまったら、今すぐ登録してください
            </p>
            <ul className="space-y-2">
              <li>✅ 今の年収に満足してない</li>
              <li>✅ 友達が転職で年収上がったって聞いて焦ってる</li>
              <li>✅ 転職したいけど、何から始めればいいかわからない</li>
              <li>✅ 転職サイトに登録したけど、何もしてない</li>
              <li>✅ このまま30歳になるのが不安</li>
              <li>✅ もっといい会社があるんじゃないかと思ってる</li>
              <li>✅ 転職で失敗したくない</li>
            </ul>
          </div>

          <p className="text-center text-xl font-bold my-8">
            <span className="text-red-600">20代の今がチャンス。</span><br />
            30歳になってからじゃ、遅いです。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            登録の流れ（30秒で完了）
          </h2>
          
          <div className="my-8 space-y-4">
            <div className="rounded-lg bg-gray-50 p-4 border-l-4 border-blue-500">
              <p className="font-bold mb-2">STEP 1：基本情報を入力（15秒）</p>
              <p className="text-sm">年齢、職歴、希望条件を入力</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4 border-l-4 border-green-500">
              <p className="font-bold mb-2">STEP 2：AIが最適なエージェントを選定（5秒）</p>
              <p className="text-sm">あなたに合うエージェント3社を自動マッチング</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4 border-l-4 border-purple-500">
              <p className="font-bold mb-2">STEP 3：登録完了（10秒）</p>
              <p className="text-sm">LINEまたはメールで連絡が来るのを待つだけ</p>
            </div>
          </div>

          <p className="text-center text-lg mb-6">
            これだけで、<br />
            <strong className="text-blue-600">年収100万円UPのチャンス</strong>
            が手に入ります。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            最後に：今すぐ行動してください
          </h2>
          
          <p className="mb-6">
            この記事を読んで、<br />
            「へー、そうなんだ」で終わらせないでください。
          </p>

          <div className="my-8 rounded-lg bg-red-50 border-2 border-red-400 p-6">
            <p className="text-xl font-bold mb-4 text-red-700">
              今日行動しないと、明日も行動しません。
            </p>
            <p className="text-sm">
              「あとでやろう」は、絶対にやりません。<br />
              人間ってそういうものです。
            </p>
            <p className="mt-4 text-sm">
              この記事を読み終わったら、<br />
              スマホを閉じる前に、<br />
              <strong>今すぐ登録してください。</strong>
            </p>
          </div>

          <p className="mb-6">
            <strong className="text-2xl">30秒の行動が、人生を変えます。</strong>
          </p>

          <p className="mb-6">
            1年後、<br />
            「あの時登録してよかった」<br />
            「年収100万円上がった」<br />
            「理想の会社に転職できた」
          </p>

          <p className="mb-6 text-xl font-bold">
            って、絶対に思います。
          </p>

          <p className="text-center text-2xl font-bold text-red-600 my-8">
            今すぐ、クリックしてください。
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
            知らないと年収100万円損する
          </h3>
          <p className="mb-8 text-lg opacity-95">
            あなたの年収を変えるエージェントに、<br />
            今すぐ出会ってください
          </p>
          <Link
            href="/gt/lp01deaeru/1"
            className="inline-flex items-center gap-3 rounded-full bg-white px-12 py-5 text-xl font-bold text-emerald-600 shadow-2xl transition hover:scale-105 hover:bg-gray-50"
          >
            今すぐ無料診断をはじめる
            <ArrowRight className="h-6 w-6" />
          </Link>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
            <span>✓ 登録者の78%が年収アップに成功</span>
            <span>✓ 平均年収UP額：+87万円</span>
            <span>✓ 20代の利用者満足度：94%</span>
          </div>
        </div>
      </div>

      <div className="my-8 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-white">
        <p className="text-center font-bold text-2xl mb-4">
          P.S. 最後に本音を言います
        </p>
        <p className="text-sm text-center leading-relaxed">
          正直、この記事読んでも、<br />
          行動しない人が90%です。<br />
          <br />
          でも、その90%の人は、<br />
          一生年収が上がりません。<br />
          <br />
          行動した10%の人だけが、<br />
          年収100万円UP、理想の会社、充実した生活を手に入れます。<br />
          <br />
          あなたは、<br />
          どっちの10%になりたいですか？
        </p>
      </div>
    </ArticleLayout>
  );
}
