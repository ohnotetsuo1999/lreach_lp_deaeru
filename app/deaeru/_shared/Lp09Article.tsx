"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Script from "next/script";
import { useRouter, useSearchParams } from "next/navigation";

import { useLpActionStatistics } from "./useLpActionStatistics";

const GTM_ID = "GTM-W7S9ZNV8";
const REFERRER_STORAGE_KEY = "deaeru_lp_referrer_url";
const P = "/deaeru-lp09"; // 画像プレフィックス

const buildReferrerUrl = (url: string, lpKey: string) => {
  try {
    const parsedUrl = new URL(url);
    if (!parsedUrl.searchParams.has("lp")) {
      parsedUrl.searchParams.set("lp", lpKey);
    }
    return parsedUrl.toString();
  } catch {
    return url;
  }
};

interface Props {
  /** 行動計測用のLPキー（例: deaeru-lp09a） */
  lpKey: string;
  /** CTA押下時の遷移先（本LP）。id を含むパスを渡す（例: /deaeru/lp08f/xxxx）。 */
  ctaHref: string;
}

/**
 * 記事型LP（フォームなし）。参考LP https://baku-geki.com/deaeru-2-1/ を忠実に再現。
 * 会話吹き出し・非公開求人スライダー・複数の画像CTAバナーで構成し、
 * CTAバナー押下で本LP（lp08f 等）へ id とクエリを引き継いで遷移する。
 *
 * スタイルは参考LPの実測値に合わせている:
 * - 本文ブロック: 14px / font-weight 500 / line-height 1.65 / 中央寄せ / 余白は各ブロックのpadding
 * - 見出しh3: 20px / 太字 / 中央寄せ
 * - 吹き出し: わたし=#ffe0e0(左) / 友達=#d6ebff(右)、下マージン40px、太字
 * - マーカー: 黄系背景 + 一部は赤文字。赤/緑背景は白文字
 * - CTAバナー: 出現時バウンスイン + ゆっくりズーム（sme-animation-bounce-in / zoom-cta 相当）
 */
