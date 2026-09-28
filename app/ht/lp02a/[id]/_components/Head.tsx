"use client";

import { MaxWidth } from "@/components/common";

export function Head() {
  return (
    <section className="relative">
      <MaxWidth>
        <img
          className="block h-auto w-full"
          src="/ht-lp02a-head.jpg"
          alt="株式会社HRteam 正社員募集"
        />
      </MaxWidth>
      <div className="bg-gray-50 py-6 text-center">
        <MaxWidth>
          <div className="text-gray-900">
            <h1 className="mb-1 text-2xl font-bold">株式会社HRteam</h1>
            <p className="text-base font-normal">中途採用エントリーフォーム</p>
          </div>
        </MaxWidth>
      </div>
    </section>
  );
}
