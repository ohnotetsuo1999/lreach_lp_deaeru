import { PostgrestError } from "@supabase/supabase-js";

import { addQuestionsType } from "@/types/supabase";
import { supabaseClient } from "@/lib/supabase";

type QuestionResponse = {
  id: number;
  title: string;
  created_at: string;
};

export const addQuestions = async (
  questions: addQuestionsType
): Promise<QuestionResponse[] | PostgrestError> => {
  const { data, error } = await supabaseClient()
    .from("questions")
    .insert(questions)
    .select();

  return error ? error : (data as QuestionResponse[]);
};
