import Link from "next/link";
import { ArrowRight, AlertCircle, CheckCircle2, XCircle, Lightbulb, TrendingUp } from "lucide-react";
import { ReactNode } from "react";

// インサイトカード（重要なポイント）
export function InsightCard({ children, type = "info" }: { children: ReactNode; type?: "info" | "success" | "warning" | "danger" }) {
  const styles = {
    info: "bg-blue-50 border-blue-300 text-blue-800",
    success: "bg-green-50 border-green-300 text-green-800",
    warning: "bg-yellow-50 border-yellow-300 text-yellow-800",
    danger: "bg-red-50 border-red-300 text-red-800",
  };

  const icons = {
    info: <Lightbulb className="h-6 w-6" />,
    success: <CheckCircle2 className="h-6 w-6" />,
    warning: <AlertCircle className="h-6 w-6" />,
    danger: <XCircle className="h-6 w-6" />,
  };

  return (
    <div className={`my-6 rounded-xl border-2 p-6 ${styles[type]}`}>
      <div className="flex gap-4">
        <div className="shrink-0">{icons[type]}</div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}

// 引用ブロック
export function QuoteBlock({ children, author }: { children: ReactNode; author?: string }) {
  return (
    <blockquote className="my-6 rounded-xl border-l-4 border-green-500 bg-gray-50 p-6">
      <div className="italic text-gray-700">{children}</div>
      {author && (
        <footer className="mt-3 text-sm font-semibold text-gray-600">
          — {author}
        </footer>
      )}
    </blockquote>
  );
}

// 数値強調ボックス
export function StatsBox({ label, value, change }: { label: string; value: string; change?: string }) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 p-6 text-center border border-green-200">
      <p className="mb-2 text-sm font-semibold text-gray-600">{label}</p>
      <p className="mb-1 text-4xl font-bold text-green-600">{value}</p>
      {change && (
        <div className="flex items-center justify-center gap-1 text-sm font-semibold text-green-700">
          <TrendingUp className="h-4 w-4" />
          <span>{change}</span>
        </div>
      )}
    </div>
  );
}

// 比較テーブル
export function ComparisonTable({
  items,
}: {
  items: Array<{
    label: string;
    before: string;
    after: string;
  }>;
}) {
  return (
    <div className="my-8 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
            <th className="border-b border-gray-200 px-4 py-3 text-left text-sm font-bold text-gray-700">
              項目
            </th>
            <th className="border-b border-gray-200 px-4 py-3 text-center text-sm font-bold text-red-600">
              使わない場合
            </th>
            <th className="border-b border-gray-200 px-4 py-3 text-center text-sm font-bold text-green-600">
              使った場合
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {items.map((item, index) => (
            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-4 font-semibold text-gray-800">{item.label}</td>
              <td className="px-4 py-4 text-center text-sm text-gray-600 bg-red-50">{item.before}</td>
              <td className="px-4 py-4 text-center text-sm font-semibold text-green-700 bg-green-50">{item.after}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ステップカード
export function StepCard({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-white p-6">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-400 shadow-md">
          <span className="text-xl font-bold text-white">{number}</span>
        </div>
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      </div>
      <p className="ml-15 text-sm text-gray-600">{description}</p>
    </div>
  );
}

// チェックリスト
export function CheckList({ items, type = "success" }: { items: string[]; type?: "success" | "danger" }) {
  const Icon = type === "success" ? CheckCircle2 : XCircle;
  const colorClass = type === "success" ? "text-green-600" : "text-red-600";
  const bgClass = type === "success" ? "bg-green-50" : "bg-red-50";
  const borderClass = type === "success" ? "border-green-200" : "border-red-200";

  return (
    <div className={`my-6 rounded-xl border-2 ${borderClass} ${bgClass} p-6`}>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <Icon className={`h-5 w-5 shrink-0 ${colorClass}`} />
            <span className="text-sm text-gray-700">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// CTA埋め込み
export function InlineCTA({ text }: { text: string }) {
  return (
    <div className="my-10 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center text-white shadow-xl">
      <p className="mb-4 text-xl font-bold">{text}</p>
      <Link
        href="/gt/lp01deaeru/1"
        className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 font-bold text-green-600 shadow-lg transition hover:scale-105"
      >
        無料診断をはじめる
        <ArrowRight className="h-5 w-5" />
      </Link>
    </div>
  );
}

// 体験談カード
export function TestimonialCard({ name, age, beforeSalary, afterSalary, story }: {
  name: string;
  age: number;
  beforeSalary: string;
  afterSalary: string;
  story: string;
}) {
  return (
    <div className="my-6 rounded-xl bg-gradient-to-br from-yellow-50 to-amber-50 p-6 border-2 border-yellow-200 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-bold text-gray-800">{name}（{age}歳）</p>
        </div>
        <div className="rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-1">
          <p className="text-sm font-bold text-white">成功事例</p>
        </div>
      </div>
      <div className="mb-4 flex items-center gap-3">
        <span className="text-lg font-semibold text-gray-600">{beforeSalary}</span>
        <ArrowRight className="h-5 w-5 text-green-600" />
        <span className="text-2xl font-bold text-green-600">{afterSalary}</span>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">{story}</p>
    </div>
  );
}

// アラートボックス
export function AlertBox({ children, type = "warning" }: { children: ReactNode; type?: "warning" | "danger" | "info" }) {
  const styles = {
    warning: "bg-yellow-50 border-yellow-400 text-yellow-800",
    danger: "bg-red-50 border-red-400 text-red-800",
    info: "bg-blue-50 border-blue-400 text-blue-800",
  };

  return (
    <div className={`my-6 rounded-xl border-2 p-6 ${styles[type]}`}>
      <div className="flex items-start gap-3">
        <AlertCircle className="h-6 w-6 shrink-0" />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
