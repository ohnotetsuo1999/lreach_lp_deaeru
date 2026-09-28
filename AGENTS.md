# Lreach LP の作業境界

- 日本語で簡潔に報告する。呼称はLreach。
- 新規LP発行は `.agents/skills/lp-saiban/SKILL.md` と共通スクリプトを使う。
- LPデザイン・表示を編集する。回答の保存契約、認証、通知先、シナリオはLreach backend側の管理対象。
- DBキーやSlack/LINEトークンをこのリポジトリに置かない。
- 利用者の未コミット変更を保持する。依頼IDを変更して不明な送信・採番を再実行しない。
- このLP専用リポジトリはmainのみで運用し、作業ブランチやdevelopは作成しない。対象変更を検証してmainへコミット・pushする。
- Previewと本番を区別する。mainへのpushだけで本番公開済みとは扱わない。Production昇格・ドメイン移管・実送信は承認済みの範囲に限る。既存Lreach本体のdevelop/mainへのマージは別管理。
- 発行結果はLP番号・確認URL・検証済み範囲・未確認事項を報告する。
