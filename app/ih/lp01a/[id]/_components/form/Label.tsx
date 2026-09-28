interface Props {
  label: string;
  number: string;
}

export function Label({ label, number }: Props) {
  return (
    <div className="relative flex flex-col items-center font-jomolhari font-normal">
      <span className="text-[15px] text-black">Question</span>
      <span className="w-[50px] aspect-square mt-1 mb-[7px] bg-[rgb(189,77,91)] flex items-center justify-center rounded-full text-white text-2xl">
        {number}
      </span>
      <label
        className="w-full pb-[9px] text-center text-[rgb(33,23,21)] text-[15px] font-zen-maru-gothic font-bold border-b-[1px] border-black border-dashed"
        dangerouslySetInnerHTML={{ __html: label }}
      />
    </div>
  );
}
