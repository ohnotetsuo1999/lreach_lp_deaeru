import { PostgrestError } from "@supabase/supabase-js";

import { addAnswersType } from "@/types/supabase";
import { supabaseClient } from "@/lib/supabase";

type AnswerResponse = {
  id: number;
  question_id: string;
  [key: string]: string | number;
};

export const addAnswers = async (
  answers: addAnswersType
): Promise<AnswerResponse[] | PostgrestError> => {
  const { data, error } = await supabaseClient()
    .from("answers")
    .insert(answers)
    .select();

  return error ? error : (data as AnswerResponse[]);
};

export const updateAnswers = async (answers: addAnswersType, id: number) => {
  const { data, error } = await supabaseClient()
    .from("answers")
    .update(answers)
    .eq("id", id);

  return error ? error : data;
};
