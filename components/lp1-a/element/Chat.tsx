type Props = {
  message: string;
  type: "bot" | "user";
};

export function Chat({ message, type }: Props) {
  const Bot = () => {
    return (
      <div className="relative flex items-start gap-x-3">
        <img
          className="block w-6 shrink-0"
          src="/lp1-a_diagnosis_calimimichanai.png"
          alt=""
        />
        <p className="relative rounded-xl bg-white p-2.5 text-xs font-medium leading-normal before:absolute before:right-full before:top-3 before:h-2 before:w-1.5 before:bg-white before:content-[''] before:clip-path-triangle-left">
          <span dangerouslySetInnerHTML={{ __html: message }} />
        </p>
      </div>
    );
  };

  const User = () => {
    return (
      <div className="relative flex justify-end">
        <p className="flex h-8 w-28 items-center justify-center rounded-2xl bg-[rgb(46,105,254)] text-center text-xs font-extrabold text-white drop-shadow-[0_1px_15px_rgba(0,0,0,0.15)]">
          <span>{message}</span>
        </p>
      </div>
    );
  };

  const setComponent = () => {
    switch (type) {
      case "bot":
        return <Bot />;

      case "user":
        return <User />;
    }
  };

  return setComponent();
}
