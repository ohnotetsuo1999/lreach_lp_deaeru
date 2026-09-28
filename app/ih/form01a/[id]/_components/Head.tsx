import { MaxWidth } from "@/components/common";

export function Head() {
  return (
    <section className="relative">
      <MaxWidth>
        <h1>
          <img
            src="/ih-form01a-head.jpg"
            alt="THANK YOU あとはお受け取りのみ！"
          />
        </h1>
        <div className="relative pt-[14px] pb-[31px] bg-[rgb(189,77,91)]">
          <p className="text-white text-center font-zen-maru-gothic font-bold text-base">
            下記情報を記入して
            <br />
            <span className="my-[6px] px-[10px] inline-block bg-white text-xl text-[rgb(189,77,91)]">
              診断結果から作成
            </span>
            <br />
            <strong className="text-[26px] text-[rgb(244,229,143)]">
              「理想のおうちプラン」
            </strong>
            <br />
            をお受け取りください！
          </p>
          <div className="absolute bottom-[-1px] inset-x-[-1px] h-[36px] bg-[rgb(255,249,238)] [clip-path:polygon(0_0,50%_100%,100%_0,100%_100%,0_100%)]" />
        </div>
      </MaxWidth>
    </section>
  );
}
