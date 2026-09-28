"use client";

import { useEffect, useRef, useState } from "react";

import { useLpActionStatistics } from "./useLpActionStatistics";

interface Props {
  /** 行動計測用のLPキー（例: deaeru-lp11a）。LP行動集計シートの記録に必須 */
  lpKey: string;
  /** CTAの遷移先（本LPのURL。例: https://deaeru-agent.jp/deaeru/lp10e/001） */
  ctaUrl: string;
}

/**
 * lp11系（記事LP）の共有コンポーネント。
 * デザイン入稿の lp_deaeru/index.html（画像15枚＋テキストセクション構成）を移植したもの。
 * - 1つ目のCTA（画像07と08の間）が画面に入った時点からフローティングCTAを表示し、最下部まで追従する
 * - CTAは本LP（lp10e〜h）へ遷移し、URL の [id] をそのまま引き継ぐ（記事LP側にタグ・計測はなし）
 * lp11a〜d の4本で共通利用（遷移先 ctaUrl だけが異なる）。
 */
export function Lp11Article({ lpKey, ctaUrl }: Props) {
  const [isFloatingVisible, setIsFloatingVisible] = useState(false);
  const ctaTriggerRef = useRef<HTMLDivElement | null>(null);

  // LP行動集計シートへの行動計測（滞在時間・スクロール率・CTAクリック）。
  // 2026-07-24 追加: lp11系はこのビーコンが未実装で閲覧数がシートに記録されていなかった。
  const { markCtaClicked } = useLpActionStatistics(lpKey);

  // 入稿HTMLと同じ挙動: 1つ目のCTAの上端がビューポートに達したらフローティングを表示。
  // 初期表示（1つ目のCTAより上）では表示しない。
  // 判定は2系統の併用:
  //  - scroll/resize リスナー: スクロール中の連続判定（従来挙動）
  //  - IntersectionObserver: 画像読み込みでページ高さが変わった時にスクロールなしでも再判定
  //    （これが無いと、画像ロード中の縮んだレイアウトで誤表示→ロード後も表示されっぱなしになる）
  useEffect(() => {
    const trigger = ctaTriggerRef.current;
    if (!trigger) return undefined;

    const update = () => {
      const rect = trigger.getBoundingClientRect();
      setIsFloatingVisible(rect.top <= window.innerHeight);
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const observer = new IntersectionObserver(update, { threshold: 0 });
    observer.observe(trigger);
    update();

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      observer.disconnect();
    };
  }, []);

  const ctaButton = (
    <a className="btn" href={ctaUrl} onClick={markCtaClicked}>
      今すぐ自分に合ったエージェントを見つける<span className="arrow">→</span>
    </a>
  );

  return (
    <div className="page-bg">
      <div className="wrap">
      {/* ===== 画像スタック（記事LP_01〜07） ===== */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="lp-img"
        src="/deaeru-lp11-01.png" width={1265} height={1244}
        alt="手取り43万・残業なしの神求人をもらって初めての転職で大成功した話"
      />
      <p className="pr-line">PR：出会えるエージェント</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="lp-img" src="/deaeru-lp11-02.png" width={1402} height={1122} alt="記事LP_02" loading="lazy" />
      <p className="img-note">※一例であり、成果を保証するものではない</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="lp-img" src="/deaeru-lp11-03.png" width={1536} height={1024} alt="記事LP_03" loading="lazy" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="lp-img" src="/deaeru-lp11-04.png" width={1402} height={1122} alt="記事LP_04" loading="lazy" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="lp-img" src="/deaeru-lp11-05.png" width={1536} height={1024} alt="記事LP_05" loading="lazy" />
      <p className="img-note">※一例であり、成果を保証するものではない</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="lp-img" src="/deaeru-lp11-06.png" width={1822} height={863} alt="記事LP_06" loading="lazy" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="lp-img" src="/deaeru-lp11-07.png" width={1086} height={1448} alt="記事LP_07" loading="lazy" />
      <p className="img-note">※一例であり、成果を保証するものではない</p>

      {/* ===== CTA（画像07と08の間）＝フローティング開始地点 ===== */}
      <div className="cta-inflow" ref={ctaTriggerRef}>
        <div className="cta">
          <span className="badge">完全無料・30秒でカンタン登録</span>
          {ctaButton}
          <p className="sub">※LINEの友だち追加ページが開きます</p>
        </div>
      </div>

      {/* ===== 画像スタック（記事LP_08〜11） ===== */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="lp-img" src="/deaeru-lp11-08.png" width={1402} height={1122} alt="記事LP_08" loading="lazy" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="lp-img" src="/deaeru-lp11-09.png" width={1403} height={1121} alt="記事LP_09" loading="lazy" />
      <p className="img-note">※一例であり、成果を保証するものではない</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="lp-img" src="/deaeru-lp11-10.png" width={1536} height={1024} alt="記事LP_10" loading="lazy" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="lp-img" src="/deaeru-lp11-11.png" width={1536} height={1024} alt="記事LP_11" loading="lazy" />

      {/* テキスト：ブリッジ（11と12の間） */}
      <section className="txt-sec center bridge">
        <p className="bridge-t">私が使ったサービスがこれ！</p>
      </section>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="lp-img" src="/deaeru-lp11-12.png" width={1122} height={1402} alt="記事LP_12" loading="lazy" />

      {/* テキスト：サービス紹介 */}
      <section className="txt-sec center service-intro">
        <p>
          このサービス使ってみたら、
          <br />
          <span className="was">手取り21万</span>だった私が
          <br />
          <span className="pink hl">手取り43万</span>、
          <span className="green-t">土日完全休み</span>の
          <br />
          会社に転職できた！
        </p>
      </section>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="lp-img" src="/deaeru-lp11-13.png" width={1122} height={1402} alt="記事LP_13" loading="lazy" />

      {/* テキスト：エージェント比較が鍵 */}
      <section className="txt-sec soft compare-sec">
        <h2 className="sec-title">
          エージェントを<span className="green-t">比較する</span>のが
          <br />
          転職成功の鍵
        </h2>
        <div className="sec-dash" />
        <p className="center">
          例えば<span className="mark">1社だけ</span>に絞ってしまうと、
          <br />
          そのエージェントが持っている
          <br />
          求人の中からしか
          <br />
          <span className="red">選べなくなってしまいます。</span>
        </p>
        <div className="compare">
          <div className="cbox ng">
            <div className="h">
              エージェント
              <br />
              1社だけ利用
            </div>
            <div className="d">
              紹介される求人が
              <br />
              限られてしまう…
            </div>
          </div>
          <div className="carrow">▶</div>
          <div className="cbox ok">
            <div className="h">
              エージェント
              <br />
              3社以上利用
            </div>
            <div className="d">
              <b>手取り40万以上</b>など、
              <br />
              理想の求人に出会える
            </div>
          </div>
        </div>
        <p className="center">
          でも、<span className="mark">3社以上</span>のエージェントと
          <br />
          話してみると、
          <br />
          紹介してもらえる求人はおよそ<span className="red">3倍</span>に。
          <br />
          その分、<span className="green-t">自分に本当に合った求人</span>と
          <br />
          出会える可能性がグッと上がる。
        </p>
        <p className="center closer">
          <span className="red">だから、1社しか使わないのは損！</span>
        </p>
      </section>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="lp-img" src="/deaeru-lp11-14.png" width={1536} height={1024} alt="記事LP_14" loading="lazy" />
      <p className="img-note">※一例であり、成果を保証するものではない</p>

      {/* テキスト：非公開求人の入り */}
      <section className="txt-sec">
        <div className="callout">
          しかも、優良なエージェントに出会えると、
          <br />
          そこらの転職サイトには載っていない
          <br />
          <span className="purple">「非公開求人」</span>を
          <br />
          紹介してもらえることもあるんだって！
        </div>
      </section>

      {/* 非公開求人の魅力 */}
      <section className="txt-sec soft">
        <h2 className="sec-title">非公開求人のメリット</h2>
        <div className="sec-dash" />
        <div className="merit">
          <div className="ic">1</div>
          <div>
            <div className="t">高待遇の求人が多い</div>
            <div className="d">年収・休日・手当など、条件の良い求人に出会えることも</div>
          </div>
        </div>
        <div className="merit">
          <div className="ic">2</div>
          <div>
            <div className="t">福利厚生などの制度が整っている</div>
            <div className="d">安心して長く働ける環境の求人が多い</div>
          </div>
        </div>
        <div className="merit">
          <div className="ic">3</div>
          <div>
            <div className="t">ライバルが少なく受かりやすい</div>
            <div className="d">一般公開されないぶん応募が集中しにくく、内定のチャンスが広がる</div>
          </div>
        </div>
      </section>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="lp-img" src="/deaeru-lp11-15.png" width={1672} height={941} alt="記事LP_15" loading="lazy" />

      {/* 最下部CTA */}
      <section className="cta-inflow" style={{ background: "#fff" }}>
        <div className="cta">
          <span className="badge">完全無料・30秒でカンタン登録</span>
          {ctaButton}
          <p className="sub">※LINEの友だち追加ページが開きます</p>
        </div>
      </section>

      <p className="disc">
        ※本ページはプロモーションを含みます。
        <br />
        ※掲載の求人条件・体験談は一例であり、成果を保証するものではありません。
        <br />
        ※紹介されるエージェント・求人は状況により異なります。
      </p>

      {/* ===== フローティングCTA（1つ目のCTA地点で出現→最下部まで） ===== */}
      <div className={`floating${isFloatingVisible ? " show" : ""}`}>
        <div className="inner">{ctaButton}</div>
      </div>

      </div>

      {/* 入稿HTMLのCSSをそのまま移植（lp11専用クラスのためスコープ衝突なし） */}
      <style jsx>{`
        .page-bg {
          min-height: 100vh;
          background: #efe9f2;
        }
        .wrap {
          max-width: 600px;
          margin: 0 auto;
          background: #fff;
          overflow: hidden;
          position: relative;
          font-family: "Hiragino Maru Gothic ProN", "Hiragino Sans", "Yu Gothic",
            -apple-system, BlinkMacSystemFont, sans-serif;
          color: #4a4550;
          line-height: 1.9;
          font-size: 15px;
          -webkit-font-smoothing: antialiased;
        }
        .lp-img {
          display: block;
          width: 100%;
          height: auto;
          vertical-align: bottom;
          background: #f3eef6;
        }
        .pr-line {
          text-align: right;
          font-size: 12px;
          color: #8a9098;
          padding: 10px 20px;
          margin: 0;
          background: #fff;
        }
        .img-note {
          text-align: right;
          font-size: 11px;
          color: #a7adb3;
          padding: 10px 18px;
          margin: 0;
          background: #fff;
        }
        b {
          font-weight: 800;
        }
        .cbox.ok b {
          color: #e8506b;
          font-size: 1.3em;
        }
        .center {
          text-align: center;
        }
        .red {
          color: #e8506b;
          font-weight: 800;
        }
        .pink {
          color: #e8607f;
          font-weight: 800;
        }
        .green-t {
          color: #3fa34d;
          font-weight: 800;
        }
        .purple {
          color: #9d6fc4;
          font-weight: 800;
        }
        .mark {
          background: linear-gradient(transparent 55%, #fff0a8 55%);
          font-weight: 800;
          padding: 0 2px;
        }
        .cta {
          margin: 6px 0 4px;
          text-align: center;
        }
        .cta .badge {
          display: inline-block;
          background: #fbe45f;
          color: #6b5b13;
          font-weight: 800;
          font-size: 13px;
          border-radius: 20px;
          padding: 7px 20px;
          margin-bottom: 14px;
        }
        .cta :global(.btn) {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: linear-gradient(180deg, #57c15f, #46b64f);
          color: #fff;
          font-size: 17px;
          font-weight: 900;
          text-decoration: none;
          padding: 18px 16px;
          border-radius: 16px;
          box-shadow: 0 8px 18px rgba(70, 182, 79, 0.4);
          max-width: 440px;
          margin: 0 auto;
          animation: lp11-pulse 2s infinite;
          line-height: 1.35;
          text-align: center;
        }
        .cta :global(.btn .arrow) {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.28);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
        }
        .cta :global(.btn:active) {
          transform: translateY(2px);
        }
        .cta .sub {
          font-size: 11px;
          color: #a79db0;
          margin-top: 10px;
        }
        @keyframes lp11-pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }
        .cta-inflow {
          padding: 26px 24px;
          background: linear-gradient(180deg, #faf6fc, #fff);
        }
        .floating {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 100;
          transform: translateY(140%);
          transition: transform 0.35s ease;
          pointer-events: none;
        }
        .floating.show {
          transform: translateY(0);
          pointer-events: auto;
        }
        .floating .inner {
          max-width: 600px;
          margin: 0 auto;
          padding: 10px 16px;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(4px);
          box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
        }
        .floating :global(.btn) {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(180deg, #57c15f, #46b64f);
          color: #fff;
          font-size: 16px;
          font-weight: 900;
          text-decoration: none;
          padding: 15px 12px;
          border-radius: 14px;
          box-shadow: 0 4px 10px rgba(70, 182, 79, 0.4);
          line-height: 1.3;
          text-align: center;
        }
        .floating :global(.btn .arrow) {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.28);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }
        .txt-sec {
          padding: 38px 24px;
        }
        .txt-sec p {
          margin: 0 0 22px;
        }
        .txt-sec.soft {
          background: linear-gradient(180deg, #faf6fc, #fff);
        }
        .bridge {
          background: #fff;
          padding-top: 30px;
          padding-bottom: 20px;
        }
        .bridge .bridge-t {
          font-size: 15px;
          font-weight: 800;
          color: #4a4550;
          line-height: 1.85;
          margin: 0;
        }
        .service-intro {
          background: #fff;
          line-height: 2;
        }
        .service-intro p {
          margin: 0 0 30px;
          font-weight: 800;
          color: #3a3540;
          font-size: 19px;
        }
        .service-intro .was {
          color: #9a9aa2;
          font-weight: 700;
        }
        .service-intro .hl {
          font-size: 1.3em;
        }
        .sec-title {
          font-size: 22px;
          font-weight: 900;
          text-align: center;
          color: #4a4550;
          line-height: 1.4;
          margin-bottom: 8px;
        }
        .sec-dash {
          width: 160px;
          height: 2px;
          background: repeating-linear-gradient(
            90deg,
            #d4c9dc 0 8px,
            transparent 8px 14px
          );
          margin: 0 auto 24px;
        }
        .compare-sec p {
          font-size: 17px;
          line-height: 1.95;
          font-weight: 700;
          color: #4a4550;
        }
        .compare-sec .closer {
          font-size: 20px;
          margin-top: 4px;
        }
        .compare {
          display: flex;
          align-items: stretch;
          gap: 8px;
          margin: 0 0 24px;
        }
        .compare .cbox {
          flex: 1;
          border-radius: 14px;
          padding: 16px 10px;
          text-align: center;
        }
        .compare .cbox .h {
          font-weight: 900;
          font-size: 15px;
          margin-bottom: 8px;
          line-height: 1.4;
        }
        .compare .cbox .d {
          font-size: 13px;
          line-height: 1.6;
          font-weight: 700;
        }
        .compare .ng {
          background: #eef0f2;
          color: #7b8189;
        }
        .compare .ok {
          background: linear-gradient(135deg, #eafaf0, #f4fbf6);
          border: 2px solid #7fd08a;
          color: #2f6b39;
        }
        .compare .carrow {
          display: flex;
          align-items: center;
          color: #9d6fc4;
          font-weight: 900;
          font-size: 18px;
        }
        .callout {
          background: #f5eefb;
          border-radius: 14px;
          padding: 18px 18px;
          font-size: 15px;
          font-weight: 700;
          color: #5a4f63;
          text-align: center;
        }
        .merit {
          background: #fff;
          border: 1px solid #ececf2;
          border-radius: 14px;
          padding: 16px;
          display: flex;
          gap: 14px;
          align-items: center;
          margin-bottom: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }
        .merit .ic {
          width: 40px;
          height: 40px;
          flex: 0 0 40px;
          background: linear-gradient(180deg, #5cbf6a, #46b64f);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          color: #fff;
          font-size: 20px;
          box-shadow: 0 2px 5px rgba(70, 182, 79, 0.35);
        }
        .merit .t {
          font-size: 15px;
          font-weight: 800;
          color: #4a4550;
        }
        .merit .d {
          font-size: 12px;
          color: #8a8391;
          margin-top: 2px;
        }
        .disc {
          font-size: 10px;
          color: #b3adba;
          text-align: center;
          padding: 22px 22px 90px;
          line-height: 1.7;
        }
      `}</style>
    </div>
  );
}
