import { useQuery } from "@tanstack/react-query";
import { FetchMe } from "../routes/users.route";
import ProfileKeys from "@/screens/profile_stack/profile/profile.keys";

export function useMe(enabled: boolean, tokenApi: string) {
  return useQuery({
    queryKey: ProfileKeys.me,
    queryFn: () => FetchMe(tokenApi),
    enabled,
    gcTime: Infinity,
    staleTime: Infinity,
  });
}
