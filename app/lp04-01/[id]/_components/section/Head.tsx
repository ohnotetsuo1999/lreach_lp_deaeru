import { MaxWidth } from "@/components/common";

type Props = {
  companyName: string;
  title: string;
};

export function Head({ companyName, title }: Props) {
  return (
    <section className="relative py-6">
      <MaxWidth>
        <div className="text-center text-gray-900">
          <h1 className="text-2xl font-bold mb-1">{companyName}</h1>
          <p
            className="text-base font-normal"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        </div>
      </MaxWidth>
    </section>
  );
}
