/**
 * lp14a ワークライフ占い診断（働き方フレーバー診断）の診断ロジック。
 *
 * 支給コード（占い診断LP_本番/index.html）の QUESTIONS / TYPES / judge / isTargetUser を
 * ロジックを変えずに TypeScript 化したもの。判定仕様は実装依頼書・判定フローチャートに準拠。
 *
 * 2軸モデル（各軸8問・+方向4問・-方向4問）:
 *   S軸（進め方）: +1 = 型・ルール志向 / -1 = 自律・マイルール志向
 *   P軸（ペース）: +1 = スピード・多忙志向 / -1 = 落ち着き・じっくり志向
 *   回答値: はい=+1 / どちらでもない=0 / いいえ=-1 → 軸スコア = Σ(dir × 回答値) = -8〜+8
 *
 * ※ フローチャートの「はい=2/どちら=1/いいえ=0 で軸合計を比較」と数学的に同じ差になる。
 *
 * 判定（CENTER_THRESHOLD = 1 は依頼書の決定事項）:
 *   |S| <= 1 かつ |P| <= 1 → magician
 *   S >= 0 かつ P <  0     → guardian（型 × 落ち着き）
 *   S >= 0 かつ P >= 0     → meister （型 × スピード）
 *   S <  0 かつ P <  0     → nomad   （自律 × 落ち着き）
 *   S <  0 かつ P >= 0     → sprinter（自律 × スピード）
 *   完全同点（S=0 / P=0）は支給コードどおり「型側 / スピード側」に倒す（2026-09-25 ユーザー確認済み）。
 */

export type FlavorType =
  | "guardian"
  | "meister"
  | "nomad"
  | "sprinter"
  | "magician";
export type AnswerValue = 1 | 0 | -1;
export type Answers = Record<string, AnswerValue>;

export interface Question {
  id: string;
  step: 1 | 2 | 3;
  axis: "S" | "P";
  dir: 1 | -1;
  text: string;
}

export const CENTER_THRESHOLD = 1;

export const QUESTIONS: Question[] = [
  /* --- Step 1（6問） --- */
  {
    id: "q1",
    step: 1,
    axis: "S",
    dir: 1,
    text: "ルールや手順が決まっている方が安心して取り組める",
  },
  {
    id: "q2",
    step: 1,
    axis: "P",
    dir: -1,
    text: "忙しく動き回るより、落ち着いて一つずつ進めたい",
  },
  {
    id: "q3",
    step: 1,
    axis: "S",
    dir: -1,
    text: "自分で決めたやり方で進めたい",
  },
  {
    id: "q4",
    step: 1,
    axis: "P",
    dir: 1,
    text: "のんびりした環境だと逆に物足りなく感じる",
  },
  {
    id: "q5",
    step: 1,
    axis: "S",
    dir: 1,
    text: "指示や型があると、むしろ動きやすいと感じる",
  },
  {
    id: "q6",
    step: 1,
    axis: "S",
    dir: -1,
    text: "細かく指示されるとやりづらく感じる",
  },
  /* --- Step 2（5問） --- */
  {
    id: "q7",
    step: 2,
    axis: "P",
    dir: -1,
    text: "自分のペースを乱されるとストレスを感じる",
  },
  {
    id: "q8",
    step: 2,
    axis: "S",
    dir: 1,
    text: "マニュアル通りに進めるのが得意だ",
  },
  {
    id: "q9",
    step: 2,
    axis: "P",
    dir: 1,
    text: "一度に多くのことを抱えて動くのが得意だ",
  },
  {
    id: "q10",
    step: 2,
    axis: "S",
    dir: -1,
    text: "任される範囲が広いほどやる気が出る",
  },
  {
    id: "q11",
    step: 2,
    axis: "P",
    dir: -1,
    text: "焦らずじっくり取り組みたい方だ",
  },
  /* --- Step 3（5問） --- */
  {
    id: "q12",
    step: 3,
    axis: "P",
    dir: -1,
    text: "静かで落ち着いた環境の方が力を発揮できる",
  },
  {
    id: "q13",
    step: 3,
    axis: "S",
    dir: 1,
    text: "迷ったときは、決まったやり方に従いたい",
  },
  { id: "q14", step: 3, axis: "P", dir: 1, text: "テキパキ動くのが好きだ" },
  {
    id: "q15",
    step: 3,
    axis: "S",
    dir: -1,
    text: "型にハマるより自分なりの工夫を加えたい",
  },
  {
    id: "q16",
    step: 3,
    axis: "P",
    dir: 1,
    text: "忙しいくらいの方がやる気が出る",
  },
];

export const CHOICES: { label: string; value: AnswerValue }[] = [
  { label: "はい", value: 1 },
  { label: "どちらでもない", value: 0 },
  { label: "いいえ", value: -1 },
];

export const TYPES: Record<FlavorType, { name: string; sub: string }> = {
  guardian: { name: "ガーディアン", sub: "定時退勤を守る" },
  meister: { name: "マイスター", sub: "早業でこなす" },
  nomad: { name: "ノマド", sub: "マイルールを貫く" },
  sprinter: { name: "スプリンター", sub: "全力で駆ける" },
  magician: { name: "マジシャン", sub: "自在に変わる" },
};

/** result-direct（非対象者向けLP内フル開示）のアクセシビリティ用テキスト。画像に焼き込み済みの内容と同一 */
export const RESULT_DETAILS: Record<
  FlavorType,
  {
    tagline: string;
    strength: string;
    growth: string;
    environment: string;
    tags: string[];
  }
