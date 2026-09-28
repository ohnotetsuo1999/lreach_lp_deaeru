import { Container, MaxWidth } from "@/components/common";
import { FLOW_ITEMS } from "@/app/ih/lp01a/[id]/_data";

export function Flow() {
  return (
    <section className="relative">
      <MaxWidth>
        <div className="bg-[rgb(255,249,238)] pb-[22px] pt-[26px]">
          <img
            className="mx-auto mb-3 w-[28%]"
            src="/ih-lp01a-flow-title.svg"
            alt="診断の流れ"
          />
          <Container width="90">
            <ul className="flex gap-[10px]">
              {FLOW_ITEMS.map((item) => (
                <li className="flex-1" key={item.title}>
                  <img className="w-full" src={item.image} alt={item.title} />
                </li>
              ))}
            </ul>
          </Container>
        </div>
      </MaxWidth>
    </section>
  );
}
