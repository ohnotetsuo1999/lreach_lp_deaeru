export function formatDataForSupabase(
  questionsData: string[],
  answersData: { [key: string]: number | string | string[] | null }
) {
  const addQuestionsData = Object.fromEntries(
    questionsData.map((question, index) => [`question_${index + 1}`, question])
  );
  const addAnswersData = Object.fromEntries(
    Object.values(answersData).map((data, index) => [
      `answer_${index + 1}`,
      (typeof data === "string" && data.trim() === "") ||
      (Array.isArray(data) && data.length === 0)
        ? null
        : data,
    ])
  );

  return {
    addQuestionsData: addQuestionsData,
    addAnswersData: addAnswersData,
  };
}
