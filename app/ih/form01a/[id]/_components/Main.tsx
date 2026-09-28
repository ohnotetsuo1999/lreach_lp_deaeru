import { Form, Head } from "@/app/ih/form01a/[id]/_components";

interface Props {
  id: string;
}

export function Main({ id }: Props) {
  return (
    <main>
      <Head />
      <Form id={id} />
    </main>
  );
}
