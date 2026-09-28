export type ChatDataType = {
  loadingDelay: number;
  message: string;
  type: "bot" | "user";
};

export type StatusType = "analyzing" | "diagnosis" | "fv" | "result";

export type ScoreType = {
  balance: number;
  challenge: number;
  contribution: number;
  freedom: number;
  multidisciplinary: number;
  specialist: number;
  stability: number;
};

export type ScoreDataType = {
  balance: number;
  challenge: number;
  choice: string;
  contribution: number;
  freedom: number;
  multidisciplinary: number;
  specialist: number;
  stability: number;
}[];
