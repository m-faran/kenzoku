import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { blockUser, unblockUser, fetchIsBlocked } from "../lib/api/blocks";
import { useAuth } from "../context/AuthContext";

export function useBlockStatus(otherUserId: string) {
  const { user: authUser } = useAuth();
  return useQuery({
    queryKey: ["block-status", authUser?.id, otherUserId],
    queryFn: () => fetchIsBlocked(authUser!.id, otherUserId),
    enabled: !!authUser?.id && !!otherUserId,
  });
}

export function useToggleBlock(otherUserId: string, currentlyBlocked: boolean) {
  const { user: authUser } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!authUser?.id) throw new Error("Not authenticated");
      if (currentlyBlocked) {
        await unblockUser(authUser.id, otherUserId);
      } else {
        await blockUser(authUser.id, otherUserId);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["block-status", authUser?.id, otherUserId] });
    },
  });
}
