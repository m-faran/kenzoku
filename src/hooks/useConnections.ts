import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sendConnection, fetchConnections, fetchPendingForMe, respondToConnection, fetchConnectionStatus } from "../lib/api/connections";
import { insertNotification } from "../lib/api/notifications";
import { useAuth } from "../context/AuthContext";
import { useUser } from "../context/UserContext";

export function useSendConnection() {
  const { user: authUser } = useAuth();
  const { user } = useUser();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (receiverId: string) => {
      if (!authUser?.id) throw new Error("Not authenticated");
      return sendConnection(authUser.id, receiverId);
    },
    onSuccess: () => {
      // Refresh discover list (removes the person we just connected with)
      qc.invalidateQueries({ queryKey: ["discover"] });
      // Also insert a notification for ourselves confirming the send
      if (authUser?.id) {
        insertNotification(authUser.id, {
          type: "connection",
          text: "Connection request sent!",
        }).catch(() => {}); // fire-and-forget
        qc.invalidateQueries({ queryKey: ["notifications"] });
      }
    },
  });
}

export function useMyConnections() {
  const { user: authUser } = useAuth();
  return useQuery({
    queryKey: ["connections", authUser?.id],
    queryFn: () => fetchConnections(authUser!.id),
    enabled: !!authUser?.id,
  });
}

export function usePendingConnections() {
  const { user: authUser } = useAuth();
  return useQuery({
    queryKey: ["pending-connections", authUser?.id],
    queryFn: () => fetchPendingForMe(authUser!.id),
    enabled: !!authUser?.id,
  });
}

export function useRespondToConnection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ connectionId, status }: { connectionId: string; status: "accepted" | "rejected" }) =>
      respondToConnection(connectionId, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["connections"] });
      qc.invalidateQueries({ queryKey: ["pending-connections"] });
      qc.invalidateQueries({ queryKey: ["channels"] });
      qc.invalidateQueries({ queryKey: ["connection-status"] });
    },
  });
}

export function useConnectionStatus(otherUserId: string) {
  const { user: authUser } = useAuth();
  return useQuery({
    queryKey: ["connection-status", authUser?.id, otherUserId],
    queryFn: () => fetchConnectionStatus(authUser!.id, otherUserId),
    enabled: !!authUser?.id && !!otherUserId,
  });
}
