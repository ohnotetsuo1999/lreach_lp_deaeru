import { supabaseClient } from "@/lib/supabase";

export const addLP2Answers = async (answers: {
  [key: string]: number | string;
}) => {
  const { data, error } = await supabaseClient()
    .from("lp2_answers")
    .insert(answers)
    .select();

  return error ? [] : data;
};
