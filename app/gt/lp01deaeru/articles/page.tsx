import { type Metadata } from "next";
import Link from "next/link";
import { Clock, TrendingUp, Users, Briefcase, Target, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "転職お役立ち記事一覧｜20代の転職を成功させる｜出会えるエージェント",
  description: "20代の転職に役立つ記事をまとめました。年収アップ、ブラック企業回避、エージェント活用術など、転職成功のノウハウが満載。",
  keywords: "20代,転職,記事,ノウハウ,エージェント,年収アップ",
};

const articles = [
  {
    title: "初めての転職で年収90万UP！私が成功できた理由",
    slug: "20dai-first-tensyoku",
    category: "成功事例",
    icon: TrendingUp,
    color: "green",
    readTime: 5,
    description: "新卒3年目の私が、たった2ヶ月で年収90万円UPした実体験を公開",
  },
  {
    title: "20代で年収100万UPさせる人がやってること",
    slug: "20dai-nensyuu-up-himitsu",
    category: "年収アップ",
    icon: TrendingUp,
    color: "purple",
    readTime: 6,
    description: "同じ20代なのに年収180万円差。その秘密を暴露します",
  },
  {
    title: "転職エージェント選びで人生変わる話",
    slug: "20dai-agent-erabikata",
    category: "エージェント選び",
    icon: Users,
    color: "blue",
    readTime: 6,
    description: "エージェント選びを間違えると、ブラック企業に...選び方の極意",
  },
  {
    title: "ブラック企業を100%避ける転職術",
    slug: "20dai-black-kigyo-sakekata",
    category: "企業選び",
    icon: Target,
    color: "orange",
    readTime: 7,
    description: "友達が3ヶ月で辞めた理由。ブラック企業の見分け方を徹底解説",
  },
  {
    title: "2ヶ月で内定5社！爆速転職の裏技",
    slug: "20dai-saisoku-naishin",
    category: "転職ノウハウ",
    icon: Clock,
    color: "cyan",
    readTime: 6,
    description: "働きながら2ヶ月で内定5社。有給1日しか使わなかった方法",
  },
  {
    title: "転職エージェントは3社使わないと損",
    slug: "20dai-3sha-tsukaou",
    category: "エージェント活用",
    icon: Users,
    color: "teal",
    readTime: 6,
    description: "1社だけ？それ損してます。3社使うと年収+87万円",
  },
  {
    title: "1年前に転職してれば...後悔の話",
    slug: "20dai-1nen-go-koukai",
    category: "転職タイミング",
    icon: AlertCircle,
    color: "rose",
    readTime: 5,
    description: "先延ばしで110万円損した私。同じ後悔をしないで",
  },
  {
    title: "エージェントマッチングが必要な理由",
    slug: "20dai-agent-matching-hitsuyou",
    category: "エージェント選び",
    icon: Target,
    color: "violet",
    readTime: 5,
    description: "自分に合うエージェントを見つけることが転職成功の第一歩",
  },
  {
    title: "20代が今すぐ動くべき3つの理由",
    slug: "20dai-ima-ugoku-riyuu",
    category: "転職タイミング",
    icon: AlertCircle,
    color: "red",
    readTime: 5,
    description: "30代になる前に知っておきたい転職戦略",
  },
  {
    title: "年収300万円から脱出する転職戦略",
    slug: "20dai-nensyuu-300man-dasshutu",
    category: "年収アップ",
    icon: TrendingUp,
    color: "amber",
    readTime: 6,
    description: "低年収から抜け出せない理由と、確実に年収を上げる方法",
  },
  {
    title: "知らないと損する20代転職の真実",
    slug: "20dai-tensyoku-shiranai-to-son",
    category: "転職基礎",
    icon: AlertCircle,
    color: "red",
    readTime: 7,
    description: "転職市場の現実を知らずに動くと失敗します",
  },
  {
    title: "友達と年収を比較してはいけない理由",
    slug: "20dai-tomodachi-nensyuu-hikaku",
    category: "キャリア思考",
    icon: TrendingUp,
    color: "indigo",
    readTime: 5,
    description: "周りと比較して焦る前に、自分に合ったキャリアを",
  },
  {
    title: "在宅勤務を実現した20代の転職術",
    slug: "20dai-zaitaku-kinmu-jitsugen",
    category: "働き方改革",
    icon: Briefcase,
    color: "emerald",
    readTime: 6,
    description: "リモートワーク可能な企業への転職を成功させる方法",
  },
  {
    title: "30代の転職で使うべきエージェント",
    slug: "30dai-tensyoku-agent",
    category: "30代転職",
    icon: Users,
    color: "blue",
    readTime: 6,
    description: "30代の転職は戦略が必要。年齢に合わせたエージェント選び",
  },
  {
    title: "40代の転職成功マニュアル",
    slug: "40dai-tensyoku",
    category: "40代転職",
    icon: Briefcase,
    color: "purple",
    readTime: 7,
    description: "経験を活かしてキャリアアップ。40代だからこそできる転職戦略",
  },
  {
    title: "確実にキャリアアップする転職戦略",
    slug: "career-up-senryaku",
    category: "キャリアアップ",
    icon: TrendingUp,
    color: "green",
    readTime: 8,
    description: "年収も役職もスキルも上げる。戦略的なキャリアアップ転職",
  },
  {
    title: "第二新卒の転職完全ガイド",
    slug: "dainisinsotsu-tensyoku",
    category: "第二新卒",
    icon: Target,
    color: "cyan",
    readTime: 6,
    description: "新卒3年以内の転職はチャンス。第二新卒だからこそ成功する方法",
  },
  {
    title: "エンジニア転職市場の最新トレンド",
    slug: "engineer-tensyoku-shijou",
    category: "エンジニア転職",
    icon: Briefcase,
    color: "indigo",
    readTime: 7,
    description: "需要が高まるIT業界。エンジニアが知っておくべき転職市場の動向",
  },
  {
    title: "IT業界への未経験転職を成功させる方法",
    slug: "it-gyoukai-tensyoku",
    category: "業界転職",
    icon: Target,
    color: "teal",
    readTime: 7,
    description: "未経験からIT業界へ。成長業界へのキャリアチェンジを実現",
  },
  {
    title: "転職面接で絶対に落ちない対策",
    slug: "mensetsu-taisaku",
    category: "面接対策",
    icon: Users,
    color: "orange",
    readTime: 8,
    description: "面接通過率を劇的に上げる。プロが教える面接突破のテクニック",
  },
  {
    title: "未経験からのキャリアチェンジ成功法",
    slug: "mikeikeN-career-change",
    category: "キャリアチェンジ",
    icon: Target,
    color: "violet",
    readTime: 7,
    description: "異業種・異職種への転職を成功させる方法",
  },
  {
    title: "年収を最大化する転職テクニック",
    slug: "nensyuu-up-tensyoku",
    category: "年収アップ",
    icon: TrendingUp,
    color: "green",
    readTime: 8,
    description: "給与交渉から企業選びまで。年収アップを確実にする転職術",
  },
  {
    title: "大手企業vsベンチャー 転職するならどっち？",
    slug: "ootegigyo-venture-tensyoku",
    category: "企業選び",
    icon: Briefcase,
    color: "blue",
    readTime: 6,
    description: "それぞれのメリット・デメリットを徹底比較",
  },
  {
    title: "リモートワーク求人の探し方",
    slug: "remote-work-kyujin",
    category: "働き方改革",
    icon: Target,
    color: "emerald",
    readTime: 6,
    description: "在宅勤務を実現する。リモートワーク可能な優良企業の見つけ方",
  },
  {
    title: "受かる履歴書・職務経歴書の書き方",
    slug: "rirekisyo-syokumukeirekisyo",
    category: "応募書類",
    icon: AlertCircle,
    color: "amber",
    readTime: 8,
    description: "書類選考通過率90%以上。プロが教える応募書類作成のコツ",
  },
  {
    title: "転職エージェントを最大活用する方法",
    slug: "tensyoku-agent-katsuyou",
    category: "エージェント活用",
    icon: Users,
    color: "teal",
    readTime: 7,
    description: "登録するだけでは意味がない。エージェントを使い倒す具体的なテクニック",
  },
  {
    title: "転職に最適なタイミングの見極め方",
    slug: "tensyoku-timing",
    category: "転職タイミング",
    icon: Clock,
    color: "rose",
    readTime: 6,
    description: "いつ転職すべき？求人が増える時期とベストタイミング",
  },
  {
    title: "ベンチャー企業への転職で成功する方法",
    slug: "venture-tensyoku",
    category: "ベンチャー転職",
    icon: Target,
    color: "purple",
    readTime: 7,
    description: "成長企業で活躍したい人へ。ベンチャー転職のリアルと成功の秘訣",
  },
];

