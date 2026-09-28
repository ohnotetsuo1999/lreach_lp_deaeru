import { supabaseClient } from "@/lib/supabase";

export const addLP2Questions = async (questions: { [key: string]: string }) => {
  const { data, error } = await supabaseClient()
    .from("lp2_questions")
    .insert(questions)
    .select();

  return error ? [] : data;
};
