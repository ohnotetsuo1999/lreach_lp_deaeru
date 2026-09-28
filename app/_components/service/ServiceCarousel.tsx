"use client";

import { createContext, useCallback, useContext, useEffect, type ReactNode } from "react";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * 納品物の shadcn Carousel（@base-ui / Tailwind 4 前提）を、embla-carousel-react 直接利用の最小版に置き換えたもの。
 * 納品側が使っていた API（opts / setApi / CarouselContent / CarouselItem / CarouselPrevious / CarouselNext）だけを提供する。
 * 見た目は納品 CSS のクラス（point-slides / point-slide / voice-story-track 等）が当たるため、ここでは装飾しない。
 */

export type CarouselApi = UseEmblaCarouselType[1];
type CarouselOptions = Parameters<typeof useEmblaCarousel>[0];

interface CarouselContextValue {
  carouselRef: UseEmblaCarouselType[0];
  api: CarouselApi;
}

const CarouselContext = createContext<CarouselContextValue | null>(null);

function useCarousel(): CarouselContextValue {
  const ctx = useContext(CarouselContext);
  if (!ctx) throw new Error("Carousel の部品は <Carousel> の中で使ってください");
  return ctx;
}

interface CarouselProps {
  opts?: CarouselOptions;
  setApi?: (api: CarouselApi) => void;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}

export function Carousel({ opts, setApi, className = "", children, ...rest }: CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel({ ...opts, axis: "x" });

  useEffect(() => {
    if (api && setApi) setApi(api);
  }, [api, setApi]);

  return (
    <CarouselContext.Provider value={{ carouselRef, api }}>
      <div className={`carousel ${className}`} role="region" aria-roledescription="carousel" {...rest}>
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

interface ContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CarouselContent({ className = "", children, ...rest }: ContentProps) {
  const { carouselRef } = useCarousel();
  return (
    <div ref={carouselRef} className="carousel-viewport" style={{ overflow: "hidden" }}>
      <div className={`carousel-track ${className}`} style={{ display: "flex" }} {...rest}>
        {children}
      </div>
    </div>
  );
}

interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CarouselItem({ className = "", children, ...rest }: ItemProps) {
  return (
    <div
      role="group"
      aria-roledescription="slide"
      className={`carousel-item ${className}`}
      style={{ minWidth: 0, flexShrink: 0, flexGrow: 0 }}
      {...rest}
    >
      {children}
    </div>
  );
}

interface NavButtonProps {
  "aria-label": string;
}

export function CarouselPrevious(props: NavButtonProps) {
  const { api } = useCarousel();
  const onClick = useCallback(() => api?.scrollPrev(), [api]);
  return (
    <button type="button" className="carousel-nav carousel-prev" onClick={onClick} {...props}>
      <ChevronLeft aria-hidden="true" />
    </button>
  );
}

export function CarouselNext(props: NavButtonProps) {
  const { api } = useCarousel();
  const onClick = useCallback(() => api?.scrollNext(), [api]);
  return (
    <button type="button" className="carousel-nav carousel-next" onClick={onClick} {...props}>
      <ChevronRight aria-hidden="true" />
    </button>
  );
}
