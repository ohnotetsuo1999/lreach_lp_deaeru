import { MaxWidth } from "@/components/common";

export function Introduction() {
  return (
    <section className="relative">
      <MaxWidth>
        <div className="bg-[rgb(255,249,238)] pt-11">
          <h2>
            <img
              className="mx-auto mb-2 w-[78%]"
              src="/ih-lp01a-introduction-title.svg"
              alt="おうちタイプ診断 おうちタイプ診断で何がわかるの？"
            />
          </h2>
          <img
            className="mx-auto mb-6 w-[90%]"
            src="/ih-lp01a-introduction-question.png"
            alt="どんな間取りがあう？ 今の収入でローンが通るの？ 将来の子供部屋も考えておきたい"
          />
          <p className="mx-auto w-[73%] bg-white pb-3.5 pt-2 text-center font-zen-maru-gothic text-base font-bold leading-5 text-[rgb(87,83,82)]">
            お家作りのお悩みを
            <br />
            <span className="bg-[linear-gradient(transparent_65%,_rgb(251,255,126)_65%)] bg-no-repeat">
              一人ひとりに合わせて診断
            </span>
            して
            <br />
            <span className="bg-[linear-gradient(transparent_65%,_rgb(251,255,126)_65%)] bg-no-repeat">
              <strong className="text-[rgb(194,62,75)]">プロ</strong>が
              <strong className="text-[rgb(194,62,75)]">個別</strong>
              にご説明
            </span>
            します！
          </p>
        </div>
      </MaxWidth>
    </section>
  );
}