> = {
  guardian: {
    tagline: "雲のように、穏やかに周りを包み込む人",
    strength: "決まった流れの中で自分のペースを守りながら着実に進められる",
    growth:
      "急な変化に慌てやすい面も。少しずつ対応の幅を広げるとさらに信頼が増す",
    environment:
      "繁閑差が激しくなく、決まった業務フローの中で自分のペースを保てる職場",
    tags: ["雲のような穏やかさ", "着実に積み上げる", "マイペースの安定感"],
  },
  meister: {
    tagline: "上品さの中に、キリッとした芯のある人",
    strength: "ルールや型を大事にしながらも、テキパキ数をこなせる",
    growth: "自由すぎる環境だと迷いやすい。自分なりの型を作ると力を発揮",
    environment:
      "一定のルール・手順がありながらもスピード感を持って業務をこなす職場",
    tags: ["上品さと芯の強さ", "正確さとスピード両立", "堅実な頑張り屋"],
  },
  nomad: {
    tagline: "霞むように、直感で自分の世界観を持つ人",
    strength: "自分の判断で、自分のリズムで物事を進められる",
    growth:
      "自由度が高すぎると迷うことも。大まかな指針だけ確認すると直感が冴える",
    environment: "裁量はありつつも、落ち着いたペースで自分のリズムを保てる職場",
    tags: ["直感で見えるもの", "マイペースな裁量派", "自分のリズムを大切に"],
  },
  sprinter: {
    tagline: "夕焼けのような、まっすぐで温かい存在感",
    strength: "任された裁量の中でスピード感を持ってどんどん前に進める",
    growth: "勢いで連携が抜けることも。一呼吸置くとさらに存在感が安定する",
    environment: "裁量が大きく、スピード感を持って成長・変化していける職場",
    tags: ["夕焼けのような情熱", "裁量フル活用", "前に進み続けたい"],
  },
  magician: {
    tagline: "見る角度で色を変える、しなやかな人",
    strength: "型にも裁量にも対応でき、状況に応じてペースを調整できる柔軟さ",
    growth: "どちらつかずになりやすい面も。得意分野を一つ持つと軸が定まる",
    environment: "安定した基盤がありつつ、裁量の余地もある職場",
    tags: ["移ろう色彩", "バランス感覚が強み", "どんな環境にも適応"],
  },
};

export interface JudgeResult {
  type: FlavorType;
  S: number;
  P: number;
}

export function scoreAxes(answers: Answers): { S: number; P: number } {
  let s = 0;
  let p = 0;
  for (const q of QUESTIONS) {
    const v = answers[q.id];
    if (typeof v !== "number") continue;
    if (q.axis === "S") s += q.dir * v;
    else p += q.dir * v;
  }
  return { S: s, P: p };
}

export function judge(answers: Answers): JudgeResult {
  const a = scoreAxes(answers);
  const c = CENTER_THRESHOLD;
  let type: FlavorType;
  if (Math.abs(a.S) <= c && Math.abs(a.P) <= c) type = "magician";
  else if (a.S >= 0 && a.P < 0) type = "guardian";
  else if (a.S >= 0 && a.P >= 0) type = "meister";
  else if (a.S < 0 && a.P < 0) type = "nomad";
  else type = "sprinter";
  return { type, S: a.S, P: a.P };
}

export function questionsOfStep(step: 1 | 2 | 3): Question[] {
  return QUESTIONS.filter((q) => q.step === step);
}

export function stepComplete(answers: Answers, step: 1 | 2 | 3): boolean {
  return questionsOfStep(step).every((q) => typeof answers[q.id] === "number");
}

export function allStepsComplete(answers: Answers): boolean {
  return (
    stepComplete(answers, 1) &&
    stepComplete(answers, 2) &&
    stepComplete(answers, 3)
  );
}

/* =====================================================================
   アンケート（年齢 / 希望勤務地）と送客対象の判定
   ===================================================================== */
export const AGE_MIN = 20;
export const AGE_MAX = 34;
/** 35歳以上はまとめて1つの選択肢（個別年齢は取得しない。対象外判定にのみ使用） */
export const AGE_OVER_LABEL = "35歳以上";
export const AGE_OVER_VALUE = 35;
/** この歳以上は希望勤務地が「その他」のみだと非対象。20代は「その他」のみでも対象（全国OK） */
export const AREA_AGE_LIMIT = 30;

export const AREA_OPTIONS = [
  "東京都",
  "神奈川県",
  "埼玉県",
  "千葉県",
  "愛知県",
  "京都府",
  "大阪府",
  "兵庫県",
  "福岡県",
  "その他",
] as const;

export const AGE_OPTIONS: { label: string; value: number }[] = [
  ...Array.from({ length: AGE_MAX - AGE_MIN + 1 }, (_, i) => {
    const age = AGE_MIN + i;
    return { label: `${age}歳`, value: age };
  }),
  { label: AGE_OVER_LABEL, value: AGE_OVER_VALUE },
];

/** 年齢の表示ラベル（DB保存・Slack通知用。35 は「35歳以上」） */
export function ageLabel(age: number | null): string {
  if (age === null) return "";
  return age >= AGE_OVER_VALUE ? AGE_OVER_LABEL : `${age}歳`;
}

/**
 * エージェントへ送客できる層か（対象者なら LINE 誘導、非対象者なら LP 内で結果を全開示）。
 *   ・35歳以上 → 非対象
 *   ・30〜34歳 かつ 希望勤務地が「その他」のみ → 非対象
 */
export function isTargetUser(age: number | null, areas: string[]): boolean {
  if (age === null || age > AGE_MAX) return false;
  const otherOnly = areas.length === 1 && areas[0] === "その他";
  if (otherOnly && age >= AREA_AGE_LIMIT) return false;
  return true;
}

export function formComplete(age: number | null, areas: string[]): boolean {
  return age !== null && areas.length > 0;
}
