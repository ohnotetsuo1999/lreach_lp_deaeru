import { supabaseClient } from "@/lib/supabase";

export const addLP3Questions = async (questions: { [key: string]: string }) => {
  const { data, error } = await supabaseClient()
    .from("lp3_questions")
    .insert(questions)
    .select();

  return error ? [] : data;
};
