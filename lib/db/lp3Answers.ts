import { supabaseClient } from "@/lib/supabase";

export const addLP3Answers = async (answers: {
  [key: string]: boolean | number | string | null;
}) => {
  const { data, error } = await supabaseClient()
    .from("lp3_answers")
    .insert(answers)
    .select();

  return error ? [] : data;
};
