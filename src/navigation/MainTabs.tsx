import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

import DiscoverStack from "./stacks/DiscoverStack";
import ChatsStack from "./stacks/ChatsStack";
import NotificationsScreen from "../screens/NotificationsScreen";
import ProfileStack from "./stacks/ProfileStack";

export type MainTabsParamList = {
  DiscoverTab: undefined;
  ChatsTab: undefined;
  NotificationsTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#FF3B1D",
        tabBarInactiveTintColor: "#68645D",
        tabBarStyle: {
          backgroundColor: "#F6F3EC",
          borderTopColor: "#DCD6CA",
          borderTopWidth: 1,
          height: 62 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 14,
          paddingTop: 8,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontFamily: "SpaceGrotesk_600SemiBold",
          fontSize: 10,
          letterSpacing: 1.4,
          textTransform: "uppercase",
          marginTop: 2,
        },
        tabBarIcon: ({ focused, color }) => {
          const icons: Record<string, [string, string]> = {
            DiscoverTab: ["compass", "compass-outline"],
            ChatsTab: ["chatbubbles", "chatbubbles-outline"],
            NotificationsTab: ["notifications", "notifications-outline"],
            ProfileTab: ["person", "person-outline"],
          };
          const [active, inactive] = icons[route.name] ?? ["ellipse", "ellipse-outline"];
          const iconName = focused ? active : inactive;
          return <Ionicons name={iconName as any} size={20} color={color} />;
        },
      })}
    >
      <Tab.Screen name="DiscoverTab" component={DiscoverStack} options={{ title: "Discover" }} />
      <Tab.Screen name="ChatsTab" component={ChatsStack} options={{ title: "Chats" }} />
      <Tab.Screen name="NotificationsTab" component={NotificationsScreen} options={{ title: "Notifications" }} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} options={{ title: "Profile" }} />
    </Tab.Navigator>
  );
}
