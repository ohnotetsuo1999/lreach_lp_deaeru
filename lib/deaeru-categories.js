export const deaeruCategories = [
  { id: "all", label: "すべて", color: "#00C853" },
  { id: "agent-guide", label: "転職エージェント", color: "#00C853" },
  { id: "career-start", label: "転職の始め方", color: "#2196F3" },
  { id: "interview-prep", label: "面接対策", color: "#FF9800" },
  { id: "industry-guide", label: "職種・業界", color: "#9C27B0" },
  { id: "salary-career", label: "年収・キャリア", color: "#F44336" },
  { id: "anxiety-resolve", label: "悩み・不安解消", color: "#607D8B" },
];

export function getDeaeruCategoryById(id) {
  return deaeruCategories.find((c) => c.id === id);
}
