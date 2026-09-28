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
import { ArrowRight, TrendingUp, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "【知らなきゃ損】20代で年収100万UPさせる人がやってること｜出会えるエージェント",
  description: "同じ20代なのに、年収に差がつく理由。年収を上げてる人は、みんな「あること」をやっています。知らないと一生損する転職の裏技。",
  keywords: "20代,年収アップ,転職,秘訣,裏技,エージェント",
  openGraph: {
    title: "【知らなきゃ損】20代で年収100万UPさせる人がやってること",
    description: "同じ20代なのに、年収に差がつく理由を暴露します。",
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
      title: "友達と年収150万円差がついた理由",
      slug: "20dai-tomodachi-nensyuu-hikaku",
      category: "年収比較",
    },
    {
      title: "年収300万円台から脱出する方法",
      slug: "20dai-nensyuu-300man-dasshutu",
      category: "年収アップ",
    },
    {
      title: "転職エージェントは3社使わないと損",
      slug: "20dai-3sha-tsukaou",
      category: "エージェント活用",
    },
  ];

  return (
    <ArticleLayout
      title="20代で年収100万UPさせる人がやってること"
      category="年収アップの秘訣"
      readTime={6}
      publishedDate="2026年1月29日"
      relatedArticles={relatedArticles}
    >
      <header className="mb-12">
        <h1 className="mb-6 text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
          【衝撃】同じ20代なのに<br />
          年収に100万円以上差がつく理由
        </h1>
        <p className="text-lg leading-relaxed text-gray-600">
          年収上げてる人は、みんな「あること」をやってました。<br />
          知らないと、マジで一生損します。
        </p>
      </header>

      {/* アイキャッチ */}
      <div className="my-10 overflow-hidden rounded-2xl bg-gradient-to-br from-red-100 via-orange-50 to-yellow-100 p-8 md:p-12">
        <div className="text-center">
          <div className="mb-6">
            <AlertTriangle className="mx-auto h-20 w-20 text-red-600" />
          </div>
          <p className="mb-4 text-2xl font-bold text-gray-800 md:text-3xl">
            年収に<span className="text-red-600">180万円</span>の差！
          </p>
          <p className="text-gray-700">
            同じ年齢、同じ新卒なのに...なぜ？
          </p>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">
          大学の同期と久々に会ったら、年収が全然違った話
        </h2>
        
        <p className="mb-6 leading-relaxed text-gray-700">
          先月、大学の同期4人で久しぶりに飲み会したんです。
        </p>

        <p className="mb-6 leading-relaxed text-gray-700">
          みんな25〜26歳で、新卒で入った会社で3年くらい働いてる。<br />
          なのに...
        </p>

        <div className="my-8 overflow-hidden rounded-2xl border-2 border-red-300 bg-gradient-to-br from-red-50 to-orange-50 p-6 shadow-lg">
          <p className="mb-6 text-center text-2xl font-bold text-gray-800">
            年収の差がヤバい
          </p>
          <div className="space-y-3">
            {[
              { name: "Aちゃん（転職なし）", salary: "270万円", color: "gray" },
              { name: "私（転職なし）", salary: "290万円", color: "gray" },
              { name: "Bくん（1回転職）", salary: "420万円", color: "blue" },
              { name: "Cちゃん（1回転職）", salary: "450万円", color: "blue" },
            ].map((person, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
                <span className="font-semibold text-gray-800">{person.name}</span>
                <span className={`text-2xl font-bold ${person.color === "blue" ? "text-blue-600" : "text-gray-600"}`}>
                  {person.salary}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-lg bg-red-100 p-4">
            <p className="text-center text-xl font-bold text-red-700">
              最大<span className="text-3xl">180万円</span>の差...
            </p>
          </div>
        </div>

        <p className="mt-8 text-xl font-bold leading-relaxed text-gray-900">
          え、何これ。<br />
          同じ年齢なのに、年収180万円も違うの？？
        </p>

        <p className="mt-6 leading-relaxed text-gray-700">
          しかも、BくんもCちゃんも、<br />
          <strong className="font-bold text-red-600">特別なスキルがあるわけでも、
          資格を持ってるわけでもない。</strong>
        </p>

        <div className="my-8 rounded-2xl bg-blue-600 p-8 text-center text-white shadow-xl">
          <p className="mb-2 text-lg">違いは、</p>
          <p className="text-4xl font-bold md:text-5xl">「転職したかどうか」</p>
          <p className="mt-2 text-lg">だけ。</p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">
          【真実】20代で年収上げたいなら、転職しかない
        </h2>
        
        <p className="mb-6 leading-relaxed text-gray-700">
          正直に言います。<br />
          <strong className="font-bold text-red-600 text-xl">
            今の会社で働き続けても、年収はほぼ上がりません。
          </strong>
        </p>

        <InsightCard type="warning">
          <div>
            <p className="mb-4 font-bold text-lg">日本の会社の昇給の現実</p>
            <div className="space-y-2 text-sm">
              <p>📉 年1回の昇給：平均5,000円〜8,000円/月</p>
              <p>📉 年間で6万円〜10万円アップ程度</p>
              <p>📉 3年働いても、20〜30万円しか上がらない</p>
              <p>📉 役職につかないと大幅アップはほぼ不可能</p>
            </div>
          </div>
        </InsightCard>

        <div className="my-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-gray-100 p-6 text-center shadow-sm">
            <p className="mb-4 text-sm font-semibold text-gray-600">今の会社で3年我慢</p>
            <p className="mb-2 text-4xl font-bold text-gray-800">+30万円</p>
            <p className="text-sm text-gray-600">290万円 → 320万円</p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-center shadow-lg">
            <p className="mb-4 text-sm font-semibold text-white">転職する</p>
            <p className="mb-2 text-4xl font-bold text-white">+100万円</p>
            <p className="text-sm text-white">290万円 → 390万円</p>
          </div>
        </div>

        <p className="my-8 text-center text-2xl font-bold text-gray-900">
          3年で+30万円 vs 一瞬で+100万円<br />
          <span className="text-green-600">どっち選びますか？</span>
        </p>
      </section>

      <InlineCTA text="年収100万円UPのチャンス、今すぐ掴もう" />

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">
          年収アップ成功者の実例
        </h2>
        
        <div className="space-y-6">
          <TestimonialCard
            name="Dさん"
            age={24}
            beforeSalary="270万円"
            afterSalary="400万円（+130万円）"
            story="事務職→Webマーケティング職に転職。未経験だったけど、エージェントが「ポテンシャル採用してる企業」を紹介してくれて、しかも年収交渉で+30万円上乗せしてくれた。「知らなかったら、年収300万円台のまま働いてたと思う...」"
          />
          
          <TestimonialCard
            name="Eくん"
            age={26}
            beforeSalary="350万円"
            afterSalary="480万円（+130万円）"
            story="営業職→SaaS企業の営業職に転職。3社のエージェントから合計40件の求人を紹介してもらい、その中から本当に条件のいい会社を選べた。「1社だけだと、こんなにいい求人には出会えなかった」"
          />
          
          <TestimonialCard
            name="Fさん"
            age={25}
            beforeSalary="280万円"
            afterSalary="380万円（+100万円）"
            story="販売職→IT企業の事務職に転職。エージェントが「あなたの経験なら、もっと評価される会社がある」と言ってくれて、自分では思いもしなかった高年収の企業を紹介してくれた。「自分の市場価値、全然わかってなかった...」"
          />
        </div>

        <p className="mt-8 text-center text-xl font-bold text-gray-900">
          みんな、<span className="text-green-600">「出会えるエージェント」</span>
          使ってなかったら、<br />
          <span className="text-red-600">年収100万円以上損してた</span>ってことです。
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">
          【警告】今すぐ動かないと、本当に損します
        </h2>
        
        <p className="mb-6 leading-relaxed text-gray-700">
          ここまで読んで、<br />
          「へー、そうなんだ」で終わらせないでください。
        </p>

        <p className="mb-6 text-xl font-bold text-gray-900">
          <span className="text-red-600">今すぐ行動しないと、マジで損します。</span>
        </p>

        <div className="my-8 overflow-hidden rounded-2xl border-2 border-red-400 bg-red-50 p-8 shadow-lg">
          <p className="mb-6 text-center text-xl font-bold text-red-800">
            行動しなかった場合の損失額
          </p>
          <div className="space-y-4">
            {[
              { period: "1年後", current: "300万円", potential: "400万円", loss: "-100万円" },
              { period: "3年後", current: "330万円", potential: "430万円", loss: "-300万円" },
              { period: "5年後", current: "360万円", potential: "460万円", loss: "-500万円" },
            ].map((item, index) => (
              <div key={index} className="rounded-xl bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-800">{item.period}：</span>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {item.current} → 本当は{item.potential}
                    </p>
                    <p className="text-lg font-bold text-red-600">{item.loss}の損</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-6 rounded-xl bg-red-100 p-6 border-2 border-red-400">
              <p className="text-center text-sm text-gray-700">合計損失額</p>
              <p className="text-center text-5xl font-bold text-red-700">-900万円</p>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-lg leading-relaxed text-gray-700">
          たった30秒の登録をサボるだけで、<br />
          <span className="text-2xl font-bold text-red-600">900万円損する</span>
          可能性があるんです。
        </p>

        <p className="mt-6 text-center text-2xl font-bold text-gray-900">
          それでも、行動しませんか？
        </p>
      </section>

      <InlineCTA text="900万円損したくないなら、今すぐクリック" />

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">
          年収アップに成功してる人は、みんな「出会えるエージェント」使ってた
        </h2>
        
        <p className="mb-6 leading-relaxed text-gray-700">
          実は、Cちゃんに<br />
          「どうやって年収450万円の会社見つけたの？」って聞いたら...
        </p>

        <QuoteBlock author="Cちゃん（26歳）">
          <p className="mb-3">
            「『出会えるエージェント』っていうサービス使ったよ！
          </p>
          <p className="mb-3">
            自分に合うエージェント3社紹介してくれて、
            そのうちの1社が年収交渉めっちゃ頑張ってくれて、
            最初の提示より50万円アップしてくれたの😭」
          </p>
        </QuoteBlock>

        <p className="mb-6 leading-relaxed text-gray-700">
          え、50万円も？？<br />
          しかも、自分で何もしてないのに？？
        </p>

        <p className="mb-6 text-xl font-bold text-gray-900">
          これ聞いて、<br />
          <span className="text-red-600">「知らないって、マジで損だな」</span>
          って思いました。
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">
          「出会えるエージェント」が年収アップに強い3つの理由
        </h2>
        
        <div className="space-y-6">
          <div className="rounded-xl border-2 border-yellow-300 bg-yellow-50 p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-yellow-500 text-white font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-bold text-yellow-900">
                年収交渉に強いエージェントを紹介してくれる
              </h3>
            </div>
            <p className="mb-4 ml-15 leading-relaxed text-gray-700">
              全てのエージェントが年収交渉得意なわけじゃない。<br />
              <strong className="font-bold">「とりあえず決まればいい」って考えのエージェントも多い。</strong>
            </p>
            <div className="ml-15 rounded-lg bg-white p-4 border border-yellow-200">
              <p className="mb-2 text-sm font-bold text-yellow-900">「出会えるエージェント」の場合：</p>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>✓ 希望条件に「年収アップ重視」を入力</li>
                <li>✓ 年収交渉に定評のあるエージェントを優先的に紹介</li>
                <li>✓ 実際に+10〜50万円上乗せしてくれる</li>
              </ul>
            </div>
          </div>

          <div className="rounded-xl border-2 border-purple-300 bg-purple-50 p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-purple-500 text-white font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-bold text-purple-900">
                複数内定で交渉力が上がる
              </h3>
            </div>
            <p className="mb-4 ml-15 leading-relaxed text-gray-700">
              3社のエージェント使えば、内定の数も増える。<br />
              <strong className="font-bold">複数内定があると、年収交渉しやすくなる。</strong>
            </p>
            <div className="ml-15 rounded-lg bg-white p-4 border border-purple-200">
              <p className="mb-3 text-sm font-bold text-purple-900">交渉の流れ：</p>
              <ol className="space-y-2 text-sm text-gray-700 list-decimal pl-4">
                <li>A社から内定：年収380万円</li>
                <li>B社からも内定：年収400万円</li>
                <li>エージェント「A社さん、B社は400万円出してるので、同じくらいに上げてもらえませんか？」</li>
                <li>A社「わかりました、410万円で」</li>
                <li className="font-bold text-green-700">結果：+30万円アップ！</li>
              </ol>
            </div>
          </div>

          <div className="rounded-xl border-2 border-green-300 bg-green-50 p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-500 text-white font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-bold text-green-900">
                高年収求人にアクセスできる
              </h3>
            </div>
            <p className="mb-4 ml-15 leading-relaxed text-gray-700">
              普通の転職サイトには載ってない、
              <strong className="font-bold text-green-700">非公開の高年収求人</strong>がエージェントにはある。
            </p>
            <div className="ml-15 rounded-lg bg-white p-4 border border-green-200">
              <p className="mb-2 text-sm font-bold text-green-900">非公開求人の例：</p>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>💰 年収400万円〜のITベンチャー（非公開）</li>
                <li>💰 年収450万円〜の成長企業の営業職（非公開）</li>
                <li>💰 年収500万円〜の外資系企業（非公開）</li>
              </ul>
              <p className="mt-3 text-xs text-gray-600">
                ※これらの求人は、転職サイトには絶対に載りません
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">
          最後に：あなたへのメッセージ
        </h2>
        
        <p className="mb-6 leading-relaxed text-gray-700">
          私は、1年間先延ばしにして、
          <strong className="font-bold text-red-600">110万円損しました。</strong>
        </p>

        <p className="mb-6 leading-relaxed text-gray-700">
          「あの時、すぐ行動してれば...」<br />
          って、マジで後悔してます。
        </p>

        <p className="mb-6 text-xl font-bold text-gray-900">
          でも、あなたには<br />
          <span className="text-green-600">同じ後悔をしてほしくない。</span>
        </p>

        <div className="my-8 overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-100 to-orange-100 p-8 border-2 border-yellow-400 shadow-lg">
          <div className="text-center">
            <p className="mb-4 text-xl font-bold text-gray-800">
              この記事を読んだ<strong className="text-2xl text-green-600">今この瞬間</strong>が、
            </p>
            <p className="mb-6 text-3xl font-bold text-red-600">
              人生の分岐点です。
            </p>
            <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
              <p className="mb-3 text-lg font-bold text-gray-800">30秒の行動が、</p>
              <p className="text-4xl font-bold text-green-600">年収100万円UP</p>
              <p className="mt-2 text-gray-700">のチャンスを生みます。</p>
            </div>
            <Link
              href="/gt/lp01deaeru/1"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-10 py-4 text-lg font-bold text-white shadow-xl transition hover:scale-105"
            >
              今すぐ無料診断をはじめる
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