const colors = {
  green: "from-green-500 to-green-400",
  blue: "from-blue-500 to-blue-400",
  purple: "from-purple-500 to-purple-400",
  red: "from-red-500 to-red-400",
  orange: "from-orange-500 to-orange-400",
  indigo: "from-indigo-500 to-indigo-400",
  teal: "from-teal-500 to-teal-400",
  cyan: "from-cyan-500 to-cyan-400",
  amber: "from-amber-500 to-amber-400",
  rose: "from-rose-500 to-rose-400",
  emerald: "from-emerald-500 to-emerald-400",
  violet: "from-violet-500 to-violet-400",
};

export default function ArticlesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50">
      {/* ヘッダー */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/gt/lp01deaeru/1" className="flex items-center gap-2">
              <img
                src="/deaeru-logo.png"
                alt="出会えるエージェント"
                className="h-8 w-auto"
              />
            </Link>
            <Link
              href="/gt/lp01deaeru/1"
              className="rounded-lg bg-gradient-to-r from-green-500 to-green-400 px-6 py-2 text-sm font-bold text-white transition hover:shadow-md"
            >
              無料診断をはじめる
            </Link>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* ヒーローセクション */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            20代の転職を成功させる<br />
            お役立ち記事
          </h1>
          <p className="text-lg text-gray-600">
            年収アップ、ホワイト企業への転職、エージェント活用術など<br />
            20代の転職成功に必要な情報が満載
          </p>
        </div>

        {/* CTAバナー */}
        <div className="mb-12 overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white shadow-xl">
          <div className="text-center">
            <p className="mb-2 text-sm font-semibold opacity-90">
              \ あなたにピッタリのエージェントを診断 /
            </p>
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">
              たった30秒で、転職成功への第一歩
            </h2>
            <Link
              href="/gt/lp01deaeru/1"
              className="inline-flex items-center gap-2 rounded-full bg-white px-10 py-4 font-bold text-green-600 shadow-lg transition hover:scale-105"
            >
              無料診断をはじめる
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="mt-4 text-sm opacity-90">
              ※完全無料・しつこい営業なし・LINE対応
            </p>
          </div>
        </div>

        {/* 記事一覧 */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => {
            const Icon = article.icon;
            return (
              <Link
                key={index}
                href={`/gt/lp01deaeru/articles/${article.slug}`}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg hover:border-green-300"
              >
                <div className={`h-2 bg-gradient-to-r ${colors[article.color as keyof typeof colors]}`} />
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className={`inline-block rounded-full bg-gradient-to-r ${colors[article.color as keyof typeof colors]} px-3 py-1 text-xs font-bold text-white`}>
                      {article.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{article.readTime}分</span>
                    </div>
                  </div>
                  <h3 className="mb-3 text-lg font-bold text-gray-900 group-hover:text-green-600 transition line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="mb-4 text-sm text-gray-600 line-clamp-2">
                    {article.description}
                  </p>
                  <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                    <span>記事を読む</span>
                    <svg className="h-4 w-4 transition group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* 下部CTA */}
        <div className="mt-16 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 p-8 md:p-12 text-white shadow-2xl">
          <div className="text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              記事を読んだら、<br />
              次は行動しよう
            </h2>
            <p className="mb-8 text-lg opacity-95">
              あなたにピッタリのエージェント3社を、<br />
              たった30秒で見つけられます
            </p>
            <Link
              href="/gt/lp01deaeru/1"
              className="inline-flex items-center gap-3 rounded-full bg-white px-12 py-5 text-xl font-bold text-purple-600 shadow-2xl transition hover:scale-105 hover:bg-gray-50"
            >
              無料診断をはじめる
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <div className="mt-6 grid gap-3 text-sm md:grid-cols-3">
              <div className="rounded-lg bg-white/20 p-3 backdrop-blur-sm">
                <p className="font-bold">平均年収UP</p>
                <p className="text-2xl font-bold">+87万円</p>
              </div>
              <div className="rounded-lg bg-white/20 p-3 backdrop-blur-sm">
                <p className="font-bold">利用者満足度</p>
                <p className="text-2xl font-bold">94%</p>
              </div>
              <div className="rounded-lg bg-white/20 p-3 backdrop-blur-sm">
                <p className="font-bold">転職成功率</p>
                <p className="text-2xl font-bold">94%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
