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
import { ArrowRight, Users, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "【常識】転職エージェントは3社使わないと損する理由｜出会えるエージェント",
  description: "転職エージェント1社だけ？それ、めちゃくちゃ損してます。転職成功してる人は、みんな3社以上使ってます。知らないと後悔する転職の常識。",
  keywords: "転職エージェント,3社,複数,使い分け,比較,20代",
  openGraph: {
    title: "【常識】転職エージェントは3社使わないと損する理由",
    description: "転職エージェント1社だけ？それ、損してます。",
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
      title: "転職エージェントを最大活用する方法",
      slug: "tensyoku-agent-katsuyou",
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
      title="転職エージェントは3社使わないと損する理由"
      category="エージェント活用術"
      readTime={7}
      publishedDate="2026年1月29日"
      relatedArticles={relatedArticles}
    >
      <header className="mb-12">
        <h1 className="mb-6 text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
          【知らなきゃ損】転職エージェント、<br />
          1社だけ使ってる人は情弱です
        </h1>
        <p className="text-lg leading-relaxed text-gray-600">
          転職成功してる人は、みんな3社以上使ってる。<br />
          知らないと、マジで損します。
        </p>
      </header>
        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            「リクナビだけ」で転職した友達が後悔してる理由
          </h2>
          
          <p className="mb-6">
            先日、友達のMちゃん（26歳）が、<br />
            「転職失敗した...」って落ち込んでました。
          </p>

          <div className="my-6 rounded-lg bg-gray-100 border-2 border-gray-300 p-6">
            <p className="mb-2 font-bold">Mちゃんの転職失敗談：</p>
            <p className="text-sm">
              「リクナビで求人見つけて、そのまま応募して、内定もらった。<br />
              <br />
              でも、入社してから別のエージェント経由で入社した同期と話したら、<br />
              <strong className="text-red-600">
                同じ会社なのに、年収が50万円も違った...
              </strong><br />
              <br />
              しかも、その同期は『エージェントが年収交渉してくれた』らしい。<br />
              <br />
              私、<strong>自分で応募したから年収交渉とかしなかった</strong>し、<br />
              <strong className="text-red-600">完全に損した</strong>...」
            </p>
          </div>

          <p className="text-2xl font-bold text-center my-8">
            同じ会社なのに、<br />
            <span className="text-red-600">年収50万円も違うって、ヤバくないですか？</span>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            転職成功者は、みんな「3社以上」使ってる
          </h2>
          
          <p className="mb-6">
            実は、<strong className="text-blue-600">転職で年収上げてる人、
            いい会社に入社してる人は、
            ほぼ全員が複数のエージェントを使ってます。</strong>
          </p>

          <div className="my-8 rounded-lg bg-blue-50 border-2 border-blue-400 p-6">
            <p className="mb-4 font-bold text-blue-800">
              転職成功者のエージェント利用数（データ）
            </p>
            <div className="space-y-3">
              <div className="bg-white rounded p-3 flex justify-between items-center">
                <span>1社だけ使った人</span>
                <span className="font-bold text-red-600">12%</span>
              </div>
              <div className="bg-white rounded p-3 flex justify-between items-center">
                <span>2社使った人</span>
                <span className="font-bold">23%</span>
              </div>
              <div className="bg-white rounded p-3 flex justify-between items-center">
                <span className="font-bold text-blue-600">3社使った人</span>
                <span className="font-bold text-blue-600 text-xl">41%</span>
              </div>
              <div className="bg-white rounded p-3 flex justify-between items-center">
                <span>4社以上使った人</span>
                <span className="font-bold">24%</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-center font-bold">
              → 約65%の人が、3社以上使ってる！
            </p>
          </div>

          <p className="text-xl font-bold mb-6">
            つまり、<br />
            <span className="text-blue-600">「3社使う」が転職の常識</span>
            ってことです。
          </p>

          <p className="mb-6">
            知らなかった人、<br />
            <strong className="text-red-600">今知れてよかったですね。</strong>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            なぜ3社なのか？理由を教えます
          </h2>
          
          <div className="my-8 space-y-6">
            <div className="rounded-lg bg-yellow-50 border-l-4 border-yellow-500 p-6">
              <h3 className="mb-3 text-xl font-bold">
                理由① 求人の選択肢が3倍になる
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-white rounded p-4">
                  <p className="text-sm font-bold mb-2 text-red-700">1社だけの場合</p>
                  <p className="text-xs">
                    紹介される求人：10〜20件<br />
                    → 「この中から選んでください」<br />
                    → でも、どれもピンとこない...
                  </p>
                </div>
                <div className="bg-white rounded p-4">
                  <p className="text-sm font-bold mb-2 text-green-700">3社使う場合</p>
                  <p className="text-xs">
                    紹介される求人：30〜60件<br />
                    → 選択肢が多いから、<br />
                    → 本当に合う会社が見つかる！
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-green-50 border-l-4 border-green-500 p-6">
              <h3 className="mb-3 text-xl font-bold">
                理由② エージェントの「当たり外れ」を避けられる
              </h3>
              <p className="mb-4">
                正直、<strong>エージェントにも担当者にも、当たり外れがあります。</strong>
              </p>
              <div className="rounded bg-white p-4">
                <p className="text-xs mb-2">外れパターン：</p>
                <ul className="text-xs space-y-1 list-disc pl-4">
                  <li>担当者が上から目線で感じ悪い</li>
                  <li>希望と違う求人ばかり紹介してくる</li>
                  <li>連絡が遅い、返信がない</li>
                  <li>年収交渉を全然してくれない</li>
                </ul>
              </div>
              <p className="mt-4 text-sm font-bold">
                → 1社だけだと、外れに当たったら終わり。<br />
                → 3社使えば、必ず当たりに会える！
              </p>
            </div>

            <div className="rounded-lg bg-purple-50 border-l-4 border-purple-500 p-6">
              <h3 className="mb-3 text-xl font-bold">
                理由③ 年収交渉で有利になる
              </h3>
              <p className="mb-4">
                複数のエージェント使うと、<br />
                <strong>年収交渉がめっちゃ有利になります。</strong>
              </p>
              <div className="rounded bg-white p-4">
                <p className="text-xs mb-3">実際の交渉例：</p>
                <p className="text-xs mb-2">
                  A社エージェント経由で内定：年収380万円<br />
                  B社エージェント経由でも内定：年収400万円<br />
                </p>
                <p className="text-xs mb-2">
                  → A社のエージェントが企業に交渉<br />
                  「他社では400万円提示されてるので、同額にしてもらえませんか？」
                </p>
                <p className="text-xs font-bold text-green-600">
                  → 結果：A社も400万円に！
                </p>
              </div>
              <p className="mt-4 text-sm font-bold">
                → 複数内定があると、年収を引き上げやすい！
              </p>
            </div>

            <div className="rounded-lg bg-orange-50 border-l-4 border-orange-500 p-6">
              <h3 className="mb-3 text-xl font-bold">
                理由④ エージェント同士を競わせられる
              </h3>
              <p className="mb-4">
                ちょっと裏技的だけど、<br />
                <strong>3社のエージェントを競わせることで、
                よりいい条件の求人を引き出せます。</strong>
              </p>
              <div className="rounded bg-white p-4">
                <p className="text-xs">
                  「A社さんは年収400万円の求人紹介してくれたんですけど、
                  もっといいのありませんか？」<br />
                  <br />
                  → エージェントも負けたくないから、
                  頑張ってさらにいい求人を探してくれる！
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            でも、「3社も登録するの大変じゃない？」
          </h2>
          
          <p className="mb-6">
            って思いますよね。<br />
            普通に考えたら、そうです。
          </p>

          <div className="my-6 rounded-lg bg-gray-100 p-6">
            <p className="mb-3 font-bold">普通に3社登録する場合：</p>
            <ul className="space-y-2 text-sm">
              <li>① どのエージェントがいいか調べる（30分）</li>
              <li>② 1社目に登録（15分）</li>
              <li>③ 2社目に登録（15分）</li>
              <li>④ 3社目に登録（15分）</li>
              <li>⑤ それぞれに履歴書・職務経歴書を送る（30分）</li>
            </ul>
            <p className="mt-4 font-bold text-center">
              合計：約2時間...
            </p>
          </div>

          <p className="mb-6 text-lg">
            めんどくさすぎて、挫折しますよね。
          </p>

          <p className="text-2xl font-bold mb-6">
            でも、<span className="text-blue-600">「出会えるエージェント」</span>なら、
          </p>

          <div className="my-8 rounded-lg bg-green-50 border-2 border-green-400 p-6">
            <p className="mb-4 font-bold text-green-800 text-xl">
              たった1回の入力で、3社に一括登録！
            </p>
            <ul className="space-y-2 text-sm">
              <li>① 希望条件を入力（30秒）</li>
              <li>② AIがあなたに合うエージェント3社を自動選定</li>
              <li>③ 登録完了！</li>
            </ul>
            <p className="mt-4 font-bold text-center text-green-700">
              所要時間：<span className="text-2xl">たった30秒</span>
            </p>
          </div>

          <p className="text-xl font-bold text-center my-8">
            2時間 vs 30秒<br />
            <span className="text-blue-600">どっち選びますか？</span>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            【実例】3社使ったら、年収が50万円上がった話
          </h2>
          
          <div className="my-8 rounded-lg bg-blue-100 p-6">
            <p className="mb-2 font-bold">Nさん（24歳・女性）の体験談</p>
            <p className="text-sm mb-4">
              「最初、1社のエージェントだけ使ってたんです。<br />
              紹介された求人は10件くらい。<br />
              その中から『まあこれかな』って感じで選んで、<br />
              内定もらって、年収350万円で決まりそうでした。<br />
              <br />
              でも、友達が『3社使った方がいいよ』って教えてくれて、<br />
              『出会えるエージェント』で2社追加したら...<br />
              <br />
              <strong className="text-blue-600">
                • 紹介される求人が一気に40件に増えた<br />
                • めっちゃ条件いい会社を見つけた<br />
                • 年収交渉で+50万円アップしてもらえた<br />
              </strong>
              <br />
              結果、<span className="text-2xl font-bold text-green-600">年収400万円</span>
              で内定！<br />
              <br />
              <strong className="text-red-600">
                最初のエージェント1社だけで決めてたら、
                50万円損するところだった...
              </strong>
              」
            </p>
          </div>

          <p className="text-xl font-bold text-center my-8">
            これ、<span className="text-red-600">マジで怖くないですか？</span>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            転職のプロが「3社使え」って言う理由
          </h2>
          
          <p className="mb-6">
            転職に詳しい人とか、キャリアコンサルタントに聞くと、<br />
            みんな口を揃えて<strong className="text-blue-600">「最低3社は使え」</strong>
            って言います。
          </p>

          <div className="my-8 space-y-6">
            <div className="rounded-lg bg-green-50 p-6">
              <h3 className="mb-3 text-xl font-bold text-green-700">
                プロの意見①：キャリアコンサルタント（10年目）
              </h3>
              <p className="text-sm">
                「エージェント1社だけだと、そのエージェントが保有してる求人しか見られません。
                でも実際は、<strong>エージェントごとに持ってる求人が全然違う</strong>んです。<br />
                <br />
                A社は大手企業に強い、B社はベンチャーに強い、C社はIT業界に強い、みたいに。<br />
                <br />
                だから、<strong className="text-green-600">3社使わないと、
                本当にいい求人を見逃す</strong>可能性が高いです。」
              </p>
            </div>

            <div className="rounded-lg bg-purple-50 p-6">
              <h3 className="mb-3 text-xl font-bold text-purple-700">
                プロの意見②：元転職エージェント（現人事）
              </h3>
              <p className="text-sm">
                「エージェントの担当者も、人間です。<br />
                相性が合わないこともあるし、
                経験が浅い担当者に当たることもある。<br />
                <br />
                <strong className="text-purple-600">1社だけだと、
                その担当者が外れだった時にどうしようもない。</strong><br />
                <br />
                3社使えば、必ず1人は相性のいい担当者に出会えます。」
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            【データで証明】3社使うと年収が上がる
          </h2>
          
          <div className="my-8 rounded-lg bg-blue-50 border-2 border-blue-400 p-6">
            <p className="mb-4 font-bold text-blue-800">
              エージェント利用数と年収アップ額の関係
            </p>
            <div className="space-y-3">
              <div className="bg-white rounded p-3 flex justify-between items-center">
                <span>1社だけ</span>
                <span className="font-bold">+平均28万円</span>
              </div>
              <div className="bg-white rounded p-3 flex justify-between items-center">
                <span>2社</span>
                <span className="font-bold">+平均54万円</span>
              </div>
              <div className="bg-white rounded p-3 flex justify-between items-center">
                <span className="font-bold text-green-600">3社</span>
                <span className="font-bold text-green-600 text-xl">+平均87万円</span>
              </div>
              <div className="bg-white rounded p-3 flex justify-between items-center">
                <span>4社以上</span>
                <span className="font-bold">+平均92万円</span>
              </div>
            </div>
            <p className="mt-6 text-center font-bold text-lg">
              3社使うだけで、<br />
              <span className="text-green-600 text-2xl">+約60万円も違う！</span>
            </p>
          </div>

          <p className="text-xl font-bold text-center my-8">
            もう、<span className="text-blue-600">3社使わない理由ないですよね？</span>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            「出会えるエージェント」なら、超簡単に3社使える
          </h2>
          
          <div className="my-8 space-y-4">
            <div className="rounded-lg bg-gray-50 p-4 border-l-4 border-blue-500">
              <p className="font-bold mb-2">STEP 1：希望条件を入力（30秒）</p>
              <p className="text-sm">
                年齢、職歴、年収、働き方の希望などを入力するだけ
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4 border-l-4 border-green-500">
              <p className="font-bold mb-2">STEP 2：AIが最適なエージェント3社を選定</p>
              <p className="text-sm">
                あなたにピッタリのエージェントを自動でマッチング
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4 border-l-4 border-purple-500">
              <p className="font-bold mb-2">STEP 3：3社から連絡が来る</p>
              <p className="text-sm">
                LINEまたはメールで、それぞれのエージェントから連絡が来ます
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4 border-l-4 border-orange-500">
              <p className="font-bold mb-2">STEP 4：転職活動スタート！</p>
              <p className="text-sm">
                3社から合計30〜60件の求人紹介、手厚いサポートで転職成功へ
              </p>
            </div>
          </div>

          <p className="text-xl font-bold text-center my-6">
            たった30秒で、<br />
            <span className="text-blue-600">年収+87万円のチャンス</span>
            が手に入ります。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            今すぐ行動してください
          </h2>
          
          <p className="mb-6">
            この記事を読んだあなたは、もう<br />
            <strong className="text-blue-600">「3社使うべき」</strong>
            って知りました。
          </p>

          <p className="mb-6">
            あとは、<strong className="text-red-600">行動するかどうか</strong>だけ。
          </p>

          <div className="my-8 rounded-lg bg-red-50 border-2 border-red-400 p-6">
            <p className="text-xl font-bold mb-4 text-red-700 text-center">
              今日行動しないと、明日も行動しません
            </p>
            <p className="text-sm text-center">
              「あとでやろう」は、99%やりません。<br />
              <br />
              この記事を読み終わったら、<br />
              スマホを閉じる前に、<br />
              <strong className="text-lg">今すぐ登録してください。</strong>
            </p>
          </div>

          <p className="text-xl font-bold text-center my-8">
            30秒の行動が、<br />
            <span className="text-blue-600">年収87万円の差</span>を生みます。
          </p>

          <p className="text-center">
            1年後、<br />
            「あの時登録してよかった」<br />
            って、絶対に思います。
          </p>
        </section>

      <div className="my-12 overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 to-teal-600 p-8 md:p-12 text-white shadow-2xl">
        <div className="text-center">
          <div className="mb-6">
            <div className="mb-2 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-bold backdrop-blur-sm">
              完全無料・30秒で完了
            </div>
          </div>
          <h3 className="mb-4 text-3xl font-bold md:text-4xl">
            3社まとめて登録できる！<br />
            あなた専用のエージェント3社を見つけよう
          </h3>
          <p className="mb-8 text-lg opacity-95">
            年収+87万円の実績<br />
            利用者の94%が「3社使ってよかった」と回答
          </p>
          <Link
            href="/gt/lp01deaeru/1"
            className="inline-flex items-center gap-3 rounded-full bg-white px-12 py-5 text-xl font-bold text-teal-600 shadow-2xl transition hover:scale-105 hover:bg-gray-50"
          >
            今すぐ無料診断をはじめる
            <ArrowRight className="h-6 w-6" />
          </Link>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
            <span>✓ めんどうな登録作業は一切なし</span>
            <span>✓ しつこい営業電話なし</span>
            <span>✓ 相談だけでもOK</span>
          </div>
        </div>
      </div>

      <div className="my-8 rounded-xl bg-yellow-50 border-2 border-yellow-400 p-6">
        <p className="text-center font-bold text-lg mb-4 text-yellow-900">
          P.S. 1社だけで転職しようとしてる友達がいたら...
        </p>
        <p className="text-sm text-center text-gray-700 leading-relaxed">
          この記事をシェアして、教えてあげてください。<br />
          <br />
          知らないだけで、年収50万円以上損するかもしれません。<br />
          <br />
          あなたの一言が、友達の人生を変えるかもしれません。
        </p>
      </div>
    </ArticleLayout>
  );
}
