import { cn } from "@/lib/utils";
import { MaxWidth } from "@/components/common";

const LINK_BUTTON_BASE_CLASS = "block absolute left-1/2 -translate-x-1/2 w-4/5";
const LINK_BUTTON_HREF = "https://page.line.me/984xglsa";

export function AddLine() {
  return (
    <section className="relative">
      <MaxWidth>
        <img className="block w-full" src="/ih-lp02a-add-line.jpg" alt="" />
        <a
          className={cn(LINK_BUTTON_BASE_CLASS, "top-[30.5%]")}
          href={LINK_BUTTON_HREF}
        >
          <img
            className="block w-full"
            src="/ih-lp02a-add-line-button.png"
            alt="公式LINEを追加してみる"
          />
        </a>
        <a
          className={cn(LINK_BUTTON_BASE_CLASS, "bottom-[2.5%]")}
          href={LINK_BUTTON_HREF}
        >
          <img
            className="block w-full"
            src="/ih-lp02a-add-line-button.png"
            alt="公式LINEを追加してみる"
          />
        </a>
      </MaxWidth>
    </section>
  );
}
