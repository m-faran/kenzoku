import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotifications, markNotificationRead, NotificationRow } from "../lib/api/notifications";
import { useAuth } from "../context/AuthContext";

export function useNotifications() {
  const { user: authUser } = useAuth();
  return useQuery({
    queryKey: ["notifications", authUser?.id],
    queryFn: () => fetchNotifications(authUser!.id),
    enabled: !!authUser?.id,
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: string) => markNotificationRead(notificationId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
