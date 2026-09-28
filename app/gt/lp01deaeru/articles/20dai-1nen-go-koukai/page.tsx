import { type Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "../_components/ArticleLayout";
import {
  InsightCard,
  StatsBox,
  CheckList,
  InlineCTA,
  AlertBox,
  QuoteBlock,
} from "../_components/ArticleComponents";
import { ArrowRight, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "【後悔】1年前に転職してれば、今頃年収100万円高かった｜出会えるエージェント",
  description: "「あの時転職しておけば...」って後悔してる20代、めちゃくちゃ多いです。同じ後悔をしないために、今すぐ行動してください。",
  keywords: "20代,転職,後悔,タイミング,逃す,エージェント",
  openGraph: {
    title: "【後悔】1年前に転職してれば、今頃年収100万円高かった",
    description: "転職のタイミングを逃して後悔してる20代へ。同じ失敗をしないで。",
    type: "article",
  },
};

export default function Article() {
  const relatedArticles = [
    {
      title: "今すぐ転職しないとヤバい3つの理由",
      slug: "20dai-ima-ugoku-riyuu",
      category: "転職タイミング",
    },
    {
      title: "転職に最適なタイミングの見極め方",
      slug: "tensyoku-timing",
      category: "転職タイミング",
    },
    {
      title: "20代で年収100万UPさせる人がやってること",
      slug: "20dai-nensyuu-up-himitsu",
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
      title="1年前に転職してれば...後悔の話"
      category="転職タイミング"
      readTime={5}
      publishedDate="2026年1月29日"
      relatedArticles={relatedArticles}
    >
      <header className="mb-12">
        <h1 className="mb-6 text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
          「1年前に転職してれば...」<br />
          後悔しかない
        </h1>
        <p className="text-lg leading-relaxed text-gray-600">
          先延ばしにした結果、年収100万円以上損した話。<br />
          あなたには、同じ後悔をしてほしくない。
        </p>
      </header>
        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            「転職したいな...」って1年前から思ってた
          </h2>
          
          <p className="mb-6">
            正直に言います。<br />
            私、<strong className="text-red-600">1年以上前から転職したかった</strong>んです。
          </p>

          <div className="my-6 rounded-lg bg-gray-100 p-6">
            <p className="mb-3 font-bold">1年前の私の気持ち：</p>
            <ul className="space-y-2 text-sm">
              <li>💭 給料安いし、転職したいな...</li>
              <li>💭 でも、転職活動って大変そう</li>
              <li>💭 今の仕事も忙しいし、時間ないな</li>
              <li>💭 まあ、来月からでいいか</li>
            </ul>
          </div>

          <p className="mb-6">
            そう思って、<br />
            <strong className="text-red-600">気づいたら1年経ってました。</strong>
          </p>

          <p className="mb-6">
            その間、ずっと年収290万円のまま。<br />
            給料は上がらず、仕事もつまらないまま。
          </p>

          <p className="text-2xl font-bold text-center my-8">
            <span className="text-red-600">1年間、無駄にしました。</span>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            1年前に転職してた友達は、今めっちゃ幸せそう
          </h2>
          
          <p className="mb-6">
            一方、1年前に転職した友達のPちゃん。<br />
            インスタ見たら、めっちゃ幸せそうなんです。
          </p>

          <div className="my-8 space-y-4">
            <div className="rounded-lg bg-blue-50 p-4">
              <p className="text-sm">
                📸 <strong>Pちゃんのインスタ投稿：</strong><br />
                「転職して1年経った🎉 毎日楽しすぎる！」<br />
                「年収も上がって、趣味にお金使えるようになった✨」<br />
                「リモートワークだから、ストレスフリー💻」
              </p>
            </div>
          </div>

          <p className="mb-6">
            羨ましすぎて、DMで聞いてみました。<br />
            「どうやって転職したの？」って。
          </p>

          <div className="my-6 rounded-lg bg-green-50 border-2 border-green-300 p-6">
            <p className="mb-2 font-bold text-green-800">Pちゃんの返信：</p>
            <p className="text-sm">
              「『出会えるエージェント』使ったよ！<br />
              3社のエージェントが全部サポートしてくれて、<br />
              2ヶ月で内定もらえた😊<br />
              <br />
              年収も<strong className="text-green-600">290万円→420万円</strong>
              になって、<br />
              めっちゃ生活楽になった！<br />
              <br />
              あなたも早く転職した方がいいよ！<br />
              1年遅れるだけで、<strong className="text-red-600">100万円以上損する</strong>
              から！」
            </p>
          </div>

          <p className="text-3xl font-bold text-center my-8">
            <span className="text-red-600">え、マジで...？</span>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            【計算してみた】1年先延ばしにしたことで損した金額
          </h2>
          
          <p className="mb-6">
            もし、私も1年前に転職してたら...
          </p>

          <div className="my-8 rounded-lg bg-red-50 border-2 border-red-400 p-6">
            <p className="mb-4 font-bold text-red-700 text-xl">
              損失額の計算
            </p>
            <div className="space-y-4">
              <div className="bg-white rounded p-4">
                <p className="text-sm mb-2">
                  <strong>実際の収入（1年前から今まで）：</strong>
                </p>
                <p className="text-2xl font-bold">290万円</p>
              </div>
              <div className="bg-white rounded p-4">
                <p className="text-sm mb-2">
                  <strong>転職してた場合の収入：</strong>
                </p>
                <p className="text-2xl font-bold text-green-600">400万円</p>
              </div>
              <div className="bg-red-100 rounded p-4 border-2 border-red-400">
                <p className="text-sm mb-2">
                  <strong>差額（損失）：</strong>
                </p>
                <p className="text-4xl font-bold text-red-700 text-center">
                  -110万円
                </p>
              </div>
            </div>
          </div>

          <p className="text-2xl font-bold text-center my-8">
            <span className="text-red-600">1年先延ばしにしただけで、110万円損した</span>
            ってことです...。
          </p>

          <p className="mb-6">
            マジで後悔しかない。
          </p>

          <p className="mb-6">
            「あの時、ちゃんと行動してれば...」<br />
            「Pちゃんみたいに、今頃年収400万円だったのに...」
          </p>

          <p className="text-xl font-bold mb-6">
            <span className="text-red-600">もう二度と、同じ失敗はしません。</span>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            「あとでやろう」は、一生やらない
          </h2>
          
          <p className="mb-6">
            これ、<strong className="text-red-600">マジで真実</strong>です。
          </p>

          <p className="mb-6">
            「来月から転職活動始めよう」<br />
            「ボーナスもらってから動こう」<br />
            「年明けから本気出す」
          </p>

          <p className="mb-6 text-xl font-bold">
            <span className="text-red-600">99%、やりません。</span>
          </p>

          <div className="my-8 rounded-lg bg-gray-100 p-6">
            <p className="mb-4 font-bold">先延ばしにする理由（言い訳）</p>
            <ul className="space-y-2 text-sm">
              <li>❌ 「今忙しいから」→ 来月も忙しい</li>
              <li>❌ 「もう少し考えたい」→ 結局考えない</li>
              <li>❌ 「準備ができてから」→ 準備は一生できない</li>
              <li>❌ 「タイミングを見て」→ タイミングは一生来ない</li>
            </ul>
          </div>

          <p className="mb-6 text-xl font-bold">
            だから、<br />
            <span className="text-blue-600">「今すぐ」やるしかないんです。</span>
          </p>

          <p className="mb-6">
            完璧なタイミングなんて、ありません。<br />
            準備が完璧になることも、ありません。
          </p>

          <p className="text-2xl font-bold mb-6">
            <span className="text-blue-600">今が、ベストタイミングです。</span>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            「出会えるエージェント」なら、今すぐ始められる
          </h2>
          
          <p className="mb-6">
            「転職したい」って思っても、<br />
            <strong>最初の一歩が踏み出せない</strong>
            人、多いですよね。
          </p>

          <p className="mb-6">
            わかります。<br />
            私もそうでした。
          </p>

          <p className="mb-6">
            でも、「出会えるエージェント」なら、<br />
            <strong className="text-blue-600">その一歩が、めちゃくちゃ簡単</strong>です。
          </p>

          <div className="my-8 rounded-lg bg-green-50 border-2 border-green-400 p-6">
            <p className="mb-4 font-bold text-green-800">
              最初の一歩が簡単な理由
            </p>
            <ul className="space-y-3 text-sm">
              <li>
                <strong>✅ 30秒で登録完了</strong><br />
                <span className="text-xs text-gray-600">
                  → スマホでポチポチするだけ。超簡単。
                </span>
              </li>
              <li>
                <strong>✅ 面倒な準備は不要</strong><br />
                <span className="text-xs text-gray-600">
                  → 職務経歴書も、エージェントと一緒に作れる
                </span>
              </li>
              <li>
                <strong>✅ いつでもやめられる</strong><br />
                <span className="text-xs text-gray-600">
                  → 「やっぱやめた」でもOK。リスクゼロ。
                </span>
              </li>
              <li>
                <strong>✅ 相談だけでもOK</strong><br />
                <span className="text-xs text-gray-600">
                  → 「情報収集だけ」でも全然大丈夫
                </span>
              </li>
            </ul>
          </div>

          <p className="text-xl font-bold text-center my-8">
            ハードル、めっちゃ低いですよね？
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            最後に：1年後のあなたへ
          </h2>
          
          <p className="mb-6">
            この記事を読んでるあなたに、<br />
            1つだけ質問させてください。
          </p>

          <p className="text-2xl font-bold text-center my-8">
            1年後、<br />
            <span className="text-blue-600">どんな自分でいたいですか？</span>
          </p>

          <div className="my-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-red-50 border-2 border-red-400 p-6">
              <p className="font-bold text-xl mb-4 text-red-700 text-center">
                行動しなかった場合
              </p>
              <ul className="space-y-2 text-sm">
                <li>❌ 年収290万円のまま</li>
                <li>❌ 「転職したいな...」って思いながら、また1年</li>
                <li>❌ 友達は年収500万円超え</li>
                <li>❌ 「また1年無駄にした...」って後悔</li>
                <li>❌ 30歳目前で焦り始める</li>
              </ul>
            </div>

            <div className="rounded-lg bg-green-50 border-2 border-green-400 p-6">
              <p className="font-bold text-xl mb-4 text-green-700 text-center">
                今すぐ行動した場合
              </p>
              <ul className="space-y-2 text-sm">
                <li>✅ 年収400万円で余裕のある生活</li>
                <li>✅ やりがいのある仕事で毎日充実</li>
                <li>✅ 「転職してよかった！」って思ってる</li>
                <li>✅ 友達に「年収いくら？」って堂々と答えられる</li>
                <li>✅ 30代に向けて、さらにキャリアアップ中</li>
              </ul>
            </div>
          </div>

          <p className="text-3xl font-bold text-center my-8">
            どっちの1年後がいいですか？
          </p>

          <p className="mb-6">
            答えは、もう出てますよね。
          </p>

          <p className="mb-6 text-xl font-bold">
            なら、<span className="text-blue-600">今すぐ行動してください。</span>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            私が伝えたいこと
          </h2>
          
          <p className="mb-6">
            私は、1年間先延ばしにして、<br />
            <strong className="text-red-600">110万円損しました。</strong>
          </p>

          <p className="mb-6">
            「あの時、すぐ行動してれば...」<br />
            って、マジで後悔してます。
          </p>

          <p className="mb-6">
            でも、あなたには<br />
            <strong className="text-blue-600">同じ後悔をしてほしくない。</strong>
          </p>

          <div className="my-8 rounded-lg bg-yellow-50 border-2 border-yellow-400 p-6">
            <p className="text-center mb-4">
              この記事を読んだ<strong className="text-xl">今この瞬間</strong>が、<br />
              <strong className="text-2xl text-blue-600">人生の分岐点</strong>です。
            </p>
            <p className="text-center text-sm mt-4">
              今クリックするか、<br />
              スマホを閉じて忘れるか。<br />
              <br />
              その選択で、<br />
              <strong className="text-lg">1年後の年収が100万円変わります。</strong>
            </p>
          </div>

          <p className="text-center text-2xl font-bold my-8">
            さあ、<span className="text-red-600">どうしますか？</span>
          </p>
        </section>
      <div className="my-12 overflow-hidden rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 p-8 md:p-12 text-white shadow-2xl">
        <div className="text-center">
          <div className="mb-6">
            <div className="mb-2 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-bold backdrop-blur-sm">
              完全無料・30秒で完了
            </div>
          </div>
          <h3 className="mb-4 text-3xl font-bold md:text-4xl">
            1年後に後悔したくない人へ
          </h3>
          <p className="mb-8 text-lg opacity-95">
            30秒の行動が、<br />
            1年後の年収を100万円変えます
          </p>
          <Link
            href="/gt/lp01deaeru/1"
            className="inline-flex items-center gap-3 rounded-full bg-white px-12 py-5 text-xl font-bold text-rose-600 shadow-2xl transition hover:scale-105 hover:bg-gray-50"
          >
            後悔したくないから、今すぐ登録
            <ArrowRight className="h-6 w-6" />
          </Link>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
            <span>✓ 登録したその日から人生が動き始めます</span>
            <span>✓ 完全無料・リスクゼロ</span>
          </div>
        </div>
      </div>

      <div className="my-8 rounded-xl bg-blue-50 border-2 border-blue-400 p-6">
        <p className="text-center font-bold text-xl mb-4 text-blue-900">
          P.S. 過去は変えられないけど、未来は変えられる
        </p>
        <p className="text-sm text-center text-gray-700 leading-relaxed">
          私は1年間、無駄にしました。<br />
          110万円、損しました。<br />
          <br />
          でも、過去は変えられません。<br />
          <br />
          変えられるのは、未来だけです。<br />
          <br />
          あなたは、今すぐ行動して、<br />
          1年後に「あの時行動してよかった」って言える未来を選んでください。<br />
          <br />
          今すぐ、クリックしてください。
        </p>
      </div>
    </ArticleLayout>
  );
}
