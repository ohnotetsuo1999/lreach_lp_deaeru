import { type Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "../_components/ArticleLayout";
import {
  InsightCard,
  StatsBox,
  StepCard,
  CheckList,
  TestimonialCard,
  InlineCTA,
  AlertBox,
  ComparisonTable,
} from "../_components/ArticleComponents";
import { TrendingUp, Users, Zap, Heart, Clock, DollarSign, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "【20代必見】初めての転職で年収90万UP！私が成功できた理由｜出会えるエージェント",
  description: "新卒3年目、職歴なしの私が初めての転職で年収90万アップ。転職エージェント選びを間違えなければ、20代の転職は絶対に成功します。",
  keywords: "20代,転職,初めて,年収アップ,転職エージェント,第二新卒",
  openGraph: {
    title: "【20代必見】初めての転職で年収90万UP！私が成功できた理由",
    description: "新卒3年目、職歴なしの私が初めての転職で年収90万アップした理由を公開します。",
    type: "article",
  },
};

export default function Article() {
  const relatedArticles = [
    {
      title: "20代で年収100万UPさせる人がやってること",
      slug: "20dai-nensyuu-up-himitsu",
      category: "年収アップ",
    },
    {
      title: "転職エージェント選びで人生変わる話",
      slug: "20dai-agent-erabikata",
      category: "エージェント活用",
    },
    {
      title: "ブラック企業を100%避ける転職術",
      slug: "20dai-black-kigyo-sakekata",
      category: "企業選び",
    },
    {
      title: "2ヶ月で内定5社！爆速転職の裏技",
      slug: "20dai-saisoku-naishin",
      category: "転職ノウハウ",
    },
  ];

  return (
    <ArticleLayout
      title="初めての転職で年収90万UP！私が成功できた理由"
      category="20代転職成功事例"
      readTime={5}
      publishedDate="2026年1月29日"
      relatedArticles={relatedArticles}
    >
      <header className="mb-12">
        <h1 className="mb-6 text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
          新卒3年目で職歴のない私でも<br />
          年収90万UPの転職に成功した理由
        </h1>
        <p className="text-lg leading-relaxed text-gray-600">
          25歳、転職活動って何から始めればいいかわからなかった私が、
          たった2ヶ月で理想の会社に転職できた話
        </p>
      </header>

      {/* アイキャッチビジュアル */}
      <div className="my-10 overflow-hidden rounded-2xl bg-gradient-to-br from-green-100 via-emerald-50 to-blue-100 p-8 md:p-12">
        <div className="flex flex-col items-center justify-center gap-8 md:flex-row">
          <div className="flex-1">
            <img
              src="/Selecting-team-bro.svg"
              alt="転職成功"
              className="mx-auto h-56 w-auto"
            />
          </div>
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <StatsBox label="年収UP" value="+90万円" change="31%アップ" />
              <StatsBox label="転職期間" value="2ヶ月" />
            </div>
            <div className="rounded-xl bg-white p-4 shadow-md">
              <div className="flex items-center gap-3">
                <Heart className="h-6 w-6 text-red-500" />
                <div>
                  <p className="text-sm text-gray-600">満足度</p>
                  <p className="text-2xl font-bold text-gray-900">100%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">
          突然ですが、あなたは今の会社で働き続けたいですか？
        </h2>
        
        <AlertBox type="danger">
          <div>
            <p className="mb-4 text-lg font-bold">こんな悩み、ありませんか？</p>
            <CheckList
              type="danger"
              items={[
                "3年働いているのに給料が一切上がらない",
                "毎日やりがいがなくて「早く仕事辞めたい」と思っている",
                "このまま30代になったら転職できなくなりそうで不安",
                "転職したいけど、何から始めればいいかわからない",
                "友達が転職で年収上がったって聞いて焦ってる",
              ]}
            />
          </div>
        </AlertBox>

        <p className="mt-6 leading-relaxed text-gray-700">
          実は<strong className="font-bold text-red-600">約3ヶ月前まで</strong>、
          今の職場に不満があって転職したいってずっと思っていたのに、
          <strong className="font-bold">1年以上も転職から目を背けていた</strong>、
          ただの会社員だった私（25歳）。
        </p>

        <p className="mt-4 leading-relaxed text-gray-700">
          でも、ある転職相談がきっかけで...
        </p>

        <div className="my-8 overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white shadow-2xl">
          <div className="mb-6 text-center">
            <p className="mb-2 text-sm font-semibold opacity-90">転職成功！</p>
            <h3 className="text-3xl font-bold">人生が変わりました 🎉</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-white/20 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5" />
                <p className="text-sm font-semibold">年収</p>
              </div>
              <p className="text-2xl font-bold">290万円 → 380万円</p>
              <p className="text-sm opacity-90">(+90万円)</p>
            </div>
            <div className="rounded-xl bg-white/20 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5" />
                <p className="text-sm font-semibold">働き方</p>
              </div>
              <p className="text-lg font-bold">立ち仕事 → 事務</p>
              <p className="text-sm opacity-90">(週1〜2在宅)</p>
            </div>
            <div className="rounded-xl bg-white/20 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5" />
                <p className="text-sm font-semibold">やりがい</p>
              </div>
              <p className="text-lg font-bold">毎日が楽しい！</p>
              <p className="text-sm opacity-90">(充実度MAX)</p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-lg font-bold leading-relaxed text-gray-800">
          「この会社でずっと働きたい！」と本気で思える、
          自分の価値観に合った会社に転職できました😭✨
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">
          転職したいけど...何もできなかった1年間
        </h2>
        
        <p className="mb-6 leading-relaxed text-gray-700">
          正直に言います。私、
          <strong className="font-bold text-red-600">転職サイトに10個以上登録してるのに、
          1年以上も何もしてませんでした。</strong>
        </p>

        <InsightCard type="warning">
          <div>
            <p className="mb-4 font-bold text-lg">なぜ動けなかったか？</p>
            <ul className="space-y-2 text-sm">
              <li>❌ 転職エージェントって、どれ使えばいいかわからない</li>
              <li>❌ 登録したら営業電話がしつこそうで怖い</li>
              <li>❌ 職務経歴書の書き方がわからない</li>
              <li>❌ 面接とか絶対無理...落とされたらどうしよう</li>
              <li>❌ 今の仕事しながら転職活動とか時間ないし...</li>
            </ul>
          </div>
        </InsightCard>

        <p className="mt-6 leading-relaxed text-gray-700">
          そんな時、仲良かった同期から突然...
        </p>

        <div className="my-8 rounded-xl border-2 border-blue-300 bg-blue-50 p-6">
          <div className="mb-3 flex items-center gap-2">
            <div className="rounded-full bg-blue-500 px-3 py-1">
              <p className="text-xs font-bold text-white">同期からのLINE</p>
            </div>
          </div>
          <div className="space-y-2 text-gray-800">
            <p className="font-semibold">「転職先決まった！🎉」</p>
            <p>「今より給料15万高くて、残業ほぼ0だよ！」</p>
            <p>「まじで転職してよかった〜」</p>
          </div>
        </div>

        <p className="mt-6 text-xl font-bold leading-relaxed text-gray-900">
          この瞬間、<span className="text-red-600">「私も転職したい...!!!」</span>
          って強く思いました。
        </p>

        <p className="mt-4 leading-relaxed text-gray-700">
          でもそれ以上に、<br />
          「私の職歴じゃ年収UPなんて無理そう...」<br />
          「転職活動の最初の1歩が踏み出せない...」<br />
          そんな気持ちが強かったんです。
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">
          インスタで見つけた「出会えるエージェント」が人生変えた
        </h2>
        
        <p className="mb-6 leading-relaxed text-gray-700">
          そんな時、インスタを見ていてパッと目についたのが、
          <strong className="font-bold text-green-600">「出会えるエージェント」</strong>
          という転職サービスでした。
        </p>

        <div className="my-8 overflow-hidden rounded-2xl border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="bg-green-600 px-6 py-3">
            <p className="font-bold text-white">普通の転職エージェントと何が違うの？</p>
          </div>
          <div className="p-6">
            <p className="mb-4 leading-relaxed text-gray-800">
              一般的な転職エージェントじゃなくて、
              <strong className="font-bold text-green-700">自分の転職条件や価値観に合った転職エージェントを
              3社紹介してくれる</strong>サービスなの！
            </p>
            <p className="rounded-lg bg-white p-4 text-sm text-gray-700 shadow-sm">
              💡 つまり、「エージェント選び」を失敗しないためのサービス！
            </p>
          </div>
        </div>

        <h3 className="mb-4 mt-10 text-xl font-bold text-gray-900">
          なぜ3社も必要なの？
        </h3>

        <p className="mb-6 leading-relaxed text-gray-700">
          実は転職エージェントにも、
          <strong className="font-bold text-red-600">当たり外れとか、合う合わない</strong>
          があるんです。知ってましたか？
        </p>

        <ComparisonTable
          items={[
            {
              label: "求人の選択肢",
              before: "10〜20件程度",
              after: "30〜60件（3倍！）",
            },
            {
              label: "担当者の相性",
              before: "外れたら終わり",
              after: "3人から選べる",
            },
            {
              label: "年収交渉",
              before: "してくれない",
              after: "+10〜50万円UP",
            },
            {
              label: "ブラック企業",
              before: "紹介されることも",
              after: "優良企業だけ",
            },
          ]}
        />
      </section>

      <InlineCTA text="たった30秒で、あなたに合うエージェント3社が見つかります" />

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">
          20代の転職は「今すぐ」始めないと損する理由
        </h2>
        
        <p className="mb-6 leading-relaxed text-gray-700">
          実は、私が転職大成功できたのは、
          <strong className="font-bold text-red-600">経験が良かったからでも、資格があったからでもありません。</strong>
        </p>

        <div className="my-8 rounded-2xl bg-gradient-to-br from-pink-100 to-rose-50 p-8 text-center border-2 border-pink-300 shadow-lg">
          <p className="mb-2 text-lg text-gray-700">ただ</p>
          <p className="text-4xl font-bold text-red-600 md:text-5xl">「20代前半」</p>
          <p className="mt-2 text-lg text-gray-700">だったからなんです。</p>
          <p className="mt-4 text-sm text-gray-600">（採用担当の人に直接言われました。笑）</p>
        </div>

        <div className="my-10 space-y-6">
          <div className="rounded-xl border-l-4 border-pink-500 bg-gradient-to-r from-pink-50 to-pink-25 p-6 shadow-sm">
            <div className="mb-3 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-500 text-white font-bold">
                1
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-xl font-bold text-pink-900">
                  未経験でもポテンシャル採用される
                </h3>
                <p className="mb-3 text-gray-700">
                  30代になると「即戦力」が求められるけど、
                  <strong className="font-bold text-pink-700">20代なら「これからの成長」で判断される！</strong><br />
                  つまり、未経験の職種にもチャレンジできる最後のチャンス。
                </p>
                <div className="rounded-lg bg-white p-3 text-xs text-pink-800">
                  💡 実際、私も事務経験ゼロだったけど、
                  「若いから吸収力がある」って理由で採用されました！
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-blue-25 p-6 shadow-sm">
            <div className="mb-3 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white font-bold">
                2
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-xl font-bold text-blue-900">
                  求人がめちゃくちゃ多い
                </h3>
                <p className="mb-3 text-gray-700">
                  30代以降に比べて、<strong className="font-bold text-blue-700">20代向けの求人数は約3倍！</strong><br />
                  選択肢が多いから、好条件の会社を見つけやすい。
                </p>
                <div className="rounded-lg bg-white p-3 text-xs text-blue-800">
                  💡 私の場合、3社のエージェントから合計50件以上の求人を紹介してもらえました。
                  その中から、本当に自分に合う会社を選べた！
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border-l-4 border-green-500 bg-gradient-to-r from-green-50 to-green-25 p-6 shadow-sm">
            <div className="mb-3 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500 text-white font-bold">
                3
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-xl font-bold text-green-900">
                  年収アップのチャンスが超多い
                </h3>
                <p className="mb-3 text-gray-700">
                  業績の良い人材不足の会社なら、
                  <strong className="font-bold text-green-700">同じ業務内容でも環境を変えるだけで給料が上がる！</strong>
                </p>
                <div className="rounded-lg bg-white p-3 text-xs text-green-800">
                  💡 私の年収90万UPも、スキルが上がったわけじゃなくて、
                  単純に「人材不足で困ってる成長企業」を選んだから。
                  エージェントが年収交渉もしてくれたおかげです！
                </div>
              </div>
            </div>
          </div>
        </div>

        <AlertBox type="danger">
          <div>
            <p className="mb-4 text-xl font-bold">⚠️ 注意！</p>
            <p className="mb-3 font-semibold">
              25歳と29歳では、転職市場の扱いが全然違います。
            </p>
            <p className="text-sm">
              実際、エージェントの人に聞いたら、
              「27歳を過ぎると急に求人が減る」「30歳超えると未経験職種は厳しい」って。
            </p>
            <div className="mt-4 rounded-lg bg-white p-4">
              <p className="text-center font-bold text-lg text-red-700">
                だから、少しでも転職を考えているなら、<br />
                <span className="text-xl">今すぐ動かないと本当に損します。</span>
              </p>
            </div>
          </div>
        </AlertBox>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">
          「出会えるエージェント」を使わないと損する3つの理由
        </h2>
        
        <div className="my-8 space-y-6">
          <div className="rounded-xl border-2 border-yellow-300 bg-yellow-50 p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-bold text-yellow-900">
              1. エージェント選びで転職の90%が決まる
            </h3>
            <p className="mb-4 leading-relaxed text-gray-700">
              正直、<strong className="font-bold">どのエージェントを使うかで、
              紹介される求人も、年収交渉の結果も、全然変わります。</strong>
            </p>
            <p className="mb-4 text-sm text-gray-600">
              私の友達は、大手の転職サイトだけ使って転職したけど、
              年収は上がらず、しかも入社してみたらブラック企業で半年で辞めてました...
            </p>
            <div className="rounded-lg bg-white p-4 border border-yellow-200">
              <p className="text-sm font-bold text-yellow-800">
                ✓ 「出会えるエージェント」なら、自分に合うエージェントだけが見つかるから、
                ミスマッチが起きない！
              </p>
            </div>
          </div>

          <div className="rounded-xl border-2 border-purple-300 bg-purple-50 p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-bold text-purple-900">
              2. 完全無料なのに、有料級のサポート
            </h3>
            <p className="mb-4 leading-relaxed text-gray-700">
              <strong className="font-bold">職務経歴書の添削、面接対策、年収交渉、全部やってくれます。</strong>
            </p>
            <div className="rounded-lg bg-white p-4 border border-purple-200">
              <p className="mb-3 text-sm font-bold text-purple-900">私が受けたサポート：</p>
              <CheckList
                type="success"
                items={[
                  "職務経歴書をプロが添削（2時間かけて一緒に作成）",
                  "模擬面接を3回実施（おかげで本番は余裕でした）",
                  "年収交渉を代行（+20万円上乗せしてくれた！）",
                  "面接日程の調整（働きながらでも全然大変じゃなかった）",
                ]}
              />
              <p className="mt-4 text-center text-sm font-bold text-purple-800">
                → これ全部無料って、正直ヤバくないですか？<br />
                使わない理由がない。
              </p>
            </div>
          </div>

          <div className="rounded-xl border-2 border-green-300 bg-green-50 p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-bold text-green-900">
              3. 時間の無駄を徹底的に省ける
            </h3>
            <p className="mb-4 leading-relaxed text-gray-700">
              働きながら転職活動って、<strong className="font-bold">マジで時間ない</strong>ですよね。
            </p>
            <p className="mb-4 text-sm text-gray-600">
              「出会えるエージェント」使えば、
              自分で求人を探す必要なし、応募書類も一緒に作ってくれる、
              面接日程も調整してくれる。
            </p>
            <div className="rounded-lg bg-white p-4 border border-green-200">
              <p className="text-sm font-bold text-green-800">
                ✓ 私、仕事終わりと土日だけで、2ヶ月で転職決まりました。<br />
                有給も1日しか使ってない！
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">
          実際の転職活動スケジュール【2ヶ月で内定】
        </h2>
        
        <div className="my-8 space-y-4">
          <StepCard
            number={1}
            title="Week 1-2：エージェント面談"
            description="「出会えるエージェント」で紹介された3社と面談。希望条件を伝えたら、すぐに求人を紹介してくれた。"
          />
          <StepCard
            number={2}
            title="Week 3-4：書類作成・応募"
            description="職務経歴書をエージェントと一緒に作成。10社に応募して、8社から書類選考通過！"
          />
          <StepCard
            number={3}
            title="Week 5-6：面接"
            description="模擬面接のおかげで、本番は全然緊張しなかった。8社中5社から内定！"
          />
          <StepCard
            number={4}
            title="Week 7-8：条件交渉・内定承諾"
            description="エージェントが年収交渉してくれて、+20万円アップ！最終的に年収380万円の内定を承諾。"
          />
        </div>

        <p className="mt-8 text-center text-2xl font-bold text-gray-900">
          たった<span className="text-green-600">2ヶ月</span>で、人生変わりました。
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">
          最後に...転職を迷っているあなたへ
        </h2>
        
        <p className="mb-6 leading-relaxed text-gray-700">
          正直、3ヶ月前の私も、
          「転職活動って大変そう」「今のままでもいいかな」って思ってました。
        </p>

        <p className="mb-6 text-xl font-bold text-gray-900">
          でも、<span className="text-red-600">1年後、2年後の自分を想像してみてください。</span>
        </p>

        <div className="my-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-gray-100 p-6 shadow-sm">
            <p className="mb-4 text-center font-bold text-gray-800">
              このまま何もしなかったら...
            </p>
            <CheckList
              type="danger"
              items={[
                "給料は上がらず、同じ年収のまま30代に",
                "気づいたら転職のタイミングを逃してる",
                "友達は次々と年収上げて転職してるのに、自分だけ取り残される",
                "「あの時転職しておけば...」って後悔する",
              ]}
            />
          </div>

          <div className="rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 p-6 border-2 border-green-300 shadow-md">
            <p className="mb-4 text-center font-bold text-green-800">
              今すぐ行動すれば...
            </p>
            <CheckList
              type="success"
              items={[
                "年収が上がって、生活に余裕ができる",
                "やりがいのある仕事で、毎日が楽しくなる",
                "働き方が改善されて、プライベートも充実",
                "「転職して本当によかった」って心から思える",
              ]}
            />
          </div>
        </div>

        <p className="my-8 text-center text-2xl font-bold text-gray-900 md:text-3xl">
          どっちの未来を選びますか？
        </p>

        <InsightCard type="success">
          <div>
            <p className="mb-4 font-bold text-lg">「出会えるエージェント」は完全無料</p>
            <p className="mb-3 text-sm">
              たった30秒で登録できて、リスクは一切ありません。
            </p>
            <p className="text-sm">
              <strong className="font-bold text-green-700">20代の今だからこそ、チャンスがたくさんあります。</strong><br />
              30歳になってから「あの時やっておけば...」って後悔しないために。
            </p>
          </div>
        </InsightCard>

        <p className="mt-6 text-center text-xl font-bold text-gray-900">
          今すぐ、最初の一歩を踏み出しましょう！
        </p>
      </section>

      <div className="my-12 overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 p-8 md:p-12 text-white shadow-2xl">
        <div className="text-center">
          <div className="mb-6">
            <div className="mb-2 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-bold backdrop-blur-sm">
              完全無料・30秒で完了
            </div>
          </div>
          <h3 className="mb-4 text-3xl font-bold md:text-4xl">
            あなたにぴったりのエージェント3社を<br />
            今すぐ見つけよう！
          </h3>
          <p className="mb-8 text-lg opacity-95">
            年収アップ、ホワイト企業への転職を実現。<br />
            20代の転職成功率94%の実績
          </p>
          <Link
            href="/gt/lp01deaeru/1"
            className="inline-flex items-center gap-3 rounded-full bg-white px-12 py-5 text-xl font-bold text-green-600 shadow-2xl transition hover:scale-105 hover:bg-gray-50"
          >
            無料診断をはじめる
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" />
              しつこい営業電話なし
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" />
              相談だけでもOK
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" />
              転職するかは後で決められます
            </span>
          </div>
        </div>
      </div>

      <div className="my-8 rounded-xl bg-yellow-50 border-2 border-yellow-400 p-6">
        <p className="text-center font-bold mb-4 text-lg text-yellow-900">
          \ 20代のあなたへ /
        </p>
        <p className="text-sm text-center text-gray-700 leading-relaxed">
          この記事を読んでくれたあなたは、<br />
          すでに「変わりたい」って気持ちがあるはず。<br />
          <br />
          その気持ちを行動に変えるだけで、<br />
          人生は本当に変わります。<br />
          <br />
          私がそうだったように。<br />
          <br />
          一緒に、理想の未来を掴みましょう！✨
        </p>
      </div>
    </ArticleLayout>
  );
}
