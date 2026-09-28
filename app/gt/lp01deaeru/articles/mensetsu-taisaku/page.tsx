import { type Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "../_components/ArticleLayout";
import {
  InsightCard,
  StepCard,
  CheckList,
  InlineCTA,
  AlertBox,
} from "../_components/ArticleComponents";
import { ArrowRight, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "転職面接対策の完全ガイド｜よくある質問と回答例｜出会えるエージェント",
  description: "転職面接を成功させるための完全マニュアル。よくある質問への回答例、逆質問のコツ、面接官が見ているポイントまで徹底解説します。",
  keywords: "面接,転職,対策,質問,回答例,エージェント",
  openGraph: {
    title: "転職面接対策の完全ガイド｜よくある質問と回答例",
    description: "転職面接を成功させるための完全マニュアルを徹底解説します。",
    type: "article",
  },
};

export default function Article() {
  const relatedArticles = [
    {
      title: "受かる履歴書・職務経歴書の書き方",
      slug: "rirekisyo-syokumukeirekisyo",
      category: "応募書類",
    },
    {
      title: "2ヶ月で内定5社！爆速転職の裏技",
      slug: "20dai-saisoku-naishin",
      category: "転職ノウハウ",
    },
    {
      title: "転職エージェントを最大活用する方法",
      slug: "tensyoku-agent-katsuyou",
      category: "エージェント活用",
    },
  ];

  return (
    <ArticleLayout
      title="転職面接で絶対に落ちない対策"
      category="面接対策"
      readTime={8}
      publishedDate="2026年1月29日"
      relatedArticles={relatedArticles}
    >
      <header className="mb-12">
        <h1 className="mb-4 text-4xl font-bold leading-tight">
          転職面接対策の完全ガイド
        </h1>
        <p className="text-lg text-gray-600">
          面接を制する者が転職を制す。成功のための実践的テクニック。
        </p>
      </header>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            転職面接で面接官が見ているポイント
          </h2>
          <p>
            面接官が評価しているのは、大きく分けて3つの要素です。
          </p>
          <div className="my-6 space-y-4">
            <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-6">
              <h3 className="mb-2 text-xl font-bold">1. スキル・経験（Can）</h3>
              <p className="text-sm">
                「この人は必要なスキルを持っているか」
                「即戦力として活躍できるか」
              </p>
            </div>

            <div className="rounded-lg border-l-4 border-green-500 bg-green-50 p-6">
              <h3 className="mb-2 text-xl font-bold">2. 意欲・熱意（Will）</h3>
              <p className="text-sm">
                「この会社で働きたいという熱意があるか」
                「成長意欲はあるか」
              </p>
            </div>

            <div className="rounded-lg border-l-4 border-purple-500 bg-purple-50 p-6">
              <h3 className="mb-2 text-xl font-bold">3. 相性・カルチャーフィット（Fit）</h3>
              <p className="text-sm">
                「会社のカルチャーに合うか」
                「チームで協働できるか」
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            必ず聞かれる質問TOP10と回答のコツ
          </h2>
          
          <h3 className="mb-3 mt-6 text-2xl font-bold">
            質問1: 自己紹介をお願いします
          </h3>
          <div className="my-4 rounded-lg bg-gray-50 p-6">
            <p className="mb-3 font-bold">回答のコツ：</p>
            <ul className="mb-4 list-disc pl-6 text-sm">
              <li>1〜2分程度で簡潔に</li>
              <li>経歴の概要 → 強み → 志望理由の流れで</li>
              <li>応募職種に関連する経験を中心に</li>
            </ul>
            <div className="rounded-lg bg-white p-4">
              <p className="mb-2 text-sm font-bold text-green-600">✓ 回答例：</p>
              <p className="text-sm">
                「〇〇大学卒業後、株式会社△△にて5年間Webマーケティングに従事してまいりました。
                特にSEO施策を得意としており、担当サイトの自然検索流入を前年比200%に増加させた実績があります。
                より上流の戦略立案に携わりたいと考え、貴社のマーケティングマネージャー職に応募いたしました。」
              </p>
            </div>
          </div>

          <h3 className="mb-3 mt-6 text-2xl font-bold">
            質問2: 転職理由を教えてください
          </h3>
          <div className="my-4 rounded-lg bg-gray-50 p-6">
            <p className="mb-3 font-bold">回答のコツ：</p>
            <ul className="mb-4 list-disc pl-6 text-sm">
              <li>ネガティブな理由は避ける</li>
              <li>「〇〇がしたいから」という前向きな理由を</li>
              <li>応募先企業でそれが実現できる理由も添える</li>
            </ul>
            <div className="space-y-4">
              <div className="rounded-lg bg-red-50 p-4">
                <p className="mb-2 text-sm font-bold text-red-600">❌ NG例：</p>
                <p className="text-sm">
                  「給料が安い」「残業が多い」「上司と合わない」
                </p>
              </div>
              <div className="rounded-lg bg-white p-4">
                <p className="mb-2 text-sm font-bold text-green-600">✓ OK例：</p>
                <p className="text-sm">
                  「現職では特定の機能開発が中心ですが、
                  サービス全体の設計から携わりたいと考えるようになりました。
                  貴社では新規サービスの立ち上げフェーズから参画できると伺い、
                  自分の成長とサービスの成長を同時に実現できると考え、応募いたしました。」
                </p>
              </div>
            </div>
          </div>

          <h3 className="mb-3 mt-6 text-2xl font-bold">
            質問3: 志望動機を教えてください
          </h3>
          <div className="my-4 rounded-lg bg-gray-50 p-6">
            <p className="mb-3 font-bold">回答のコツ：</p>
            <ul className="mb-4 list-disc pl-6 text-sm">
              <li>「なぜこの業界か」「なぜこの会社か」を明確に</li>
              <li>企業研究をしっかり行い、具体的に</li>
              <li>自分の経験・スキルと絡めて説明</li>
            </ul>
            <div className="rounded-lg bg-white p-4">
              <p className="mb-2 text-sm font-bold text-green-600">✓ 回答例：</p>
              <p className="text-sm">
                「貴社のプロダクトである〇〇は、
                △△という課題を解決する画期的なサービスだと感じています。
                私自身も前職で同様の課題に直面した経験があり、
                このサービスの価値を深く理解しております。
                また、貴社の『顧客第一主義』という企業理念に強く共感し、
                私のカスタマーサクセス経験を活かして貢献できると考えました。」
              </p>
            </div>
          </div>

          <h3 className="mb-3 mt-6 text-2xl font-bold">
            質問4: あなたの強みは何ですか？
          </h3>
          <div className="my-4 rounded-lg bg-gray-50 p-6">
            <p className="mb-3 font-bold">回答のコツ：</p>
            <ul className="mb-4 list-disc pl-6 text-sm">
              <li>応募職種に関連する強みを選ぶ</li>
              <li>具体的なエピソードで裏付ける</li>
              <li>その強みを応募先でどう活かすかまで言及</li>
            </ul>
            <div className="rounded-lg bg-white p-4">
              <p className="mb-2 text-sm font-bold text-green-600">✓ 回答例：</p>
              <p className="text-sm">
                「私の強みは、課題解決に向けた粘り強さです。
                前職では、売上が伸び悩んでいたプロダクトの改善を任されました。
                顧客へのヒアリングを100件以上実施し、根本原因を特定。
                UIの改善とオンボーディングの刷新により、
                解約率を30%削減することに成功しました。
                貴社でも、この粘り強さを活かして、顧客満足度の向上に貢献したいと考えています。」
              </p>
            </div>
          </div>

          <h3 className="mb-3 mt-6 text-2xl font-bold">
            質問5: あなたの弱みは何ですか？
          </h3>
          <div className="my-4 rounded-lg bg-gray-50 p-6">
            <p className="mb-3 font-bold">回答のコツ：</p>
            <ul className="mb-4 list-disc pl-6 text-sm">
              <li>致命的な弱みは避ける</li>
              <li>改善に向けて努力していることを添える</li>
              <li>弱みを強みに変換できる表現を使う</li>
            </ul>
            <div className="rounded-lg bg-white p-4">
              <p className="mb-2 text-sm font-bold text-green-600">✓ 回答例：</p>
              <p className="text-sm">
                「細部にこだわりすぎて、スピード感に欠けることがあります。
                そのため、現在は『80点で良いものは早く出す』ことを意識し、
                優先順位をつけて業務に取り組むよう心がけています。
                また、チームメンバーからフィードバックをもらい、
                客観的な視点でのバランス感覚を養っています。」
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            職種別：よく聞かれる専門的質問
          </h2>
          
          <h3 className="mb-3 mt-6 text-2xl font-bold">
            営業職の場合
          </h3>
          <ul className="my-4 list-disc pl-6">
            <li>「あなたの営業スタイルを教えてください」</li>
            <li>「最も大きな成約事例を教えてください」</li>
            <li>「目標未達成だった時、どう対処しましたか？」</li>
            <li>「難しい顧客をどう説得しますか？」</li>
          </ul>

          <h3 className="mb-3 mt-6 text-2xl font-bold">
            エンジニア職の場合
          </h3>
          <ul className="my-4 list-disc pl-6">
            <li>「これまで最も難しかった技術的課題は？」</li>
            <li>「使用している技術スタックと選定理由は？」</li>
            <li>「最近興味のある技術トレンドは？」</li>
            <li>「チーム開発での役割は？」</li>
          </ul>

          <h3 className="mb-3 mt-6 text-2xl font-bold">
            マーケティング職の場合
          </h3>
          <ul className="my-4 list-disc pl-6">
            <li>「最も成果の出た施策とその理由は？」</li>
            <li>「失敗した施策から何を学びましたか？」</li>
            <li>「データ分析で重視する指標は？」</li>
            <li>「最新のマーケティングトレンドをどうキャッチアップしていますか？」</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            逆質問：面接官に好印象を与える質問例
          </h2>
          <p>
            「何か質問はありますか？」と聞かれた時、
            「特にありません」はNG。必ず2〜3個は質問を用意しておきましょう。
          </p>
          
          <div className="my-6 space-y-4">
            <div className="rounded-lg bg-green-50 p-4">
              <h4 className="mb-2 font-bold text-green-600">✓ 良い逆質問の例：</h4>
              <ul className="list-disc pl-6 text-sm">
                <li>「このポジションで期待される成果を教えてください」</li>
                <li>「入社後、最初に取り組んでいただきたい業務は何でしょうか？」</li>
                <li>「チームの雰囲気や文化について教えてください」</li>
                <li>「活躍している社員に共通する特徴はありますか？」</li>
                <li>「今後の事業展開の方向性を教えてください」</li>
                <li>「評価制度について詳しく教えていただけますか？」</li>
              </ul>
            </div>

            <div className="rounded-lg bg-red-50 p-4">
              <h4 className="mb-2 font-bold text-red-600">❌ 避けるべき逆質問：</h4>
              <ul className="list-disc pl-6 text-sm">
                <li>「残業はどのくらいありますか？」（初回面接では避ける）</li>
                <li>「有給は取りやすいですか？」（福利厚生ばかり気にしていると思われる）</li>
                <li>「御社の事業内容を教えてください」（調べればわかることを質問）</li>
                <li>「いつ頃、内定をいただけますか？」（焦っている印象）</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            面接の流れと各段階での対策
          </h2>
          
          <h3 className="mb-3 mt-6 text-2xl font-bold">
            一次面接（人事・現場責任者）
          </h3>
          <div className="my-4 rounded-lg bg-blue-50 p-6">
            <p className="mb-2"><strong>目的：</strong>基本的なスキル・人柄の確認</p>
            <p className="mb-3"><strong>対策：</strong></p>
            <ul className="list-disc pl-6 text-sm">
              <li>職務経歴書の内容を深掘りされる</li>
              <li>基本的な質問への回答を準備</li>
              <li>明るく、ハキハキと話す</li>
            </ul>
          </div>

          <h3 className="mb-3 mt-6 text-2xl font-bold">
            二次面接（部門長・マネージャー）
          </h3>
          <div className="my-4 rounded-lg bg-green-50 p-6">
            <p className="mb-2"><strong>目的：</strong>専門性・チーム適性の確認</p>
            <p className="mb-3"><strong>対策：</strong></p>
            <ul className="list-disc pl-6 text-sm">
              <li>専門的な質問が増える</li>
              <li>具体的な業務イメージを持って臨む</li>
              <li>チームでの協働力をアピール</li>
            </ul>
          </div>

          <h3 className="mb-3 mt-6 text-2xl font-bold">
            最終面接（役員・社長）
          </h3>
          <div className="my-4 rounded-lg bg-purple-50 p-6">
            <p className="mb-2"><strong>目的：</strong>企業理念への共感・意欲の確認</p>
            <p className="mb-3"><strong>対策：</strong></p>
            <ul className="list-disc pl-6 text-sm">
              <li>志望動機を深く掘り下げられる</li>
              <li>将来のビジョン・キャリアプランを聞かれる</li>
              <li>企業理念・ビジョンへの共感を示す</li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            面接前日・当日の準備チェックリスト
          </h2>
          
          <div className="my-6 rounded-lg bg-yellow-50 p-6">
            <h3 className="mb-4 font-bold">前日までに準備すること：</h3>
            <ul className="space-y-2">
              <li>□ 企業の公式サイト、IR情報、ニュースをチェック</li>
              <li>□ 想定質問への回答を準備・練習</li>
              <li>□ 逆質問を2〜3個用意</li>
              <li>□ 職務経歴書のコピーを持参</li>
              <li>□ 面接場所への行き方・所要時間を確認</li>
              <li>□ 服装・身だしなみを整える</li>
            </ul>
          </div>

          <div className="my-6 rounded-lg bg-blue-50 p-6">
            <h3 className="mb-4 font-bold">当日の注意点：</h3>
            <ul className="space-y-2">
              <li>□ 10分前には到着（早すぎもNG）</li>
              <li>□ スマホはマナーモードor電源OFF</li>
              <li>□ 受付から退出まで、気を抜かない</li>
              <li>□ 明るい表情・姿勢を意識</li>
              <li>□ 面接官の目を見て話す</li>
              <li>□ 結論から話し、簡潔に</li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            オンライン面接の注意点
          </h2>
          
          <div className="my-6 space-y-4">
            <div className="rounded-lg bg-gray-50 p-4">
              <h4 className="mb-2 font-bold">環境設定</h4>
              <ul className="list-disc pl-6 text-sm">
                <li>静かな場所を確保（生活音が入らないように）</li>
                <li>背景は白い壁or バーチャル背景</li>
                <li>明るさを確保（逆光にならないよう）</li>
                <li>カメラは目線の高さに</li>
              </ul>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <h4 className="mb-2 font-bold">技術面の準備</h4>
              <ul className="list-disc pl-6 text-sm">
                <li>事前に接続テストを実施</li>
                <li>イヤホンマイクを使用（ハウリング防止）</li>
                <li>Zoom/Teamsなどのツールの使い方を確認</li>
                <li>万が一の接続トラブルに備え、連絡先を控える</li>
              </ul>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <h4 className="mb-2 font-bold">話し方の工夫</h4>
              <ul className="list-disc pl-6 text-sm">
                <li>対面よりゆっくり、はっきり話す</li>
                <li>カメラ目線を意識（画面を見がち）</li>
                <li>適度にうなずき、リアクションを大きめに</li>
                <li>通信遅延を考慮し、少し間を取って話す</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">まとめ</h2>
          <p>
            転職面接は、あなたのスキルや経験をアピールする場であると同時に、
            その企業が自分に合うかを見極める場でもあります。
          </p>
          <p className="mt-4">
            しっかりと準備をし、自信を持って臨めば、必ず良い結果がついてきます。
            特に、想定質問への回答準備、企業研究、逆質問の用意は必須です。
          </p>
          <p className="mt-4">
            面接に不安がある場合は、転職エージェントの模擬面接サービスを活用しましょう。
            プロの視点でのフィードバックにより、面接力は確実に向上します。
          </p>
        </section>

      <div className="my-12 overflow-hidden rounded-2xl bg-gradient-to-r from-red-500 to-pink-600 p-8 md:p-12 text-white shadow-2xl">
        <div className="text-center">
          <div className="mb-6">
            <div className="mb-2 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-bold backdrop-blur-sm">
              完全無料・30秒で完了
            </div>
          </div>
          <h3 className="mb-4 text-3xl font-bold md:text-4xl">
            面接対策をサポートしてくれる<br />
            エージェントを見つけよう
          </h3>
          <p className="mb-8 text-lg opacity-95">
            模擬面接、想定質問の提供、企業ごとの面接傾向の共有など<br />
            手厚い面接サポート
          </p>
          <Link
            href="/gt/lp01deaeru/1"
            className="inline-flex items-center gap-3 rounded-full bg-white px-12 py-5 text-xl font-bold text-pink-600 shadow-2xl transition hover:scale-105 hover:bg-gray-50"
          >
            無料診断をはじめる
            <ArrowRight className="h-6 w-6" />
          </Link>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
            <span>✓ 模擬面接サポート</span>
            <span>✓ 企業別の面接対策</span>
          </div>
        </div>
      </div>
    </ArticleLayout>
  );
}
