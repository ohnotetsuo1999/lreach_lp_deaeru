"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type RefObject,
} from "react";
import { useRouter } from "next/navigation";

import { Container, MaxWidth } from "@/components/common";
import { Radio } from "@/app/ih/lp01a/[id]/_components/form/Radio";
import { RadioCard } from "@/app/ih/lp01a/[id]/_components/form/RadioCard";
import { Select } from "@/app/ih/lp01a/[id]/_components/form/Select";
import { Submit } from "@/app/ih/lp01a/[id]/_components/form/Submit";
import { Textarea } from "@/app/ih/lp01a/[id]/_components/form/Textarea";
import { FormTitle } from "@/app/ih/lp01a/[id]/_components/ui/FormTitle";

interface Props {
  id: string;
}

export function Form({ id }: Props) {
  const entranceStylePreferenceRef = useRef<HTMLDivElement>(null);
  const kitchenStylePreferenceRef = useRef<HTMLDivElement>(null);
  const worksFromHomeRef = useRef<HTMLDivElement>(null);
  const clothingPreferenceRef = useRef<HTMLDivElement>(null);
  const hostsHomePartiesRef = useRef<HTMLDivElement>(null);
  const householdIncomeRef = useRef<HTMLDivElement>(null);
  const budgetEstimateRef = useRef<HTMLDivElement>(null);
  const preferredAreasRef = useRef<HTMLDivElement>(null);
  const otherRequirementsRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    taste_preference: "",
    entrance_style_preference: "",
    kitchen_style_preference: "",
    works_from_home: "",
    clothing_preference: "",
    hosts_home_parties: "",
    household_income: "",
    budget_estimate: "",
    preferred_areas: "",
    other_requirements: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const scrollToRef = (ref: RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // フォームデータ更新
  const updateFormData = (
    e:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLSelectElement>
      | ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    switch (name) {
      case "taste_preference":
        scrollToRef(entranceStylePreferenceRef);
        break;
      case "entrance_style_preference":
        scrollToRef(kitchenStylePreferenceRef);
        break;
      case "kitchen_style_preference":
        scrollToRef(worksFromHomeRef);
        break;
      case "works_from_home":
        scrollToRef(clothingPreferenceRef);
        break;
      case "clothing_preference":
        scrollToRef(hostsHomePartiesRef);
        break;
      case "hosts_home_parties":
        scrollToRef(householdIncomeRef);
        break;
      case "household_income":
        scrollToRef(budgetEstimateRef);
        break;
      case "budget_estimate":
        scrollToRef(preferredAreasRef);
        break;
      case "preferred_areas":
        scrollToRef(otherRequirementsRef);
        break;
    }
  };

  // フォーム送信
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    const form = e.currentTarget;

    /* すべての入力要素を取り出して */
    const controls = Array.from(
      form.querySelectorAll<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >("input, select, textarea")
    );

    /* 最初の不正要素を自前で判定 */
    const invalid = controls.find((el) => !el.checkValidity());
    if (invalid) {
      const target =
        (invalid.closest("[data-field]") as HTMLElement) ?? invalid;

      /* rAFでタイミングを合わせるとiOSで安定 */
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        invalid.focus?.({ preventScroll: true });
        invalid.reportValidity?.();
      });
      setIsSubmitting(false);
      return;
    }

    /* 送信処理 */
    try {
      sessionStorage.setItem("form:v1", JSON.stringify(formData));
      router.push(`/ih/form01a/${id}`);
    } catch {
      console.error("送信に失敗しました。確認して再度お試しください。");
      setIsSubmitting(false);
    }
  };

  /* ページ離脱時にデータを送信 */
  useEffect(() => {
    const handlePagehide = () => {
      if (window.location.href.includes("localhost") || isSubmitting) return;

      const heatmapBlob = new Blob(
        [JSON.stringify({ ...formData, referral_cr: id })],
        {
          type: "application/json",
        }
      );

      navigator.sendBeacon("/api/spreadsheet/ih/heatmap", heatmapBlob);
    };

    window.addEventListener("pagehide", handlePagehide);

    return () => {
      window.removeEventListener("pagehide", handlePagehide);
    };
  }, [formData, id, isSubmitting]);

  return (
    <section className="relative">
      <MaxWidth>
        <form noValidate onSubmit={handleSubmit}>
          <div className="relative bg-[rgb(189,77,91)]">
            <div className="absolute -inset-x-px -top-px h-[42px] bg-[rgb(255,249,238)] [clip-path:polygon(0_0,_100%_0,_50%_100%)]" />
            <Container width="90">
              <div className="pb-[57px] pt-16">
                <img
                  className="mx-auto mb-[21px] w-[62%]"
                  src="/ih-lp01a-form-title.svg"
                  alt="おうちタイプ診断 診断する"
                />
                <div className="bg-[rgb(255,249,238)] py-[24px]">
                  <FormTitle title="まずはお好みのスタイルについて<br />教えてください！" />
                  <div className="mb-[26px] flex flex-col gap-[18px]">
                    <RadioCard
                      label="どちらのテイストが好き？"
                      name="taste_preference"
                      number="01"
                      onChange={updateFormData}
                      radioData={[
                        {
                          image: "/ih-lp01a-form-taste-preference-1.jpg",
                          value: "ナチュラル系",
                        },
                        {
                          image: "/ih-lp01a-form-taste-preference-2.jpg",
                          value: "モダン系",
                        },
                      ]}
                      required={true}
                    />
                    <RadioCard
                      label="どちらの玄関スタイルが好き？"
                      name="entrance_style_preference"
                      number="02"
                      onChange={updateFormData}
                      radioData={[
                        {
                          image:
                            "/ih-lp01a-form-entrance-style-preference-1.jpg",
                          value: "スタイリッシュ系",
                        },
                        {
                          image:
                            "/ih-lp01a-form-entrance-style-preference-2.jpg",
                          value: "ナチュラル系",
                        },
                      ]}
                      ref={entranceStylePreferenceRef}
                      required={true}
                    />
                    <RadioCard
                      label="どちらのキッチンスタイルが好き？"
                      name="kitchen_style_preference"
                      number="03"
                      onChange={updateFormData}
                      radioData={[
                        {
                          image:
                            "/ih-lp01a-form-kitchen_style-preference-1.jpg",
                          value: "北欧系",
                        },
                        {
                          image:
                            "/ih-lp01a-form-kitchen_style-preference-2.jpg",
                          value: "ラグジュアリー系",
                        },
                      ]}
                      ref={kitchenStylePreferenceRef}
                      required={true}
                    />
                  </div>
                  <FormTitle title="間取りや空間コーデを診断するために<br />あなたの好みを教えてください！" />
                  <div className="mb-[14px] flex flex-col gap-[18px]">
                    <Radio
                      label="自宅で仕事をする機会はありますか？"
                      name="works_from_home"
                      number="04"
                      onChange={updateFormData}
                      radioData={["はい", "いいえ", "ときどきある"]}
                      ref={worksFromHomeRef}
                      required={true}
                    />
                    <Radio
                      label="洋服の好みは次のうちどれですか？"
                      name="clothing_preference"
                      number="05"
                      onChange={updateFormData}
                      radioData={[
                        "無地シンプル",
                        "人とかぶらないデザイン",
                        "ブランド",
                      ]}
                      ref={clothingPreferenceRef}
                      required={true}
                    />
                    <Radio
                      label="自宅で友人を招いて<br />ホームパーティーをしたいですか？"
                      name="hosts_home_parties"
                      number="06"
                      onChange={updateFormData}
                      radioData={["はい", "いいえ", "わからない"]}
                      ref={hostsHomePartiesRef}
                      required={true}
                    />
                  </div>
                  <p className="mb-[14px] text-center font-zen-maru-gothic text-lg font-bold text-[rgb(189,77,91)]">
                    ＼診断完了までもう少し／
                  </p>
                  <FormTitle title="理想の条件に合った<br />お家づくりのための質問です！" />
                  <div className="flex flex-col gap-[18px]">
                    <Select
                      label="どれくらいのローンを<br />ご利用いただけるか算出するため<br />世帯年収を教えてください!"
                      name="household_income"
                      number="07"
                      onChange={updateFormData}
                      optionData={[
                        "500万円以下",
                        "500〜600万円",
                        "600〜700万円",
                        "700〜800万円",
                        "800〜900万円",
                        "900万円以上",
                      ]}
                      ref={householdIncomeRef}
                      required={true}
                    />
                    <Select
                      label="想定のご予算を教えてください!"
                      name="budget_estimate"
                      number="08"
                      onChange={updateFormData}
                      optionData={[
                        "2,000万円以下",
                        "2,000～3,000万円",
                        "3,000～4,000万円",
                        "4,000～5,000万円",
                        "5,000～7,000万円",
                        "7,000万円以上",
                      ]}
                      ref={budgetEstimateRef}
                      required={true}
                    />
                    <Select
                      label="ご希望のエリアを教えてください!"
                      name="preferred_areas"
                      number="09"
                      onChange={updateFormData}
                      optionData={[
                        "つくば市",
                        "水戸市",
                        "日立市",
                        "ひたちなか市",
                        "土浦市",
                        "古河市",
                        "鹿嶋市",
                        "その他",
                      ]}
                      ref={preferredAreasRef}
                      required={true}
                    />
                    <Textarea
                      label="その他ご希望の条件が<br />あれば教えてください！"
                      name="other_requirements"
                      number="10"
                      onChange={updateFormData}
                      ref={otherRequirementsRef}
                      value={formData.other_requirements}
                    />
                  </div>
                </div>
              </div>
            </Container>
            <div className="absolute -inset-x-px -bottom-px h-[42px] bg-[rgb(255,249,238)] [clip-path:polygon(0_0,50%_100%,100%_0,100%_100%,0_100%)]" />
          </div>
          <Submit isSubmitting={isSubmitting} />
        </form>
      </MaxWidth>
    </section>
  );
}
