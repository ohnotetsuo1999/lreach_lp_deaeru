import { MaxWidth } from "@/components/common";

type Props = {
  alt: string;
  src: string;
};

export function Header({ alt, src }: Props) {
  return (
    <header className="relative">
      <MaxWidth>
        <img className="block h-auto w-full" src={src} alt={alt} />
      </MaxWidth>
    </header>
  );
}
