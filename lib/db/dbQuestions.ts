import { supabaseClient } from "@/lib/supabase";

export const addDBQuestions = async (questions: { [key: string]: string }) => {
  const { data, error } = await supabaseClient()
    .from("db_questions")
    .insert(questions)
    .select();

  return error ? [] : data;
};
