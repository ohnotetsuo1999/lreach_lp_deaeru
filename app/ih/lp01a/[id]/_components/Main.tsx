import {
  Flow,
  Form,
  Head,
  Introduction,
} from "@/app/ih/lp01a/[id]/_components";

interface Props {
  id: string;
}

export function Main({ id }: Props) {
  return (
    <main className="relative">
      <Head />
      <Introduction />
      <Flow />
      <Form id={id} />
    </main>
  );
}
