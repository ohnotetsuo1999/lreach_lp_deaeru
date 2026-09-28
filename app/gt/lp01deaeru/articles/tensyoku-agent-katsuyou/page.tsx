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
import { ArrowRight, Users, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "転職エージェント活用術｜賢い使い方と選び方｜出会えるエージェント",
  description: "転職エージェントを最大限に活用する方法。メリット・デメリット、選び方、複数利用のコツ、エージェントとの付き合い方まで徹底解説します。",
  keywords: "転職エージェント,活用,使い方,選び方,メリット,デメリット",
  openGraph: {
    title: "転職エージェント活用術｜賢い使い方と選び方",
    description: "転職エージェントを最大限に活用する方法を徹底解説します。",
    type: "article",
  },
};

export default function Article() {
  const relatedArticles = [
    {
      title: "転職エージェントは3社使わないと損",
      slug: "20dai-3sha-tsukaou",
      category: "エージェント活用",
    },
    {
      title: "転職エージェント選びで人生変わる話",
      slug: "20dai-agent-erabikata",
      category: "エージェント選び",
    },
    {
      title: "エージェント違いで年収50万円差",
      slug: "20dai-agent-matching-hitsuyou",
      category: "エージェント選び",
    },
  ];

  return (
    <ArticleLayout
      title="転職エージェントを最大活用する方法"
      category="エージェント活用"
      readTime={7}
      publishedDate="2026年1月29日"
      relatedArticles={relatedArticles}
    >
      <header className="mb-12">
        <h1 className="mb-4 text-4xl font-bold leading-tight">
          転職エージェント活用術
        </h1>
        <p className="text-lg text-gray-600">
          エージェントを味方につける。転職成功率を最大化する賢い使い方。
        </p>
      </header>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            転職エージェントとは？
          </h2>
          <p>
            転職エージェント（人材紹介サービス）は、
            企業と求職者をマッチングし、転職活動を無料でサポートしてくれるサービスです。
            キャリアアドバイザーが、求人紹介から内定後のフォローまで、
            転職活動全般をサポートしてくれます。
          </p>
          <div className="my-6 rounded-lg bg-blue-50 p-6">
            <h3 className="mb-3 font-bold">エージェントが提供するサービス</h3>
            <ul className="list-disc pl-6">
              <li>キャリアカウンセリング・相談</li>
              <li>非公開求人を含む求人紹介</li>
              <li>職務経歴書・履歴書の添削</li>
              <li>面接対策・模擬面接</li>
              <li>企業との日程調整</li>
              <li>年収・条件交渉の代行</li>
              <li>内定後のフォロー・入社手続きサポート</li>
            </ul>
          </div>
          <p className="mt-4">
            <strong>なぜ無料？</strong><br />
            転職エージェントは、企業から成功報酬を受け取るビジネスモデルです。
            求職者が内定・入社すると、企業から年収の30〜35%程度の手数料が支払われます。
            そのため、求職者は完全無料でサービスを利用できます。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            転職エージェントを使うメリット・デメリット
          </h2>
          
          <h3 className="mb-3 mt-6 text-2xl font-bold">
            メリット
          </h3>
          <div className="my-6 space-y-3">
            <div className="rounded-lg border-l-4 border-green-500 bg-green-50 p-4">
              <h4 className="font-bold">1. 非公開求人にアクセスできる</h4>
              <p className="mt-1 text-sm">
                一般には公開されていない好条件の求人（全体の70〜80%）に応募できます。
                特に、管理職候補や専門職の求人は非公開が多い傾向にあります。
              </p>
            </div>

            <div className="rounded-lg border-l-4 border-green-500 bg-green-50 p-4">
              <h4 className="font-bold">2. プロのサポートが受けられる</h4>
              <p className="mt-1 text-sm">
                書類添削、面接対策、企業情報の提供など、
                転職のプロが全面的にサポートしてくれます。
              </p>
            </div>

            <div className="rounded-lg border-l-4 border-green-500 bg-green-50 p-4">
              <h4 className="font-bold">3. 年収交渉を代行してくれる</h4>
              <p className="mt-1 text-sm">
                自分では言いにくい年収の話も、エージェントが代わりに交渉。
                市場相場を踏まえた適切な交渉により、年収アップの可能性が高まります。
              </p>
            </div>

            <div className="rounded-lg border-l-4 border-green-500 bg-green-50 p-4">
              <h4 className="font-bold">4. 企業の内部情報がわかる</h4>
              <p className="mt-1 text-sm">
                社風、チームの雰囲気、働き方の実態など、
                求人票だけではわからない情報を教えてもらえます。
              </p>
            </div>

            <div className="rounded-lg border-l-4 border-green-500 bg-green-50 p-4">
              <h4 className="font-bold">5. 日程調整を任せられる</h4>
              <p className="mt-1 text-sm">
                複数企業との面接日程調整を代行してくれるため、
                在職中でも効率的に転職活動が進められます。
              </p>
            </div>
          </div>

          <h3 className="mb-3 mt-6 text-2xl font-bold">
            デメリット
          </h3>
          <div className="my-6 space-y-3">
            <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
              <h4 className="font-bold">1. 担当者の質にバラつきがある</h4>
              <p className="mt-1 text-sm">
                キャリアアドバイザーの経験やスキルには差があり、
                担当者によってサポートの質が変わることがあります。
              </p>
            </div>

            <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
              <h4 className="font-bold">2. 希望と違う求人を紹介されることも</h4>
              <p className="mt-1 text-sm">
                エージェントの都合（決まりやすい求人など）で、
                希望とは異なる求人を勧められる場合があります。
              </p>
            </div>

            <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
              <h4 className="font-bold">3. 連絡が頻繁で負担になることも</h4>
              <p className="mt-1 text-sm">
                担当者からの連絡が多すぎて、
                仕事に支障が出る場合もあります。
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            転職エージェントの選び方
          </h2>
          
          <h3 className="mb-3 mt-6 text-2xl font-bold">
            1. 総合型 vs 特化型を使い分ける
          </h3>
          <div className="my-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-blue-50 p-6">
              <h4 className="mb-3 text-xl font-bold">総合型エージェント</h4>
              <p className="mb-3 text-sm">
                <strong>特徴：</strong>
                幅広い業界・職種の求人を扱う
              </p>
              <p className="mb-3 text-sm">
                <strong>メリット：</strong>
                求人数が多い、大手企業の求人が豊富
              </p>
              <p className="text-sm">
                <strong>おすすめの人：</strong>
                まだ業界・職種が定まっていない、
                幅広く求人を見たい
              </p>
            </div>

            <div className="rounded-lg bg-green-50 p-6">
              <h4 className="mb-3 text-xl font-bold">特化型エージェント</h4>
              <p className="mb-3 text-sm">
                <strong>特徴：</strong>
                特定の業界・職種に特化
              </p>
              <p className="mb-3 text-sm">
                <strong>メリット：</strong>
                専門知識が深い、企業との強いパイプ
              </p>
              <p className="text-sm">
                <strong>おすすめの人：</strong>
                希望業界・職種が明確、
                専門的なアドバイスが欲しい
              </p>
            </div>
          </div>

          <h3 className="mb-3 mt-6 text-2xl font-bold">
            2. 年代・キャリアステージで選ぶ
          </h3>
          <ul className="my-4 list-disc pl-6">
            <li><strong>20代・第二新卒：</strong>未経験OK求人が豊富なエージェント</li>
            <li><strong>30代・ミドル層：</strong>キャリアアップ支援に強いエージェント</li>
            <li><strong>40代以上：</strong>ハイクラス・エグゼクティブ向けエージェント</li>
          </ul>

          <h3 className="mb-3 mt-6 text-2xl font-bold">
            3. 目的で選ぶ
          </h3>
          <ul className="my-4 list-disc pl-6">
            <li><strong>年収アップ重視：</strong>年収交渉に強いエージェント</li>
            <li><strong>IT・エンジニア：</strong>IT特化型エージェント</li>
            <li><strong>ベンチャー志望：</strong>ベンチャー・スタートアップ特化型</li>
            <li><strong>外資系志望：</strong>外資系・グローバル企業特化型</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            エージェントを最大限活用する7つのコツ
          </h2>
          
          <div className="my-6 space-y-6">
            <div className="rounded-lg border-2 border-blue-200 p-6">
              <h3 className="mb-3 text-xl font-bold text-blue-600">
                コツ1: 複数のエージェントに登録する
              </h3>
              <p>
                2〜3社のエージェントを併用することで、
                より多くの求人にアクセスでき、担当者の比較もできます。
                ただし、同じ求人に複数経由で応募するのはNGです。
              </p>
            </div>

            <div className="rounded-lg border-2 border-green-200 p-6">
              <h3 className="mb-3 text-xl font-bold text-green-600">
                コツ2: 初回面談で本音を伝える
              </h3>
              <p>
                希望条件、転職理由、不安なことなど、
                正直に伝えることで、より適切なサポートが受けられます。
                「年収重視」「ワークライフバランス重視」など、
                優先順位も明確に伝えましょう。
              </p>
            </div>

            <div className="rounded-lg border-2 border-purple-200 p-6">
              <h3 className="mb-3 text-xl font-bold text-purple-600">
                コツ3: レスポンスは早く、丁寧に
              </h3>
              <p>
                エージェントからの連絡には迅速に返信しましょう。
                「本気度が高い」と判断され、優先的に良い求人を紹介してもらえます。
                最低でも24時間以内の返信を心がけましょう。
              </p>
            </div>

            <div className="rounded-lg border-2 border-orange-200 p-6">
              <h3 className="mb-3 text-xl font-bold text-orange-600">
                コツ4: 合わない担当者は変更を依頼
              </h3>
              <p>
                担当者との相性が悪いと感じたら、遠慮なく変更を依頼しましょう。
                「もう少し○○業界に詳しい方に担当していただきたい」など、
                具体的な理由を伝えるとスムーズです。
              </p>
            </div>

            <div className="rounded-lg border-2 border-red-200 p-6">
              <h3 className="mb-3 text-xl font-bold text-red-600">
                コツ5: 推薦文は必ず確認する
              </h3>
              <p>
                エージェントが企業に送る推薦文は、
                「確認させてください」と依頼しましょう。
                自分のアピールポイントが正しく伝わっているか確認できます。
              </p>
            </div>

            <div className="rounded-lg border-2 border-indigo-200 p-6">
              <h3 className="mb-3 text-xl font-bold text-indigo-600">
                コツ6: 面接後のフィードバックを活用
              </h3>
              <p>
                面接後、企業からのフィードバックを必ず聞きましょう。
                「どこが評価されたか」「どこが課題だったか」を知ることで、
                次の面接に活かせます。
              </p>
            </div>

            <div className="rounded-lg border-2 border-pink-200 p-6">
              <h3 className="mb-3 text-xl font-bold text-pink-600">
                コツ7: 嘘をつかない
              </h3>
              <p>
                経歴やスキルを盛って伝えるのは絶対NG。
                バレた時点で信頼を失い、サポートが受けられなくなります。
                また、企業にも伝わり、内定取り消しのリスクもあります。
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            エージェントとの付き合い方で避けるべきNG行動
          </h2>
          
          <div className="my-6 space-y-4">
            <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
              <h4 className="font-bold text-red-600">
                ❌ NG1: 連絡を無視する
              </h4>
              <p className="mt-2 text-sm">
                連絡を無視し続けると、「転職意欲が低い」と判断され、
                優先度を下げられてしまいます。
                忙しい場合も、一言返信するようにしましょう。
              </p>
            </div>

            <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
              <h4 className="font-bold text-red-600">
                ❌ NG2: 複数エージェント経由で同じ企業に応募
              </h4>
              <p className="mt-2 text-sm">
                同じ企業に複数のエージェント経由で応募すると、
                企業・エージェント双方からの信頼を失います。
                応募企業は必ず管理しましょう。
              </p>
            </div>

            <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
              <h4 className="font-bold text-red-600">
                ❌ NG3: 高圧的な態度を取る
              </h4>
              <p className="mt-2 text-sm">
                「無料だから」と横柄な態度を取るのはNG。
                エージェントも人間です。丁寧なコミュニケーションを心がけましょう。
              </p>
            </div>

            <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
              <h4 className="font-bold text-red-600">
                ❌ NG4: 内定後にバックれる
              </h4>
              <p className="mt-2 text-sm">
                内定を承諾した後に、無断で辞退するのは絶対NG。
                エージェント・企業双方に大きな迷惑をかけます。
                今後、そのエージェントは使えなくなります。
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            エージェント活用のよくある質問
          </h2>
          
          <div className="my-6 space-y-4">
            <div className="rounded-lg bg-gray-50 p-6">
              <h4 className="mb-2 font-bold">Q. 何社のエージェントに登録すべき？</h4>
              <p className="text-sm">
                A. 2〜3社がおすすめです。1社だと比較ができず、
                4社以上だと管理が大変になります。
                「総合型1社 + 特化型1〜2社」が理想的です。
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-6">
              <h4 className="mb-2 font-bold">Q. 転職サイトとエージェント、どちらがいい？</h4>
              <p className="text-sm">
                A. 両方併用するのがベストです。
                転職サイトで広く情報収集しつつ、
                エージェントでサポートを受けることで、効率的に転職活動ができます。
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-6">
              <h4 className="mb-2 font-bold">Q. 今すぐ転職する気がなくても登録していい？</h4>
              <p className="text-sm">
                A. 問題ありません。「情報収集のため」「市場価値を知りたい」という理由での登録も歓迎されます。
                ただし、その旨を正直に伝えましょう。
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-6">
              <h4 className="mb-2 font-bold">Q. 登録したら必ず転職しないといけない？</h4>
              <p className="text-sm">
                A. いいえ。登録しても、転職する義務はありません。
                良い求人がなければ、転職しないという選択も自由です。
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">まとめ</h2>
          <p>
            転職エージェントは、転職活動を成功に導く強力な味方です。
            非公開求人へのアクセス、プロのサポート、年収交渉の代行など、
            無料とは思えないほど充実したサービスが受けられます。
          </p>
          <p className="mt-4">
            重要なのは、エージェントを「使う」のではなく、
            「協力して転職を成功させるパートナー」として付き合うこと。
            正直なコミュニケーション、迅速なレスポンス、丁寧な対応を心がければ、
            エージェントもあなたのために全力でサポートしてくれます。
          </p>
          <p className="mt-4">
            また、複数のエージェントを比較することで、
            自分に最適なエージェント・担当者に出会える確率が高まります。
            まずは2〜3社に登録して、転職活動をスタートしましょう。
          </p>
        </section>

      <div className="my-12 overflow-hidden rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 p-8 md:p-12 text-white shadow-2xl">
        <div className="text-center">
          <div className="mb-6">
            <div className="mb-2 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-bold backdrop-blur-sm">
              完全無料・30秒で完了
            </div>
          </div>
          <h3 className="mb-4 text-3xl font-bold md:text-4xl">
            あなたに最適なエージェントを見つけよう
          </h3>
          <p className="mb-8 text-lg opacity-95">
            業界、職種、年代、キャリアステージに合った<br />
            最適な転職エージェントを無料診断で発見
          </p>
          <Link
            href="/gt/lp01deaeru/1"
            className="inline-flex items-center gap-3 rounded-full bg-white px-12 py-5 text-xl font-bold text-purple-600 shadow-2xl transition hover:scale-105 hover:bg-gray-50"
          >
            無料診断をはじめる
            <ArrowRight className="h-6 w-6" />
          </Link>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
            <span>✓ 複数エージェント比較可能</span>
            <span>✓ 最短2ヶ月で転職成功</span>
          </div>
        </div>
      </div>
    </ArticleLayout>
  );
}