export function Lp09Article({ lpKey, ctaHref }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // LP行動集計シートへの行動計測（滞在時間・スクロール率・CTAクリック）。
  // 2026-07-24 追加: lp09系はこのビーコンが未実装で閲覧数がシートに記録されていなかった。
  const { markCtaClicked } = useLpActionStatistics(lpKey);

  // 1個目のインラインCTAが一度でも画面に入ったら、以降ページ末尾まで
  // 画面下部にフローティングCTAを固定表示する（消さない）。
  const [showFloatingCta, setShowFloatingCta] = useState(false);
  const handleFirstCtaShow = useCallback(() => setShowFloatingCta(true), []);
  // 最終CTAが画面内にある間はフローティングを隠す（重なり防止）
  const [lastCtaVisible, setLastCtaVisible] = useState(false);
  const handleLastCtaVisibility = useCallback(
    (visible: boolean) => setLastCtaVisible(visible),
    []
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(
        REFERRER_STORAGE_KEY,
        buildReferrerUrl(window.location.href, lpKey)
      );
    } catch {
      // localStorage が使えない場合は何もしない
    }
  }, [lpKey]);

  const handleCtaClick = () => {
    markCtaClicked(); // 行動集計のCTAクリック記録（遷移前に必ず呼ぶ）
    const query = searchParams.toString();
    const href = query
      ? `${ctaHref}${ctaHref.includes("?") ? "&" : "?"}${query}`
      : ctaHref;
    router.push(href);
  };

  return (
    <div className="min-h-screen bg-white text-[#1e1e1e] overflow-x-hidden">
      <Script id="deaeru-gtm" strategy="afterInteractive">{`
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');
      `}</Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>

      {/* styled-jsx は App Router で SSR されないため、プレーンな style タグで注入する */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
/* 参考LP(WordPress)の block-gap 相当: 全ブロック間に最低24pxの余白 */
.lp09-article > * + * { margin-top: 24px; }
/* 下矢印: 常時上下バウンス（参考LP .bounce-arrow） */
@keyframes lp09-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(10px); }
}
.lp09-bounce-arrow {
  text-align: center;
  font-size: 40px;
  color: rgb(30, 30, 30);
  animation: lp09-bounce 1.5s infinite;
}
/* CTA: 出現時バウンスイン → ゆっくりズームを繰り返す */
@keyframes lp09-cta-in {
  0% { opacity: 0; transform: scale(0.3); }
  50% { opacity: 1; transform: scale(1.05); }
  70% { transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes lp09-cta-zoom {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.04); }
}
.lp09-cta-zoom {
  animation:
    lp09-cta-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) both,
    lp09-cta-zoom 1.6s ease-in-out 0.8s infinite;
}
`,
        }}
      />

      {/* 参考LP実測: コンテンツ(画像)最大幅620px / 左右10px / 上20px。
          下は固定フローティングCTAと重ならないよう余白を確保する。 */}
      <div className="lp09-article relative mx-auto w-full max-w-[640px] px-[10px] pt-5 pb-32">
        {/* FV */}
        <img className="block w-full" src={`${P}-fv.png`} alt="1年目から年収600万超え 超ホワイト企業に内定" />
        <img className="block w-full" src={`${P}-fv2.png`} alt="ゆるっと正社員で年収600万円 未経験・フリーランス・第二新卒大歓迎" />

        {/* これは私の実体験です */}
        <H3>これは私の実体験です</H3>
        <div className="mb-6 lp09-bounce-arrow">⬇️　⬇️　⬇️</div>

        {/* 会話1〜2 */}
        <Balloon side="left" avatar={`${P}-avatar-me.png`} name="わたし">
          うちの職場ほんとブラック！💢<br />
          <Mk bg="#fff761">給料低いのに残業ばっかだし</Mk>、土日も出勤多くて最悪😭
        </Balloon>
        <Balloon side="right" avatar={`${P}-avatar-friend.png`} name="友達">
          私もだよ笑。ボーナスもないし上司もウザいし。<br />
          <Mk bg="#f5f124" color="#fe2020">土日休みでゆる〜く稼げるホワイトな会社に転職したいよね〜！</Mk>
        </Balloon>

        {/* 今の仕事辞めたい画像 → 1ヶ月後（中央）→ 会話 */}
        <img className="block w-full" src={`${P}-naitei1.png`} alt="今の仕事、辞めたい" />
        <H3>1ヶ月後･･･</H3>

        <Balloon side="left" avatar={`${P}-avatar-me.png`} name="わたし">
          ねえみて！<br />
          <Mk bg="#fffc66">超ホワイト企業から内定もらえた！</Mk><br />
          <Mk bg="#fffc66" color="#ff2929">土日休みで残業なし</Mk>、しかも<Mk bg="#fffc66" color="#ff2929">1年目から年収600万！</Mk>
        </Balloon>
        <img className="block w-full" src={`${P}-naitei2.png`} alt="内定報告に驚く友達" />
        <Balloon side="right" avatar={`${P}-avatar-friend.png`} name="友達">
          えええ！もう内定出たの！？<br />
          しかも高待遇だし。<br />
          私転職エージェント使ってるけどそんな良い求人なかったよ？？
        </Balloon>

        {/* エージェント紹介 */}
        <Balloon side="left" avatar={`${P}-avatar-me.png`} name="わたし">
          実は転職エージェントには<br />
          <Mk bg="#fffc66" color="#ff2929">&ldquo;当たり外れ&rdquo;</Mk>があるらしいから、<br />
          <Mk bg="#fffc66" color="#ff2929">自分に合ったエージェントを紹介してくれるサービスを使ったの！</Mk><br />
          それが「出会えるエージェント」
        </Balloon>
        <img className="block w-full" src={`${P}-pro.png`} alt="転職のプロが紹介" />
        <Balloon side="left" avatar={`${P}-avatar-me.png`} name="わたし">
          求人サイトには載っていない<br />
          <Mk bg="#fffc66" color="#ff2929">&ldquo;未経験でも年収600万超え&rdquo;の「隠れホワイト企業」</Mk>を<br />
          転職のプロが紹介してくれるの！
        </Balloon>

        {/* 非公開求人スライダー */}
        <H3>＼未経験歓迎の高待遇求人がこんなに／</H3>
        <Slider
          images={[`${P}-slide1.png`, `${P}-slide2.png`, `${P}-slide3.png`, `${P}-slide4.png`]}
        />
        <Body pad={20}>↑スワイプで確認↑</Body>

        {/* 会話 */}
        <Balloon side="right" avatar={`${P}-avatar-friend.png`} name="友達">
          <Mk bg="#fffc66">高待遇の非公開求人</Mk>ってこんなにあるんだ！<br />
          でも、こんな良い会社に採用されるか心配・・・
        </Balloon>
        <img className="block w-full" src={`${P}-support.png`} alt="手厚いサポート" />
        <Balloon side="left" avatar={`${P}-avatar-me.png`} name="わたし">
          大丈夫！ここで紹介してくれたエージェントなら、<br />
          <Mk bg="#fffc66" color="#ff2929">書類作成や面接対策もしてくれて</Mk><br />
          自分で就活するより<br />
          <Mk bg="#fffc66" color="#ff2929">圧倒的に採用されやすいの！</Mk>
        </Balloon>
        <Balloon side="right" avatar={`${P}-avatar-friend.png`} name="友達">
          これだけサポートしてくれるのに<br />
          <Mk bg="#fffc66">完全無料</Mk>ってホント！？<br />
          私も「出会えるエージェント」登録してみよ！
        </Balloon>
        <Balloon side="left" avatar={`${P}-avatar-me.png`} name="わたし">
          給料交渉もやってくれるし<br />
          自分で就活するよりも断然オススメだよ！
        </Balloon>

        {/* 年収UP */}
        <H3>＼出会えるエージェントで年収UP！！／</H3>
        <img className="block w-full" src={`${P}-nenshu1.png`} alt="年収UP体験1" />
        <img className="block w-full" src={`${P}-nenshu2.png`} alt="年収UP体験2" />
        <img className="block w-full" src={`${P}-nenshu3.png`} alt="年収UP体験3" />

        {/* CTA①（この最初のCTAが見えたらフローティングCTAを起動する） */}
        <CtaBanner onClick={handleCtaClick} onFirstShow={handleFirstCtaShow} />

        {/* 転職を考えている方へ（参考LP: 白背景・黒太字・中央のblockquote） */}
        <div className="my-6 text-center text-[15px] font-bold leading-relaxed">
          転職を考えている方へ<br />
          失敗する人の共通点を知っていますか？
        </div>

        <img className="block w-full" src={`${P}-fail1.png`} alt="転職活動で失敗する人の共通点" />
        <Body pad={20}>
          多くの人が転職しようと思ったら<br />
          <B>求人サイト</B>に登録して<br />
          <B>自分で良い求人</B>を見つけようとするけど<br />
          <br />
          実は多くの求人サイトは<br />
          <C c="#2a00ff">隠れブラック企業が多くて</C><br />
          <C c="#ff0000">危険なんです💦</C>
        </Body>
        <img className="block w-full" src={`${P}-fail2.png`} alt="転職エージェントの仕組み" />
        <Body pad={20}>
          だから最近は<br />
          <B>転職エージェント</B>使う人が<br />
          増えてきてるんだけど
        </Body>
        <Body pad={0}>
          転職エージェントって<br />
          <C c="#1500ff">紹介した企業から</C><br />
          <C c="#1500ff">手数料をもらう仕組みだから</C><br />
          <br />
          <B>悪徳なエージェント</B>に登録すると<br />
          <C c="#ff0000">求職者の条件を無視して<br />合わない企業ばっかり</C><br />
          <C c="#ff0000">紹介されることも💦</C>
        </Body>
        <img className="block w-full" src={`${P}-fail3.png`} alt="優良なエージェントに出会う" />
        <Body pad={20}>
          だからこそ<br />
          <B>転職を成功させる</B>ために<br />
          <B>一番大事</B>なのは<br />
          <br />
          <Mk bg="#ff0000" color="#ffffff">あなたの希望条件に<br />寄り添ってくれる<br />優良なエージェントに出会うこと！✨</Mk><br />
          <br />
          それを叶えてくれるのが<br />
          <Mk bg="#20cb23" color="#ffffff">「出会えるエージェント」</Mk>
        </Body>

        {/* 仕組み */}
        <img className="block w-full" src={`${P}-solution.png`} alt="出会えるエージェントとは" />
        <Body pad={29}>
          <C c="#ff0000">1000人</C>以上の<br />
          <Mk bg="#fffb00">厳選されたエージェント</Mk>から<br />
          <br />
          あなたの希望条件にぴったりな<br />
          <C c="#ff0000">優良エージェント3社をご紹介！</C>
        </Body>
        <img className="block w-full" src={`${P}-mechanism1.png`} alt="ぴったりのエージェント" />
        <Body pad={20}>
          自分にピッタリな<B>転職エージェント</B>に出会えるから
        </Body>
        <Body pad={20}>
          <C c="#ff0000">大手転職サイトには掲載されていない</C><br />
          <Mk bg="#ffea00">超ホワイトな非公開求人を</Mk><br />
          紹介してもらえる！✨
        </Body>
        <img className="block w-full" src={`${P}-mechanism2.png`} alt="完全無料" />
        <Body pad={20}>
          しかも！<br />
          <B>エージェントの登録〜内定まで</B><br />
          一切料金がかからないので<br />
          <Mk bg="#ff0000" color="#ffffff">完全無料なんです!!</Mk>
        </Body>
        <Body pad={0}>
          <B>絶対に使わないと損</B>なので<br />
          <C c="#ff0000">転職成功させたいなら</C><br />
          <Mk bg="#f2ff00">絶対に相談してみてください！</Mk>
        </Body>

        {/* CTA② */}
        <CtaBanner onClick={handleCtaClick} />

        {/* 利用者の声 */}
        <img className="block w-full" src={`${P}-voice1.png`} alt="利用者の声1" />
        <Body pad={20}>
          前の仕事より<br />
          <B>全然ラク</B>なのに<br />
          <B>給料良いし家賃補助まで</B>あって<br />
          <C c="#ff0000">本当に最高の職場で働けてる😭</C>
        </Body>
        <Body pad={20}>
          この前<B>ボーナス</B>入って<br />
          <Mk bg="#f2ff00">貯金が700万近くになった！</Mk>
        </Body>
        <img className="block w-full" src={`${P}-voice2.png`} alt="利用者の声2" />
        <Body pad={20}>
          <C c="#ff00e1">平日は17時</C>には上がれるし、<br />
          <B>土日休み</B>だから<C c="#ff00c8">彼と予定合わせて旅行</C>にも行ける✈️
        </Body>
        <Body pad={0}>
          <C c="#ff00d0">欲しかったコスメ</C>も買えるし<br />
          <C c="#ff00d0">推しのグッズ</C>も惜しまず買えるし<br />
          <Mk bg="#ff0000" color="#ffffff">本当に最高😭</Mk>
        </Body>
        <img className="block w-full" src={`${P}-voice3.png`} alt="利用者の声3" />
        <Body pad={20}>
          <Mk bg="#01a70f" color="#ffffff">「出会えるエージェント」</Mk>で<br />
          <B>転職して本当に良かった✨</B>
        </Body>
        <Body pad={20}>
          少しでも転職しようと思ってる人は<br />
          <Mk bg="#ff0000" color="#ffffff">まずは無料キャリア相談に参加して！</Mk>
        </Body>

        {/* CTA③ */}
        <CtaBanner onClick={handleCtaClick} />

        {/* 危機感（3STEPセクション・面談の段落はユーザー指示で削除済み） */}
        <Body pad={39}>
          ただ、<br />
          この<B>キャリア相談の応募</B>が<br />
          <C c="#ff0000">めちゃくちゃ殺到しているらしくて</C><br />
          <B>枠が埋まってきてる</B>らしい・・・
        </Body>
        <img className="block w-full" src={`${P}-urgency1.png`} alt="予約枠が埋まってきている" />
        <Body pad={39}>
          <C c="#ff0000">超ホワイト企業の非公開求人</C>は<br />
          すぐに<B>応募が殺到して締め切りが早い</B>ので<br />
          <Mk bg="#fffb00">悩む前にすぐ動かないと後悔するかも💦</Mk>
        </Body>
        <img className="block w-full" src={`${P}-urgency2.png`} alt="早めの行動を" />

        {/* 最終CTA（このCTAが画面内にある間はフローティングCTAを隠す） */}
        <CtaBanner onClick={handleCtaClick} onVisibilityChange={handleLastCtaVisibility} />

        {/* 運営社情報（参考LP: 右寄せ・最終CTA直後） */}
        <p className="mt-2 text-right">
          <a
            href="https://foresma.jp/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#1e1e1e] underline"
          >
            運営社情報
          </a>
        </p>
      </div>

      {/* フローティングCTA: 1個目のインラインCTAが見えたらCTA画像だけを画面下部に追従表示（帯なし）。
          ただし最終CTAが画面内にある間は重なり防止で隠す。 */}
      {showFloatingCta && !lastCtaVisible && (
        <button
          type="button"
          onClick={handleCtaClick}
          className="fixed inset-x-0 bottom-2 z-50 mx-auto block w-[calc(100%-20px)] max-w-[620px] touch-manipulation"
        >
          <img
            className="lp09-cta-zoom block w-full"
            src={`${P}-cta.png`}
            alt="無料でキャリア相談を予約する"
          />
        </button>
      )}
    </div>
  );
}

/**
 * 画像CTAバナー（参考LP: margin上下39px / 出現時バウンスイン + ズームループ）。
 * 親のレンダーごとの再マウントを避けるためモジュールレベルで定義する。
 */
function CtaBanner({
  onClick,
  onFirstShow,
  onVisibilityChange,
}: {
  onClick: () => void;
  /** このCTAが初めて画面に入った時に一度だけ呼ばれる（フローティングCTA起動用） */
  onFirstShow?: () => void;
  /** このCTAの表示/非表示が切り替わるたびに呼ばれる（フローティングとの重なり防止用） */
  onVisibilityChange?: (visible: boolean) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    // onVisibilityChange がある場合は出入りを継続監視する必要があるため unobserve しない。
    const keepObserving = Boolean(onVisibilityChange);
    const ob = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          onFirstShow?.();
          if (!keepObserving) {
            ob.unobserve(el);
          }
        }
        onVisibilityChange?.(e.isIntersecting);
      },
      { threshold: 0.2 }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, [onFirstShow, onVisibilityChange]);
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      className="my-[39px] block w-full touch-manipulation"
    >
      <img
        className={`block w-full ${shown ? "lp09-cta-zoom" : "opacity-0"}`}
        src={`${P}-cta.png`}
        alt="無料でキャリア相談を予約する"
      />
    </button>
  );
}

/** 見出しh3（参考LP: 20px・太字・中央・上下に軽い余白） */
function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="mt-8 mb-4 text-center text-[20px] font-bold">{children}</h3>
  );
}

/**
 * 本文ブロック（参考LPのh6相当: 14px / weight500 / lh1.65 / 中央寄せ）。
 * pad は参考LPのspacingプリセット実測値（モバイル）: 20 / 29 / 39px。
 */
function Body({
  children,
  pad,
  align = "center",
}: {
  children: ReactNode;
  pad: 0 | 20 | 29 | 39;
  align?: "center" | "left";
}) {
  const padClass =
    pad === 39 ? "py-[39px]" : pad === 29 ? "py-[29px]" : pad === 20 ? "py-[20px]" : "py-0";
  return (
    <div
      className={`${padClass} ${align === "center" ? "text-center" : "text-left"} text-[14px] font-medium leading-[1.65]`}
    >
      {children}
    </div>
  );
}

/** 太字（参考LPのstrong相当） */
function B({ children }: { children: ReactNode }) {
  return <strong className="font-bold">{children}</strong>;
}

/** 色付きテキスト */
function C({ c, children }: { c: string; children: ReactNode }) {
  return (
    <strong className="font-bold" style={{ color: c }}>
      {children}
    </strong>
  );
}

/** マーカー（背景色＋任意の文字色。参考LPの mark 相当） */
function Mk({
  bg,
  color,
  children,
}: {
  bg: string;
  color?: string;
  children: ReactNode;
}) {
  return (
    <strong
      className="font-bold"
      style={{ backgroundColor: bg, ...(color ? { color } : {}) }}
    >
      {children}
    </strong>
  );
}

/** 会話吹き出し（わたし=左/#ffe0e0, 友達=右/#d6ebff。下マージン40px・太字） */
function Balloon({
  side,
  avatar,
  name,
  children,
}: {
  side: "left" | "right";
  avatar: string;
  name: string;
  children: ReactNode;
}) {
  const isLeft = side === "left";
  const avatarEl = (
    <div className="flex w-16 shrink-0 flex-col items-center">
      <img
        src={avatar}
        alt={name}
        className="h-14 w-14 rounded-full object-cover"
      />
      <span className="mt-1 text-xs text-[#666]">{name}</span>
    </div>
  );
  const bubble = (
    <div
      className={`relative max-w-[78%] rounded-2xl px-4 py-4 text-[15px] font-bold leading-relaxed ${
        isLeft ? "bg-[#ffe0e0]" : "bg-[#d6ebff]"
      }`}
    >
      {children}
    </div>
  );
  return (
    <div
      className={`mb-10 flex items-start gap-2 ${
        isLeft ? "justify-start" : "justify-end"
      }`}
    >
      {isLeft ? (
        <>
          {avatarEl}
          {bubble}
        </>
      ) : (
        <>
          {bubble}
          {avatarEl}
        </>
      )}
    </div>
  );
}

/** 横スワイプスライダー（非公開求人4枚） */
function Slider({ images }: { images: string[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    setIndex(i);
  };

  return (
    <div>
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((src, i) => (
          <div key={src} className="w-full shrink-0 snap-center px-1">
            <img className="block w-full" src={src} alt={`非公開求人${i + 1}`} />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-center gap-2">
        {images.map((src, i) => (
          <span
            key={src}
            className={`h-2 w-2 rounded-full ${
              i === index ? "bg-[#E8641A]" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
