"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "TOP", href: "/media", category: "all" },
  { label: "転職エージェント", href: "/media?category=agent-guide", category: "agent-guide" },
  { label: "転職の始め方", href: "/media?category=career-start", category: "career-start" },
  { label: "面接対策", href: "/media?category=interview-prep", category: "interview-prep" },
  { label: "職種・業界", href: "/media?category=industry-guide", category: "industry-guide" },
  { label: "年収・キャリア", href: "/media?category=salary-career", category: "salary-career" },
  { label: "悩み・不安解消", href: "/media?category=anxiety-resolve", category: "anxiety-resolve" },
];

export default function DeaeruHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-white"
      }`}
      role="banner"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-[5rem] md:h-[5.5rem]">
          <Link
            href="/media"
            className="flex items-center shrink-0 hover:opacity-80 transition-opacity h-full py-1"
            aria-label="出会えるマガジン トップへ"
          >
            <img
              src="/deaeru-magazine-logo.svg"
              alt="出会えるマガジン"
              width={320}
              height={88}
              className="h-12 sm:h-[3.25rem] md:h-14 lg:h-[3.75rem] w-auto max-w-[min(360px,82vw)] object-contain object-left max-h-full"
              decoding="async"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-5" aria-label="メインメニュー">
            {navItems.map((item) => (
              <Link
                key={item.category}
                href={item.href}
                className="text-sm text-gray-600 hover:text-[#00C853] transition-colors whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
            <a
              href="https://deaeru-agent.jp/deaeru/lp03z/default/"
              className="bg-[#00C853] hover:bg-[#00B248] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap"
            >
              無料診断する
            </a>
          </nav>

          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t">
          <nav className="flex flex-col p-4 space-y-3" aria-label="モバイルメニュー">
            {navItems.map((item) => (
              <Link
                key={item.category}
                href={item.href}
                className="text-left py-2 text-gray-600"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="https://deaeru-agent.jp/deaeru/lp03z/default/"
              className="block bg-[#00C853] text-white font-medium py-3 rounded-lg mt-2 text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              無料診断する
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
