interface Props {
  title: string;
}

export function FormTitle({ title }: Props) {
  return (
    <div className="relative flex flex-col items-center mb-[18px]">
      <h2
        className="relative w-full bg-[rgb(205,169,125)] pt-1 pb-[9px] text-center text-white font-zen-antique font-normal text-lg"
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <div className="bg-[rgb(205,169,125)] [clip-path:polygon(0_0,_100%_0,_50%_100%)] h-[13px] w-[21px]" />
    </div>
  );
}
