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

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#7C3AED",
        tabBarInactiveTintColor: "#A1A1AA",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "#E4E4E7",
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 16,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontFamily: "Poppins_500Medium",
          fontSize: 11,
          marginTop: 2,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const icons: Record<string, [string, string]> = {
            DiscoverTab: ["compass", "compass-outline"],
            ChatsTab: ["chatbubbles", "chatbubbles-outline"],
            NotificationsTab: ["notifications", "notifications-outline"],
            ProfileTab: ["person", "person-outline"],
          };
          const [active, inactive] = icons[route.name] ?? ["ellipse", "ellipse-outline"];
          const iconName = focused ? active : inactive;
          return <Ionicons name={iconName as any} size={size} color={color} />;
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
