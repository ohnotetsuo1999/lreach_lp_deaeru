import { type Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "../_components/ArticleLayout";
import {
  InsightCard,
  CheckList,
  InlineCTA,
  AlertBox,
} from "../_components/ArticleComponents";
import { ArrowRight, Clock, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "転職のベストタイミングはいつ？見極める7つのサイン｜出会えるエージェント",
  description: "転職すべきか、待つべきか。最適な転職タイミングの見極め方、市場動向、年齢別のベストタイミングまで徹底解説します。",
  keywords: "転職,タイミング,時期,いつ,エージェント,キャリア",
  openGraph: {
    title: "転職のベストタイミングはいつ？見極める7つのサイン",
    description: "転職すべきか、待つべきか。最適な転職タイミングの見極め方を徹底解説します。",
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
      title: "20代が今すぐ動くべき3つの理由",
      slug: "20dai-ima-ugoku-riyuu",
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
      title="転職に最適なタイミングの見極め方"
      category="転職タイミング"
      readTime={6}
      publishedDate="2026年1月29日"
      relatedArticles={relatedArticles}
    >
      <header className="mb-12">
        <h1 className="mb-4 text-4xl font-bold leading-tight">
          転職のベストタイミングはいつ？
        </h1>
        <p className="text-lg text-gray-600">
          今すぐ動くべき？それとも待つべき？最適なタイミングを見極めよう。
        </p>
      </header>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            転職を考えるべき7つのサイン
          </h2>
          <p>
            「今すぐ転職すべきか、もう少し待つべきか」—これは多くの人が悩むポイントです。
            以下のサインに当てはまる場合、転職を真剣に検討すべきタイミングかもしれません。
          </p>
          
          <div className="my-6 space-y-4">
            <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-6">
              <h3 className="mb-2 text-xl font-bold">サイン1: 成長を感じられない</h3>
              <p>
                同じ業務の繰り返しで、スキルアップを実感できない。
                新しいことを学べる機会がない。このままでは市場価値が下がる不安を感じている。
              </p>
            </div>

            <div className="rounded-lg border-l-4 border-orange-500 bg-orange-50 p-6">
              <h3 className="mb-2 text-xl font-bold">サイン2: 評価・待遇に不満がある</h3>
              <p>
                頑張っても評価されない、給料が上がらない。
                同業他社と比較して明らかに待遇が悪い。
                市場価値と現在の年収に大きなギャップを感じている。
              </p>
            </div>

            <div className="rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-6">
              <h3 className="mb-2 text-xl font-bold">サイン3: 会社の将来性に不安</h3>
              <p>
                業績悪化、事業縮小、優秀な人材の流出など、
                会社の将来に明るい兆しが見えない。
                このまま居続けるリスクを感じている。
              </p>
            </div>

            <div className="rounded-lg border-l-4 border-green-500 bg-green-50 p-6">
              <h3 className="mb-2 text-xl font-bold">サイン4: やりたいことが見つかった</h3>
              <p>
                新しい分野への挑戦、キャリアチェンジなど、
                明確にやりたいことが見つかった。
                現職ではそれが実現できない。
              </p>
            </div>

            <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-6">
              <h3 className="mb-2 text-xl font-bold">サイン5: 健康・メンタルに影響が出ている</h3>
              <p>
                過度なストレス、長時間労働、ハラスメントなどで、
                心身の健康に悪影響が出ている。
                これは最優先で対処すべきサインです。
              </p>
            </div>

            <div className="rounded-lg border-l-4 border-indigo-500 bg-indigo-50 p-6">
              <h3 className="mb-2 text-xl font-bold">サイン6: ライフステージの変化</h3>
              <p>
                結婚、出産、親の介護など、ライフステージの変化により、
                働き方を見直す必要が出てきた。
                リモートワーク、時短勤務など、柔軟な働き方を求めている。
              </p>
            </div>

            <div className="rounded-lg border-l-4 border-purple-500 bg-purple-50 p-6">
              <h3 className="mb-2 text-xl font-bold">サイン7: 市場価値が高まっている</h3>
              <p>
                スカウトが増えた、エージェントから好条件の提案が来るなど、
                自分の市場価値が高まっていることを実感している。
                このタイミングを逃したくない。
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            年齢別：転職のベストタイミング
          </h2>
          
          <h3 className="mb-3 mt-6 text-2xl font-bold">
            20代：経験を積むタイミング
          </h3>
          <div className="my-4 rounded-lg bg-blue-50 p-6">
            <p className="mb-3"><strong>20代前半（22〜25歳）：</strong></p>
            <p className="mb-4 text-sm">
              第二新卒として、異業種・異職種へのチャレンジがしやすい時期。
              「今の仕事が合わない」と感じたら、早めの軌道修正を。
              ただし、最低1年は在籍してから動くのがベター。
            </p>
            <p className="mb-3"><strong>20代後半（26〜29歳）：</strong></p>
            <p className="text-sm">
              ある程度の経験とスキルが身についた段階。
              専門性を活かしたキャリアアップ転職か、
              最後のキャリアチェンジのチャンス。
              30代前の転職は、選択肢が最も広い。
            </p>
          </div>

          <h3 className="mb-3 mt-6 text-2xl font-bold">
            30代：キャリアの転換期
          </h3>
          <div className="my-4 rounded-lg bg-green-50 p-6">
            <p className="mb-3"><strong>30代前半（30〜34歳）：</strong></p>
            <p className="mb-4 text-sm">
              経験と若さのバランスが取れた、転職市場で最も有利な時期。
              管理職候補、専門職として、大きなキャリアアップが狙える。
              年収アップも期待できるゴールデンタイム。
            </p>
            <p className="mb-3"><strong>30代後半（35〜39歳）：</strong></p>
            <p className="text-sm">
              マネジメント経験や専門性が問われる時期。
              安易な転職は避け、じっくり企業を選ぶべき。
              次の会社では長く働く覚悟で臨みましょう。
            </p>
          </div>

          <h3 className="mb-3 mt-6 text-2xl font-bold">
            40代以上：経験を活かす転職
          </h3>
          <div className="my-4 rounded-lg bg-purple-50 p-6">
            <p className="mb-3"><strong>40代（40〜49歳）：</strong></p>
            <p className="mb-4 text-sm">
              豊富な経験を活かせる管理職、専門職への転職が中心。
              人脈やリファラルを活用し、慎重に企業を選ぶべき。
              ハイクラス・エグゼクティブ向けエージェントの活用が必須。
            </p>
            <p className="mb-3"><strong>50代以上：</strong></p>
            <p className="text-sm">
              顧問、アドバイザー、経営幹部など、限定的な選択肢に。
              専門性や人脈が最大の武器。業界特化型エージェントを活用しましょう。
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            転職市場の繁忙期・閑散期
          </h2>
          
          <h3 className="mb-3 mt-6 text-2xl font-bold">
            転職活動に最適な時期
          </h3>
          <div className="my-4 rounded-lg bg-yellow-50 p-6">
            <p className="mb-3"><strong>1月〜3月：最も求人が多い時期</strong></p>
            <p className="mb-4 text-sm">
              多くの企業が新年度（4月）に向けて採用活動を活発化。
              求人数が最も多く、選択肢が豊富。競争は激しいが、チャンスも多い。
            </p>
            <p className="mb-3"><strong>9月〜11月：第二の繁忙期</strong></p>
            <p className="text-sm">
              下半期（10月）スタートに向けた採用や、
              年内入社を目指す企業の求人が増加。
              転職市場の第二ピーク。
            </p>
          </div>

          <h3 className="mb-3 mt-6 text-2xl font-bold">
            避けた方がいい時期
          </h3>
          <div className="my-4 rounded-lg bg-gray-50 p-6">
            <p className="mb-3"><strong>8月・12月：求人が少ない</strong></p>
            <p className="text-sm">
              夏季休暇、年末年始の影響で、企業の採用活動が停滞。
              ただし、競争相手も少ないため、狙い目という見方も。
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            在職期間から見る転職タイミング
          </h2>
          
          <div className="my-6 space-y-4">
            <div className="rounded-lg bg-red-50 p-6">
              <h3 className="mb-2 font-bold text-red-600">
                入社1年未満：基本的にNG
              </h3>
              <p className="text-sm">
                特別な事情（配属ガチャの失敗、会社都合など）がない限り、
                避けた方が無難。次の転職でも不利になります。
              </p>
            </div>

            <div className="rounded-lg bg-yellow-50 p-6">
              <h3 className="mb-2 font-bold text-yellow-700">
                入社1〜3年：第二新卒として転職可能
              </h3>
              <p className="text-sm">
                基本的なビジネスマナーが身についた段階。
                異業種・異職種へのキャリアチェンジもまだ可能。
                ただし、明確な転職理由が必要。
              </p>
            </div>

            <div className="rounded-lg bg-green-50 p-6">
              <h3 className="mb-2 font-bold text-green-700">
                入社3〜5年：最も転職しやすい
              </h3>
              <p className="text-sm">
                ある程度の専門性とスキルが身についた段階。
                実績をアピールでき、転職市場で最も評価される期間。
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-6">
              <h3 className="mb-2 font-bold text-blue-700">
                入社5年以上：専門性・マネジメントが必要
              </h3>
              <p className="text-sm">
                長く勤めた分、深い専門性やマネジメント経験が求められます。
                同業界・同職種でのキャリアアップ転職が中心に。
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            転職すべきでないタイミング
          </h2>
          
          <div className="my-6 space-y-4">
            <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
              <h4 className="font-bold text-red-600">
                ❌ 感情的になっている時
              </h4>
              <p className="mt-2 text-sm">
                上司とケンカした直後など、感情的な状態での転職判断は危険。
                冷静になってから、本当に転職すべきか考えましょう。
              </p>
            </div>

            <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
              <h4 className="font-bold text-red-600">
                ❌ 経済的に余裕がない時
              </h4>
              <p className="mt-2 text-sm">
                転職活動には時間もお金もかかります。
                最低でも3〜6ヶ月分の生活費の貯蓄がない状態での転職は避けましょう。
              </p>
            </div>

            <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
              <h4 className="font-bold text-red-600">
                ❌ 重要なプロジェクト途中
              </h4>
              <p className="mt-2 text-sm">
                大型プロジェクトの途中で抜けると、キャリアの傷になる可能性も。
                区切りの良いタイミングまで待つのがベター。
              </p>
            </div>

            <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
              <h4 className="font-bold text-red-600">
                ❌ 昇進・昇給の直前
              </h4>
              <p className="mt-2 text-sm">
                もうすぐ昇進・昇給が決まりそうな場合、
                それを経歴に加えてから転職した方が有利なことも。
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            転職活動の期間はどのくらい？
          </h2>
          <p>
            転職活動にかかる期間の目安は以下の通りです。
          </p>
          <div className="my-6 rounded-lg bg-blue-50 p-6">
            <h3 className="mb-3 font-bold">転職活動の期間（平均）</h3>
            <ul className="list-disc pl-6">
              <li>20代：2〜3ヶ月</li>
              <li>30代：3〜4ヶ月</li>
              <li>40代以上：4〜6ヶ月</li>
            </ul>
            <p className="mt-4 text-sm text-gray-600">
              ※在職中に活動する場合。退職後はより短期間で決まることも。
            </p>
          </div>
          <p>
            逆算すると、「4月入社したい」なら1月には活動開始、
            「10月入社したい」なら7月には動き始める必要があります。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            転職タイミングの最終チェックリスト
          </h2>
          
          <div className="my-6 rounded-lg bg-green-50 p-6">
            <p className="mb-4 font-bold">以下の質問に「YES」なら、転職を検討すべきタイミングです：</p>
            <ul className="space-y-2">
              <li>□ 現職で成長を感じられない</li>
              <li>□ 明確な転職理由がある</li>
              <li>□ 在職期間が1年以上ある</li>
              <li>□ 経済的に余裕がある（貯金がある）</li>
              <li>□ やりたいことが明確になっている</li>
              <li>□ 転職市場が活況（1〜3月、9〜11月）</li>
              <li>□ 心身ともに健康である</li>
              <li>□ 家族の理解・協力が得られる</li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">まとめ</h2>
          <p>
            転職のベストタイミングは、個人の状況によって異なります。
            年齢、経験年数、市場動向、ライフステージなど、
            様々な要素を総合的に判断する必要があります。
          </p>
          <p className="mt-4">
            重要なのは、「なんとなく」ではなく、明確な理由と目的を持って転職すること。
            そして、自分の市場価値を正確に把握し、最適なタイミングで動くこと。
          </p>
          <p className="mt-4">
            転職エージェントに相談することで、客観的な視点から
            「今が転職のタイミングか」「もう少し待つべきか」を
            アドバイスしてもらえます。まずは気軽に相談してみましょう。
          </p>
        </section>

      <div className="my-12 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 p-8 md:p-12 text-white shadow-2xl">
        <div className="text-center">
          <div className="mb-6">
            <div className="mb-2 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-bold backdrop-blur-sm">
              完全無料・30秒で完了
            </div>
          </div>
          <h3 className="mb-4 text-3xl font-bold md:text-4xl">
            あなたの転職タイミング、<br />
            プロに相談しませんか？
          </h3>
          <p className="mb-8 text-lg opacity-95">
            市場動向、あなたのキャリア状況を踏まえて<br />
            最適な転職タイミングをアドバイス
          </p>
          <Link
            href="/gt/lp01deaeru/1"
            className="inline-flex items-center gap-3 rounded-full bg-white px-12 py-5 text-xl font-bold text-teal-600 shadow-2xl transition hover:scale-105 hover:bg-gray-50"
          >
            無料診断をはじめる
            <ArrowRight className="h-6 w-6" />
          </Link>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
            <span>✓ タイミング相談無料</span>
            <span>✓ 市場動向を把握</span>
          </div>
        </div>
      </div>
    </ArticleLayout>
  );
}
