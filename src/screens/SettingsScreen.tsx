import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import SettingsRow from "../components/SettingsRow";
import { useAuth } from "../context/AuthContext";

export default function SettingsScreen() {
  const navigation = useNavigation();
  const [pushNotifs, setPushNotifs] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(false);
  const { signOut, user } = useAuth();

  const sections = [
    {
      title: "Account",
      items: [
        { icon: "mail" as const, label: "Email", value: user?.email ?? "Not signed in" },
      ],
    },
    {
      title: "Notifications",
      items: [
        {
          icon: "notifications" as const,
          label: "Push Notifications",
          toggle: true,
          toggleValue: pushNotifs,
          onToggle: setPushNotifs,
        },
        {
          icon: "mail-open" as const,
          label: "Email Notifications",
          toggle: true,
          toggleValue: emailNotifs,
          onToggle: setEmailNotifs,
        },
      ],
    },
    {
      title: "App",
      items: [
        { icon: "language" as const, label: "Language", value: "English" },
      ],
    },
  ];

  return (
    <View className="flex-1 bg-surface">
      {/* Top technical bar */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-border">
        <Pressable onPress={() => navigation.goBack()} className="w-8 h-8 bg-card border border-ink items-center justify-center active:opacity-70">
          <Ionicons name="arrow-back" size={16} color="#111111" />
        </Pressable>
        <Text className="text-ink font-body-bold text-[10px] uppercase tracking-[2px]">
          SYSTEM PREFERENCES
        </Text>
        <View className="w-8" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4 pb-4">
          <Text
            className="text-ink font-display uppercase"
            style={{ fontSize: 44, lineHeight: 40, letterSpacing: -2 }}
          >
            SETTINGS
          </Text>
        </View>

        {sections.map((section) => (
          <View key={section.title} className="mb-5">
            <View className="px-4 mb-2 flex-row items-center justify-between">
              <Text className="text-ink font-body-bold text-[10px] uppercase tracking-[2px]">
                {section.title}
              </Text>
            </View>
            <View className="bg-card border border-ink mx-4 overflow-hidden">
              {section.items.map((item, i) => (
                <React.Fragment key={item.label}>
                  <SettingsRow
                    icon={item.icon}
                    label={item.label}
                    iconColor="#111111"
                    value={(item as any).value}
                    toggle={(item as any).toggle}
                    toggleValue={(item as any).toggleValue}
                    onToggle={(item as any).onToggle}
                    onPress={(item as any).onPress}
                  />
                  {i < section.items.length - 1 && (
                    <View className="h-px bg-border" />
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}

        {/* Log Out */}
        <View className="px-4 mb-8 mt-2">
          <Pressable
            onPress={() => Alert.alert("Log Out", "Are you sure?", [
              { text: "Cancel", style: "cancel" },
              { text: "Log Out", style: "destructive", onPress: signOut },
            ])}
            className="bg-card border border-ink px-5 py-4 flex-row items-center justify-between active:opacity-75"
          >
            <Text className="text-danger font-body-bold text-xs uppercase tracking-[2px]">Log Out</Text>
            <Ionicons name="log-out-outline" size={16} color="#D92D20" />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
