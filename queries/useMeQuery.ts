import { FetchMe } from "@/api/routes/users.route";
import ProfileKeys from "@/screens/profile/profile/profile.keys";
import { useQuery } from "@tanstack/react-query";

export const useMeQuery = (tokenApi: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ProfileKeys.me,
    queryFn: () => FetchMe(tokenApi),
    enabled,
    gcTime: Infinity,
    staleTime: Infinity,
  });
};
