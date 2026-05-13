import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getUserProfile, updateUserProfile } from "@/services/firestore/usersRepo";
import type { UserProfile } from "@/types";

export function useProfileQuery(uid: string | undefined, emailFallback: string | undefined) {
  return useQuery({
    queryKey: queryKeys.profile(uid ?? ""),
    queryFn: () => getUserProfile(uid!, emailFallback ?? ""),
    enabled: Boolean(uid && emailFallback),
  });
}

export function useUpdateProfileMutation(uid: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patch: Partial<Pick<UserProfile, "displayName" | "avatarUrl" | "preferences">>) =>
      updateUserProfile(uid!, patch),
    onSuccess: (profile) => {
      qc.setQueryData(queryKeys.profile(profile.uid), profile);
    },
  });
}
