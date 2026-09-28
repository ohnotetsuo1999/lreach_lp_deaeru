import { supabaseClient } from "@/lib/supabase";

// 流入経路登録
export const addInflowPath = async (inflowPath: Record<string, string>) => {
  const { data, error } = await supabaseClient()
    .from("inflow_path")
    .insert(inflowPath)
    .select();

  return error ? error : data;
};

export const getInflowPathByStatusAndUserId = async (userId: string) => {
  const { data, error } = await supabaseClient()
    .from("inflow_path")
    .select("*")
    .eq("status", "DB追加")
    .eq("user_id", userId);

  if (error) throw new Error(error.message);

  return data;
};
