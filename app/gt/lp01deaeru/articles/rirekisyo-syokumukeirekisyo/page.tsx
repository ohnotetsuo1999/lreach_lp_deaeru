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
import { ArrowRight, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "職務経歴書の書き方完全版｜書類選考通過率を上げるコツ｜出会えるエージェント",
  description: "採用担当者の目に留まる職務経歴書の書き方。構成、実績の書き方、NGポイントまで、書類選考通過率を上げる秘訣を徹底解説します。",
  keywords: "職務経歴書,履歴書,書き方,転職,書類選考,エージェント",
  openGraph: {
    title: "職務経歴書の書き方完全版｜書類選考通過率を上げるコツ",
    description: "採用担当者の目に留まる職務経歴書の書き方を徹底解説します。",
    type: "article",
  },
};

export default function Article() {
  const relatedArticles = [
    {
      title: "転職面接で絶対に落ちない対策",
      slug: "mensetsu-taisaku",
      category: "面接対策",
    },
    {
      title: "転職エージェントを最大活用する方法",
      slug: "tensyoku-agent-katsuyou",
      category: "エージェント活用",
    },
    {
      title: "2ヶ月で内定5社！爆速転職の裏技",
      slug: "20dai-saisoku-naishin",
      category: "転職ノウハウ",
    },
  ];

  return (
    <ArticleLayout
      title="受かる履歴書・職務経歴書の書き方"
      category="応募書類"
      readTime={8}
      publishedDate="2026年1月29日"
      relatedArticles={relatedArticles}
    >
      <header className="mb-12">
        <h1 className="mb-4 text-4xl font-bold leading-tight">
          職務経歴書の書き方完全版
        </h1>
        <p className="text-lg text-gray-600">
          書類選考を突破する。採用担当者の心を掴む職務経歴書の作り方。
        </p>
      </header>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            職務経歴書とは？履歴書との違い
          </h2>
          <p>
            職務経歴書は、これまでの職務内容や実績を詳細に記載する書類です。
            履歴書が「プロフィール」なら、職務経歴書は「キャリアのポートフォリオ」。
            採用担当者は、職務経歴書で「この人は何ができるのか」を判断します。
          </p>
          <div className="my-6 overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">項目</th>
                  <th className="border border-gray-300 px-4 py-2">履歴書</th>
                  <th className="border border-gray-300 px-4 py-2">職務経歴書</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-bold">目的</td>
                  <td className="border border-gray-300 px-4 py-2">基本情報の確認</td>
                  <td className="border border-gray-300 px-4 py-2">能力・実績の確認</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-bold">枚数</td>
                  <td className="border border-gray-300 px-4 py-2">1枚</td>
                  <td className="border border-gray-300 px-4 py-2">1〜2枚（最大3枚）</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-bold">内容</td>
                  <td className="border border-gray-300 px-4 py-2">学歴・職歴の概要</td>
                  <td className="border border-gray-300 px-4 py-2">職務内容・実績の詳細</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-bold">フォーマット</td>
                  <td className="border border-gray-300 px-4 py-2">ほぼ固定</td>
                  <td className="border border-gray-300 px-4 py-2">自由（工夫の余地大）</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            職務経歴書の基本構成
          </h2>
          
          <div className="my-6 space-y-6">
            <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-6">
              <h3 className="mb-2 text-xl font-bold">1. 職務要約（サマリー）</h3>
              <p className="mb-2">
                <strong>文字数：200〜300字程度</strong>
              </p>
              <p className="text-sm">
                これまでのキャリアを3〜5行で要約。
                採用担当者が最初に目を通す部分なので、
                「何をしてきた人か」が一目でわかるように書きましょう。
              </p>
              <div className="mt-4 rounded-lg bg-white p-4">
                <p className="mb-2 text-sm font-bold">例：</p>
                <p className="text-sm">
                  「大手IT企業にてWebアプリケーション開発に5年従事。
                  バックエンド（Ruby on Rails）を中心に、
                  月間100万PVのサービス開発を担当。
                  チームリーダーとして3名のメンバーをマネジメントし、
                  開発効率を30%向上させた実績があります。」
                </p>
              </div>
            </div>

            <div className="rounded-lg border-l-4 border-green-500 bg-green-50 p-6">
              <h3 className="mb-2 text-xl font-bold">2. 職務経歴（詳細）</h3>
              <p className="text-sm mb-4">
                時系列で、各職歴の詳細を記載。企業概要、在籍期間、役職、
                担当業務、実績を具体的に書きます。
              </p>
              <div className="rounded-lg bg-white p-4">
                <p className="mb-2 text-sm font-bold">記載項目：</p>
                <ul className="list-disc pl-6 text-sm">
                  <li>会社名・事業内容・従業員数</li>
                  <li>在籍期間（◯◯年◯月〜◯◯年◯月）</li>
                  <li>所属部署・役職</li>
                  <li>担当業務の内容</li>
                  <li>具体的な実績（数値で示す）</li>
                  <li>使用ツール・スキル</li>
                </ul>
              </div>
            </div>

            <div className="rounded-lg border-l-4 border-purple-500 bg-purple-50 p-6">
              <h3 className="mb-2 text-xl font-bold">3. 活かせるスキル・知識</h3>
              <p className="text-sm">
                応募先で活かせるスキルを具体的に記載。
                単なるスキルリストではなく、
                「どのレベルで、どう活用してきたか」を示しましょう。
              </p>
            </div>

            <div className="rounded-lg border-l-4 border-orange-500 bg-orange-50 p-6">
              <h3 className="mb-2 text-xl font-bold">4. 資格・免許</h3>
              <p className="text-sm">
                業務に関連する資格を記載。
                取得年月日も忘れずに。
              </p>
            </div>

            <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-6">
              <h3 className="mb-2 text-xl font-bold">5. 自己PR</h3>
              <p className="mb-2">
                <strong>文字数：200〜400字程度</strong>
              </p>
              <p className="text-sm">
                強みや志向性を、実績を交えてアピール。
                「応募先企業で何ができるか」を意識して書きましょう。
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            実績の書き方：STAR法を使おう
          </h2>
          <p>
            実績を効果的に伝えるには、STAR法が有効です。
          </p>
          <div className="my-6 rounded-lg bg-blue-50 p-6">
            <h3 className="mb-4 font-bold">STAR法とは？</h3>
            <ul className="space-y-3">
              <li>
                <strong>S (Situation)：状況</strong><br />
                <span className="text-sm">どんな状況・課題があったか</span>
              </li>
              <li>
                <strong>T (Task)：課題</strong><br />
                <span className="text-sm">あなたに課せられた役割・目標は何か</span>
              </li>
              <li>
                <strong>A (Action)：行動</strong><br />
                <span className="text-sm">どのような行動を取ったか</span>
              </li>
              <li>
                <strong>R (Result)：結果</strong><br />
                <span className="text-sm">どんな成果が出たか（数値で示す）</span>
              </li>
            </ul>
          </div>

          <div className="my-6 rounded-lg bg-green-50 p-6">
            <p className="mb-3 font-bold">STAR法の実践例：</p>
            <p className="text-sm mb-2">
              <strong>S:</strong> 新規事業の立ち上げにあたり、営業チームの生産性が課題となっていた
            </p>
            <p className="text-sm mb-2">
              <strong>T:</strong> チームリーダーとして、3ヶ月で営業効率を20%向上させる目標を設定
            </p>
            <p className="text-sm mb-2">
              <strong>A:</strong> 
              営業プロセスを分析し、非効率な業務をRPA化。
              週次の振り返りミーティングを導入し、ベストプラクティスを共有
            </p>
            <p className="text-sm">
              <strong>R:</strong> 
              3ヶ月で営業効率25%向上、売上を前年比150%に拡大。
              チーム全体のモチベーション向上にも貢献
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            数値で示す：実績の定量化
          </h2>
          <p>
            採用担当者が最も知りたいのは、「あなたが何を成し遂げたか」。
            実績は必ず数値で示しましょう。
          </p>
          <div className="my-6 space-y-4">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="mb-2 font-bold text-red-600">❌ NG例：</p>
              <p className="text-sm">
                「営業として、多くの顧客を獲得しました」
              </p>
            </div>
            <div className="rounded-lg bg-green-50 p-4">
              <p className="mb-2 font-bold text-green-600">✓ OK例：</p>
              <p className="text-sm">
                「新規営業として、年間50社の顧客を獲得。売上2億円に貢献しました」
              </p>
            </div>
          </div>

          <div className="my-6 rounded-lg bg-yellow-50 p-6">
            <h3 className="mb-3 font-bold">数値化の例：</h3>
            <ul className="list-disc pl-6 text-sm">
              <li>売上：「前年比150%の売上達成」「年間売上3億円」</li>
              <li>顧客数：「新規顧客50社獲得」「顧客満足度95%達成」</li>
              <li>コスト削減：「業務効率化により年間500万円のコスト削減」</li>
              <li>生産性：「作業時間を30%削減」「処理件数を2倍に向上」</li>
              <li>マネジメント：「5名のチームをマネジメント」「離職率0%を達成」</li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            職種別：職務経歴書のポイント
          </h2>
          
          <h3 className="mb-3 mt-6 text-2xl font-bold">
            営業職の場合
          </h3>
          <ul className="my-4 list-disc pl-6">
            <li>売上実績を具体的な数字で示す</li>
            <li>目標達成率、新規顧客獲得数を記載</li>
            <li>営業手法（既存顧客深耕、新規開拓など）を明記</li>
            <li>担当製品・サービス、顧客層を説明</li>
          </ul>

          <h3 className="mb-3 mt-6 text-2xl font-bold">
            エンジニア職の場合
          </h3>
          <ul className="my-4 list-disc pl-6">
            <li>使用した技術スタック（言語、フレームワーク、ツール）</li>
            <li>プロジェクトの規模（開発期間、チーム人数）</li>
            <li>担当フェーズ（要件定義、設計、実装、テストなど）</li>
            <li>GitHub、Qiita、技術ブログなどのURLを記載</li>
          </ul>

          <h3 className="mb-3 mt-6 text-2xl font-bold">
            企画・マーケティング職の場合
          </h3>
          <ul className="my-4 list-disc pl-6">
            <li>企画した施策とその成果（数値で）</li>
            <li>担当したプロダクト・サービスの規模</li>
            <li>使用したツール（Google Analytics、広告媒体など）</li>
            <li>PDCAを回した経験を具体的に</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            職務経歴書のよくあるNG
          </h2>
          
          <div className="my-6 space-y-4">
            <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
              <h4 className="font-bold text-red-600">
                ❌ NG1: 長すぎる（3枚以上）
              </h4>
              <p className="mt-2 text-sm">
                基本は1〜2枚。どんなに実績があっても3枚まで。
                採用担当者は多数の書類に目を通すため、簡潔さが重要。
              </p>
            </div>

            <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
              <h4 className="font-bold text-red-600">
                ❌ NG2: 業務内容の羅列だけ
              </h4>
              <p className="mt-2 text-sm">
                「〇〇を担当しました」だけでは不十分。
                「どんな成果を出したか」まで書きましょう。
              </p>
            </div>

            <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
              <h4 className="font-bold text-red-600">
                ❌ NG3: 専門用語・社内用語が多すぎる
              </h4>
              <p className="mt-2 text-sm">
                社外の人が読んでも理解できる表現を心がけましょう。
                社内でしか通じない略語は避ける。
              </p>
            </div>

            <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
              <h4 className="font-bold text-red-600">
                ❌ NG4: 誤字脱字がある
              </h4>
              <p className="mt-2 text-sm">
                基本的なミスは致命的。必ず複数回チェックし、
                できれば他人にも見てもらいましょう。
              </p>
            </div>

            <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
              <h4 className="font-bold text-red-600">
                ❌ NG5: すべての企業に同じ内容を送る
              </h4>
              <p className="mt-2 text-sm">
                応募先企業に合わせて、アピールポイントをカスタマイズすることが重要。
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">
            書類選考通過率を上げる3つのコツ
          </h2>
          
          <div className="my-6 space-y-6">
            <div className="rounded-lg border-2 border-blue-200 p-6">
              <h3 className="mb-3 text-xl font-bold text-blue-600">
                コツ1: 応募先企業に合わせてカスタマイズ
              </h3>
              <p>
                企業の求める人材像に合わせて、職務経歴書の強調ポイントを変えましょう。
                求人票をよく読み、「どんなスキル・経験が求められているか」を把握することが重要です。
              </p>
            </div>

            <div className="rounded-lg border-2 border-green-200 p-6">
              <h3 className="mb-3 text-xl font-bold text-green-600">
                コツ2: 見やすさ・読みやすさを重視
              </h3>
              <p>
                箇条書き、太字、見出しを効果的に使い、
                パッと見て内容が把握できるようにレイアウトしましょう。
              </p>
              <ul className="mt-3 list-disc pl-6 text-sm">
                <li>フォントサイズは10.5〜11pt</li>
                <li>余白を適切に取る</li>
                <li>重要なキーワードは太字に</li>
                <li>箇条書きで簡潔に</li>
              </ul>
            </div>

            <div className="rounded-lg border-2 border-purple-200 p-6">
              <h3 className="mb-3 text-xl font-bold text-purple-600">
                コツ3: エージェントに添削してもらう
              </h3>
              <p>
                プロの目でチェックしてもらうことで、
                客観的な改善ポイントが見つかります。
                業界に精通したエージェントなら、
                その業界特有のアピールポイントもアドバイスしてくれます。
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">まとめ</h2>
          <p>
            職務経歴書は、あなたの「キャリアのポートフォリオ」です。
            採用担当者に「この人に会ってみたい」と思わせることができれば、
            書類選考は突破できます。
          </p>
          <p className="mt-4">
            重要なのは、実績を数値で示すこと、
            応募先企業に合わせてカスタマイズすること、
            そして見やすく・読みやすいレイアウトにすること。
          </p>
          <p className="mt-4">
            自信がない場合は、転職エージェントに添削してもらうのがおすすめです。
            プロの視点でのアドバイスにより、書類選考通過率は大きく向上します。
          </p>
        </section>

      <div className="my-12 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 p-8 md:p-12 text-white shadow-2xl">
        <div className="text-center">
          <div className="mb-6">
            <div className="mb-2 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-bold backdrop-blur-sm">
              完全無料・30秒で完了
            </div>
          </div>
          <h3 className="mb-4 text-3xl font-bold md:text-4xl">
            職務経歴書の添削をしてくれる<br />
            エージェントを見つけよう
          </h3>
          <p className="mb-8 text-lg opacity-95">
            業界知識が豊富で、書類選考通過率を上げる<br />
            添削をしてくれるエージェントを発見
          </p>
          <Link
            href="/gt/lp01deaeru/1"
            className="inline-flex items-center gap-3 rounded-full bg-white px-12 py-5 text-xl font-bold text-indigo-600 shadow-2xl transition hover:scale-105 hover:bg-gray-50"
          >
            無料診断をはじめる
            <ArrowRight className="h-6 w-6" />
          </Link>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
            <span>✓ プロの添削で書類選考通過率UP</span>
            <span>✓ 完全無料</span>
          </div>
        </div>
      </div>
    </ArticleLayout>
  );
}
