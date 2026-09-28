import { supabaseClient } from "@/lib/supabase";

export const addDBAnswers = async (answers: {
  [key: string]: boolean | number | string | string[] | null;
}) => {
  const { data, error } = await supabaseClient()
    .from("db_answers")
    .insert(answers)
    .select();

  return error ? [] : data;
};
