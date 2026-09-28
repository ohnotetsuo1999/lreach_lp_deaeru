import { MaxWidth } from "@/components/common";

export function Head() {
  return (
    <section className="relative">
      <MaxWidth>
        <img
          className="w-full"
          src="/ih-lp01a-head-1.jpg"
          alt="9月限定 ご成約キャンペーン ご成約でBUB RESORT -Tsukuba-の宿泊券が必ずもらえる！"
        />
        <div className="bg-[rgb(189,77,91)] py-3">
          <h1>
            <img
              className="w-full"
              src="/ih-lp01a-head-2.jpg"
              alt="理想のマイホームを叶える！ おうちのタイプ診断 あなた好みのデザインを選んで、暮らしに合うお家を診断！"
            />
          </h1>
        </div>
      </MaxWidth>
    </section>
  );
}
