import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Notification, NOTIFICATIONS } from "../data/mockData";

type NotificationContextType = {
  notifications: Notification[];
  addNotification: (n: Omit<Notification, "id">) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);

  const addNotification = useCallback((n: Omit<Notification, "id">) => {
    setNotifications((prev) => [
      { ...n, id: `n-${Date.now()}` },
      ...prev,
    ]);
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}
