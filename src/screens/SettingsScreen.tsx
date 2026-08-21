import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, SafeAreaView, Alert } from "react-native";
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
        { icon: "person" as const, label: "Edit Profile", onPress: () => navigation.goBack() },
        { icon: "mail" as const, label: "Email", value: user?.email ?? "Not signed in", onPress: () => {} },
        { icon: "key" as const, label: "Change Password", onPress: () => {} },
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
      title: "Privacy",
      items: [
        { icon: "shield-checkmark" as const, label: "Privacy & Safety", onPress: () => {} },
        { icon: "ban" as const, label: "Blocked Users", iconColor: "#EF4444", onPress: () => {} },
      ],
    },
    {
      title: "App",
      items: [
        { icon: "language" as const, label: "Language", value: "English", onPress: () => {} },
        { icon: "help-circle" as const, label: "Help & Support", onPress: () => {} },
        { icon: "document-text" as const, label: "Terms of Service", onPress: () => {} },
        { icon: "lock-closed" as const, label: "Privacy Policy", onPress: () => {} },
      ],
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center px-5 py-4 mb-2">
          <Pressable onPress={() => navigation.goBack()} className="mr-4 active:opacity-70">
            <Ionicons name="arrow-back" size={24} color="#18181B" />
          </Pressable>
          <Text className="text-foreground font-display text-2xl">Settings</Text>
        </View>

        {sections.map((section) => (
          <View key={section.title} className="mb-4">
            <Text className="text-muted font-body-semi text-xs uppercase tracking-wider px-5 mb-2">
              {section.title}
            </Text>
            <View className="bg-white rounded-2xl mx-4 overflow-hidden">
              {section.items.map((item, i) => (
                <React.Fragment key={item.label}>
                  <SettingsRow
                    icon={item.icon}
                    label={item.label}
                    iconColor={(item as any).iconColor ?? "#7C3AED"}
                    value={(item as any).value}
                    toggle={(item as any).toggle}
                    toggleValue={(item as any).toggleValue}
                    onToggle={(item as any).onToggle}
                    onPress={(item as any).onPress}
                  />
                  {i < section.items.length - 1 && (
                    <View className="h-px bg-border ml-16" />
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
            className="bg-white rounded-2xl px-5 py-4 items-center active:opacity-80"
          >
            <Text className="text-danger font-body-semi text-base">Log Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
