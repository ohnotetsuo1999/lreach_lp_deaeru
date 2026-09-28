import { Message } from "@line/bot-sdk";

export function onAction(name: string): Message[] {
  return [
    {
      type: "text",
      text: [
        `${name}さん、`,
        "【逆転転職エージェント診断】",
        "にご興味を持っていただき",
        "ありがとうございます✨",
        "",
        "後ほど弊社の",
        "『逆転コンサルタント』より",
        "",
        "✔エージェント診断",
        "✔エージェントの選び方",
        "✔エージェント選びの失敗例",
        "",
        "などについて、丁寧に",
        "ご案内させていただきます！",
        "",
        "希望を全て叶えた",
        "転職にするために",
        "",
        "まずはLINEで",
        `${name}さんの`,
        "",
        "✅仕事でのお悩み",
        "✅転職希望条件",
        "✅人生設計",
        "などを教えてください💡",
        "",
        "※可能な範囲でご回答ください✨",
      ].join("\n"),
      sender: {
        name: "逆転コンサルタント 黒崎",
        iconUrl:
          "https://etfnbkrneepqkgdnpmru.supabase.co/storage/v1/object/public/line-images/6-min.jpg",
      },
    },
  ];
}
