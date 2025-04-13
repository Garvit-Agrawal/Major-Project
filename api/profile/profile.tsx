import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export const useProfileDetails = (userId: any) => {
  return useQuery({
    queryKey: ["profiles", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!userId, // only run if userId is truthy
  });
};
