import { PostgrestError } from "@supabase/supabase-js";

import { addUserProfilesType } from "@/types/supabase";
import { supabaseClient } from "@/lib/supabase";

export const addUserProfiles = async (userProfiles: addUserProfilesType) => {
  const { data, error } = await supabaseClient()
    .from("user_profiles")
    .insert(userProfiles)
    .select();

  return error ? error : data;
};

export const getUserProfilesById = async (id: string) => {
  const { data, error } = await supabaseClient()
    .from("user_profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data;
};

export const updateUserProfiles = async (
  data: {
    [key: string]: boolean | string | string[] | Date | null;
  },
  userId: string | null
): Promise<{
  error: PostgrestError | null;
  data: any | null;
}> => {
  if (!userId) return { error: null, data: null };

  const { data: userData, error } = await supabaseClient()
    .from("user_profiles")
    .update(data)
    .eq("id", userId);

  return { error, data: userData };
};
