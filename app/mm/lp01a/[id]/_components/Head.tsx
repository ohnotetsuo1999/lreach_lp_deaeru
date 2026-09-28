"use client";

import { MaxWidth } from "@/components/common";

export function Head() {
  return (
    <section className="relative ">
      <MaxWidth>
        <img
          className="block h-auto w-full"
          src="/mm-lp01a-head.jpg"
          alt="中途採用エントリーフォーム"
        />
      </MaxWidth>
      <div className="bg-gray-50 py-6 text-center">
        <MaxWidth>
          <div className="text-gray-900">
            <h1 className="mb-1 text-2xl font-bold">株式会社MAGMA</h1>
            <p className="text-base font-normal">中途採用エントリーフォーム</p>
          </div>
        </MaxWidth>
      </div>
    </section>
  );
}
