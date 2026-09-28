"use client";

import { useCallback, useEffect, useState } from "react";
import { LP1Data } from "@/constants";

import { ScoreDataType, ScoreType, StatusType } from "@/types/lp1";
import { addAnswers, updateAnswers } from "@/lib/db/answers";
import { addQuestions } from "@/lib/db/questions";
import { Analyzing, Diagnosis, FV, Result } from "@/components/lp1";

export function Page() {
  const [answersId, setAnswersId] = useState<number | null>(null),
    [isAnalyzing, setIsAnalyzing] = useState<boolean>(false),
    [isStatus, setIsStatus] = useState<StatusType>("fv"),
    [questionData, setQuestionData] = useState<string[]>([]),
    [scoreData, setScoreData] = useState<ScoreDataType[]>([]),
    [scores, setScores] = useState<ScoreType>({
      balance: 0,
      challenge: 0,
      contribution: 0,
      freedom: 0,
      multidisciplinary: 0,
      specialist: 0,
      stability: 0,
    });

  const updateToSupabase = (answer: { [key: string]: string | boolean }) => {
    if (answersId) {
      updateAnswers(answer, answersId);
    }
  };

  const updateIsAnalyzing = (bool: boolean) => {
    setIsAnalyzing(bool);
  };

  const updateIsStatus = (status: StatusType) => {
    setIsStatus(status);
  };

  const updateScores = (data: ScoreType) => {
    setScores((prev) => ({
      ...prev,
      balance: prev.balance + data.balance,
      challenge: prev.challenge + data.challenge,
      contribution: prev.contribution + data.contribution,
      freedom: prev.freedom + data.freedom,
      multidisciplinary: prev.multidisciplinary + data.multidisciplinary,
      specialist: prev.specialist + data.specialist,
      stability: prev.stability + data.stability,
    }));
  };

  const addToSupabase = useCallback(async () => {
    const convertToObj = (data: string[], key: string) => {
      return Object.fromEntries(data.map((d, n) => [`${key}_${n + 1}`, d]));
    };

    const questions = {
      title: "AI転職診断",
      ...convertToObj(questionData, "question"),
    };

    const addQuestionsData = await addQuestions(questions);

    if (Array.isArray(addQuestionsData) && addQuestionsData.length > 0) {
      const questionsId = addQuestionsData[0].id;

      const answers = {
        question_id: questionsId.toString(),
      };

      const addAnswersData = await addAnswers(answers);

      if (Array.isArray(addAnswersData) && addAnswersData.length > 0) {
        setAnswersId(addAnswersData[0].id);
      } else {
        alert("エラーが発生しました。再度お試しください。");
      }
    } else {
      alert("エラーが発生しました。再度お試しください。");
    }
  }, [questionData]);

  useEffect(() => {
    setQuestionData(LP1Data.diagnosis_question_data.map((d) => d.question));
    setScoreData(LP1Data.diagnosis_question_data.map((d) => d.score_data));
  }, []);

  useEffect(() => {
    addToSupabase();
  }, [addToSupabase]);

  useEffect(() => {
    if (isAnalyzing) {
      setTimeout(() => {
        updateIsStatus("result");
      }, 2000);
    }
  }, [isAnalyzing]);

  const setComponent = () => {
    switch (isStatus) {
      case "analyzing":
        return <Analyzing />;

      case "diagnosis":
        return (
          <Diagnosis
            questionData={questionData}
            scoreData={scoreData}
            updateIsAnalyzing={updateIsAnalyzing}
            updateIsStatus={updateIsStatus}
            updateScores={updateScores}
            updateToSupabase={updateToSupabase}
          />
        );

      case "fv":
        return <FV updateIsStatus={updateIsStatus} />;

      case "result":
        return (
          <Result
            answersId={answersId}
            scores={scores}
            updateToSupabase={updateToSupabase}
          />
        );
    }
  };

  return <main className="mx-auto max-w-lg">{setComponent()}</main>;
}
