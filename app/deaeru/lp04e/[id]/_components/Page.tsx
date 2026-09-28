"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/utils";
import { useLpActionStatistics } from "@/app/deaeru/_shared/useLpActionStatistics";

const GTM_ID = "GTM-W7S9ZNV8";
const GAS_URL =
  "https://script.google.com/macros/s/AKfycbzKbw2JwXH3rDYvlZrrFpJtEZ8SRBoQpbz-OQU5mMR65e8zHjz9T1WVc1UmFnf_2A0w/exec";

interface DiagnosisFormData {
  age: string;
  gender: string;
  status: string;
  location: string;
  job: string;
  income: string;
  company: string;
}

const initialFormData: DiagnosisFormData = {
  age: "",
  gender: "",
  status: "",
  location: "",
  job: "",
  income: "",
  company: "",
};

function isAllFieldsFilled(data: DiagnosisFormData): boolean {
  return (
    data.age !== "" &&
    data.gender !== "" &&
    data.status !== "" &&
    data.location !== "" &&
    data.job !== "" &&
    data.income !== "" &&
    data.company !== ""
  );
}

interface Props {
  id: string;
}

export function Page({ id }: Props) {
  // LP行動集計シートへの行動計測（2026-07-24 実装漏れ監査で追加）
  const { markCtaClicked } = useLpActionStatistics("deaeru-lp04e");
  const router = useRouter();
  const [formData, setFormData] = useState<DiagnosisFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const ctaButtonRef = useRef<HTMLAnchorElement>(null);
  const resultUrl = `/deaeru/lp04e/${id}/result`;

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  function handleRadioChange(name: keyof DiagnosisFormData, value: string): void {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSelectChange(name: keyof DiagnosisFormData, value: string): void {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function sendToGas(data: DiagnosisFormData): Promise<void> {
    try {
      await fetch(GAS_URL, {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch {
      console.error("[GAS送信] 送信に失敗しました");
    }
  }

  async function saveToSupabase(data: DiagnosisFormData): Promise<boolean> {
    try {
      const supabase = createClient();

      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .insert({ created_at: new Date().toISOString() })
        .select("id")
        .single();

      if (usersError) {
        console.error("[Supabase保存] usersエラー:", usersError);
        return false;
      }

      const { id: usersId } = usersData;

      const { error: lpSessionsError } = await supabase
        .from("lp_sessions")
        .insert({
          answers: data,
          is_submitted: true,
          lp_key: `deaeru-lp04e-${id}`,
          referrer_url: currentUrl,
          user_id: usersId,
        });

      if (lpSessionsError) {
        console.error("[Supabase保存] lp_sessionsエラー:", lpSessionsError);
        return false;
      }

      return true;
    } catch (error) {
      console.error("[Supabase保存] 例外発生:", error);
      return false;
    }
  }

  async function sendSlackNotification(data: DiagnosisFormData): Promise<void> {
    try {
      await fetch("/api/slack/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: "C0ACG4U5G68",
          text: [
            "【転職サービス診断_LP04e に回答しました】",
            `回答日時：${formatDate(new Date())}`,
            `年齢：${data.age}`,
            `性別：${data.gender}`,
            `現職：${data.status}`,
            `勤務希望地：${data.location}`,
            `職種：${data.job}`,
            `年収：${data.income}`,
            `希望企業規模：${data.company}`,
            `流入CR：${currentUrl}`,
          ].join("\n"),
        }),
      });
    } catch {
      console.error("[Slack通知] 送信に失敗しました");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    markCtaClicked(); // 行動集計のCTAクリック記録

    if (!isAllFieldsFilled(formData)) {
      alert("すべての質問にお答えください");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await Promise.all([
        sendToGas(formData),
        saveToSupabase(formData),
        sendSlackNotification(formData),
      ]);

      router.push(`/deaeru/lp04e/${id}/result`);
    } catch {
      alert("送信に失敗しました");
      setIsSubmitting(false);
    }
  }

  const radioGroupBase = "grid gap-2";

  return (
    <div className="min-h-screen bg-white font-sans text-[#333]">
      <Script id="lp04e-gtm" strategy="afterInteractive">{`
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');
      `}</Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>

      <div className="mx-auto max-w-[480px]">
        {/* ページ1画像 */}
        <img
          src="/tensyoku-shindan_page1.png"
          alt="転職サービス診断 失敗しないサービス選びの法則"
          className="block w-full"
        />

        {/* 診断フォームセクション */}
        <section className="bg-[#fffbf0] px-4 pb-10 pt-[30px]">
          <div className="mb-5 text-center">
            <span className="mb-[10px] inline-block rounded-[3px] bg-[#1b2f5e] px-[14px] py-[3px] text-xs text-white">
              転職サービス選びの法則
            </span>
            <div className="mb-1.5 flex justify-center gap-6 text-xl font-bold text-[#1b2f5e]">
              <span className="border-b-[5px] border-[#ffcc00]">年齢</span>
              <span className="border-b-[5px] border-[#ffcc00]">地域</span>
              <span className="border-b-[5px] border-[#ffcc00]">職種</span>
            </div>
            <p className="text-center text-xs text-[#666]">この3つを基本に選びましょう</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className={isSubmitting ? "pointer-events-none" : ""}
          >
            <div className="overflow-hidden rounded-lg bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
              {/* Q1 年齢 */}
              <QuestionBlock
                number={1}
                question="年齢を教えてください"
              >
                <div className={`${radioGroupBase} grid-cols-2`}>
                  {[
                    { label: "24歳以下", value: "24以下" },
                    { label: "25歳〜29歳", value: "25-29" },
                    { label: "30歳〜34歳", value: "30-34" },
                    { label: "35歳〜39歳", value: "35-39" },
                    { label: "40歳〜44歳", value: "40-44" },
                    { label: "45歳〜49歳", value: "45-49" },
                    { label: "50歳以上", value: "50以上" },
                  ].map(({ label, value }) => (
                    <RadioItem
                      key={value}
                      name="age"
                      value={value}
                      label={label}
                      checked={formData.age === value}
                      onChange={() => handleRadioChange("age", value)}
                    />
                  ))}
                </div>
              </QuestionBlock>

              {/* Q2 性別 */}
              <QuestionBlock number={2} question="性別を教えてください">
                <div className={`${radioGroupBase} grid-cols-3`}>
                  {[
                    { label: "男性", value: "male" },
                    { label: "女性", value: "female" },
                    { label: "その他", value: "other" },
                  ].map(({ label, value }) => (
                    <RadioItem
                      key={value}
                      name="gender"
                      value={value}
                      label={label}
                      checked={formData.gender === value}
                      onChange={() => handleRadioChange("gender", value)}
                    />
                  ))}
                </div>
              </QuestionBlock>

              {/* Q3 現職 */}
              <QuestionBlock number={3} question="現職について">
                <div className={`${radioGroupBase} grid-cols-1`}>
                  {[
                    { label: "在職中", value: "employed" },
                    { label: "求職中", value: "seeking" },
                    { label: "フリーター（派遣・アルバイト）", value: "freeter" },
                  ].map(({ label, value }) => (
                    <RadioItem
                      key={value}
                      name="status"
                      value={value}
                      label={label}
                      checked={formData.status === value}
                      onChange={() => handleRadioChange("status", value)}
                    />
                  ))}
                </div>
              </QuestionBlock>

              {/* Q4 勤務希望地 */}
              <QuestionBlock number={4} question="勤務希望地を教えてください">
                <select
                  name="location"
                  value={formData.location}
                  onChange={(e) => handleSelectChange("location", e.target.value)}
                  className="w-full cursor-pointer appearance-none rounded border border-[#ddd] bg-white bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%2712%27%20height%3D%278%27%20viewBox%3D%270%200%2012%208%27%3E%3Cpath%20d%3D%27M1%201l5%205%205-5%27%20stroke%3D%27%23666%27%20stroke-width%3D%271.5%27%20fill%3D%27none%27%20stroke-linecap%3D%27round%27%2F%3E%3C%2Fsvg%3E')] bg-[right_12px_center] bg-no-repeat px-3 py-[10px] text-sm text-[#333]"
                >
                  <option value="">選んでください</option>
                  <option>北海道</option>
                  <option>東北</option>
                  <option>関東（東京・神奈川・埼玉・千葉）</option>
                  <option>東海（愛知・静岡）</option>
                  <option>関西（大阪・兵庫・京都）</option>
                  <option>中国・四国</option>
                  <option>九州・沖縄</option>
                  <option>リモート・在宅</option>
                </select>
              </QuestionBlock>

              {/* Q5 担当職種 */}
              <QuestionBlock number={5} question="現在で担当の職種は？">
                <select
                  name="job"
                  value={formData.job}
                  onChange={(e) => handleSelectChange("job", e.target.value)}
                  className="w-full cursor-pointer appearance-none rounded border border-[#ddd] bg-white bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%2712%27%20height%3D%278%27%20viewBox%3D%270%200%2012%208%27%3E%3Cpath%20d%3D%27M1%201l5%205%205-5%27%20stroke%3D%27%23666%27%20stroke-width%3D%271.5%27%20fill%3D%27none%27%20stroke-linecap%3D%27round%27%2F%3E%3C%2Fsvg%3E')] bg-[right_12px_center] bg-no-repeat px-3 py-[10px] text-sm text-[#333]"
                >
                  <option value="">選んでください</option>
                  <option>営業</option>
                  <option>企画・マーケティング</option>
                  <option>エンジニア・IT</option>
                  <option>事務・管理</option>
                  <option>販売・接客</option>
                  <option>医療・福祉</option>
                  <option>製造・物流</option>
                  <option>その他・未経験</option>
                </select>
              </QuestionBlock>

              {/* Q6 年収 */}
              <QuestionBlock number={6} question="今の年収を教えてください">
                <div className={`${radioGroupBase} grid-cols-2`}>
                  {[
                    { label: "〜300万円", value: "300" },
                    { label: "〜400万円", value: "400" },
                    { label: "〜500万円", value: "500" },
                    { label: "〜600万円", value: "600" },
                    { label: "〜700万円", value: "700" },
                    { label: "701万円以上", value: "701+" },
                  ].map(({ label, value }) => (
                    <RadioItem
                      key={value}
                      name="income"
                      value={value}
                      label={label}
                      checked={formData.income === value}
                      onChange={() => handleRadioChange("income", value)}
                    />
                  ))}
                </div>
              </QuestionBlock>

              {/* Q7 企業規模 */}
              <QuestionBlock number={7} question="どんな企業に入りたいですか？">
                <div className={`${radioGroupBase} grid-cols-2`}>
                  {[
                    { label: "大手企業", value: "large" },
                    { label: "中小企業", value: "sme" },
                    { label: "ベンチャー企業", value: "venture" },
                    { label: "特にない", value: "none" },
                  ].map(({ label, value }) => (
                    <RadioItem
                      key={value}
                      name="company"
                      value={value}
                      label={label}
                      checked={formData.company === value}
                      onChange={() => handleRadioChange("company", value)}
                    />
                  ))}
                </div>
              </QuestionBlock>

              {/* 送信ボタン */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="block w-full cursor-pointer rounded-b-lg bg-[#e85d14] px-4 py-[18px] text-center text-lg font-bold tracking-[1px] text-white transition-colors hover:bg-[#cf4e0a] disabled:opacity-70"
              >
                {isSubmitting ? "送信中..." : "診断結果を見る ›"}
              </button>
            </div>
          </form>
        </section>

        {/* ページ2画像 + CTAボタン（結果ページへ遷移） */}
        <div className="relative">
          <img
            src="/tensyoku-shindan_page2.png"
            alt="転職サービス比較 3つのポイント"
            className="block w-full"
          />
          <a
            ref={ctaButtonRef}
            href={resultUrl}
            className="absolute bottom-[17vw] left-0 right-0 block animate-[float_2s_ease-in-out_infinite] px-6 sm:bottom-20"
          >
            <img
              src="/CTA_button.png"
              alt="自分に最適な転職サービスを調べる"
              className="block w-full"
            />
          </a>
        </div>

        <footer className="bg-[#111] py-4 text-center text-[11px] text-[#888]">
          © 転職サービス診断
        </footer>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}

interface QuestionBlockProps {
  number: number;
  question: string;
  children: React.ReactNode;
}

function QuestionBlock({ number, question, children }: QuestionBlockProps) {
  return (
    <div className="border-b border-[#f0f0f0] p-4 last:border-b-0">
      <div className="mb-3 flex items-center gap-2">
        <span className="rounded-[3px] bg-[#e85d14] px-2 py-[2px] text-[11px] font-bold text-white">
          質問{number}
        </span>
        <span className="text-sm font-bold text-[#333]">{question}</span>
      </div>
      {children}
    </div>
  );
}

interface RadioItemProps {
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}

function RadioItem({ name, value, label, checked, onChange }: RadioItemProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 cursor-pointer accent-[#e85d14]"
      />
      {label}
    </label>
  );
}
