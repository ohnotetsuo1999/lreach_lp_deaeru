export function Analyzing() {
  return (
    <section className="relative">
      <div className="relative">
        <img className="block w-full" src="/lp1_analyzing_bg.jpg" alt="" />
        <div className="absolute bottom-[23.5%] left-1/2 flex size-24 -translate-x-1/2 items-center justify-center">
          <p className=" text-center font-extrabold leading-3 text-white">
            wait
            <br />
            a
            <br />
            minute
          </p>
          <div>
            {[...Array(12)].map((_, n) => {
              return <span className="analyzing" key={n} />;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
