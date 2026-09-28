import Link from "next/link";

type Props = {
  isSubmitting: boolean;
  submit: () => void;
};

export function Result({ isSubmitting, submit }: Props) {
  return (
    <section className="relative">
      <img className="block w-full" src="/lp1-a_result_bg.jpg" alt="" />
      <button
        className="absolute inset-x-0 bottom-[30%] mx-[12.5%] block"
        disabled={isSubmitting}
        onClick={submit}
      >
        <img
          className="mx-auto block w-full animate-button-bounce"
          src="/lp1-a_result_button.png"
          alt="診断書を受け取る"
        />
      </button>
      <Link
        className="hidden"
        href={`https://gateway.lreach.jp?answersId=&referrerUrl=`}
      >
        クリック
      </Link>
    </section>
  );
}
