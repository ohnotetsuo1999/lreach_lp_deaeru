import { Container, MaxWidth } from "@/components/common";

export function Header() {
  return (
    <header className="relative">
      <div className="bg-white">
        <MaxWidth>
          <Container width="90">
            <div className="flex max-w-lg items-center justify-between py-2">
              <a href="/lp2">
                <img
                  className="block h-auto w-20"
                  src="/global_lreach-logo_img.svg"
                  alt="Lリーチ"
                />
              </a>
              <h1 className="text-xs font-bold text-gray-900">
                第二新卒に特化した転職サイト
              </h1>
            </div>
          </Container>
        </MaxWidth>
      </div>
    </header>
  );
}
