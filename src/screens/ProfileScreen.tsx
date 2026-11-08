import React from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { ProfileStackParamList } from "../navigation/stacks/ProfileStack";
import InterestChip from "../components/InterestChip";
import SettingsRow from "../components/SettingsRow";
import Button from "../components/Button";
import { getInterestLabel } from "../data/mockData";
import { useUser } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";

type Nav = NativeStackNavigationProp<ProfileStackParamList, "Profile">;

const { width: W } = Dimensions.get("window");

export default function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useUser();
  const { signOut } = useAuth();

  const nameParts = (user.name || "Your Name").trim().split(/\s+/);
  const firstName = nameParts[0].toUpperCase();
  const restName = nameParts.slice(1).join(" ").toUpperCase();

  const menuItems = [
    {
      icon: "settings-outline" as const,
      label: "Settings",
      onPress: () => navigation.navigate("Settings"),
    },
    {
      icon: "shield-checkmark-outline" as const,
      label: "Privacy & Safety",
      onPress: () => navigation.navigate("PrivacySafety"),
    },
  ];

  return (
    <View className="flex-1 bg-surface">
      {/* Top editorial bar */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-border">
        <View className="flex-row items-center gap-2">
          <View className="w-2 h-2 bg-primary" />
          <Text className="text-ink font-body-bold text-[10px] uppercase tracking-[2px]">
            IDENTITY DOSSIER
          </Text>
        </View>
        <View className="flex-row items-center gap-3">
          {user.city ? (
            <View className="flex-row items-center gap-1">
              <Ionicons name="location-outline" size={11} color="#111111" />
              <Text className="text-ink font-body-semi text-[10px] uppercase tracking-[1.8px]">
                {user.city}
              </Text>
            </View>
          ) : null}
          {user.age ? (
            <Text className="text-muted font-body-semi text-[10px] uppercase tracking-[1.8px]">
              {user.age} YRS
            </Text>
          ) : null}
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* PLANE 1 (BACK): Massive display name */}
        <View className="px-4 pt-3 pb-7 bg-surface" style={{ zIndex: 1 }}>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.5}
            className="text-ink font-display uppercase"
            style={{
              fontSize: 72,
              lineHeight: 64,
              letterSpacing: -3,
            }}
          >
            {firstName}
          </Text>
          {restName ? (
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.5}
              className="text-ink font-display uppercase"
              style={{
                fontSize: 64,
                lineHeight: 58,
                letterSpacing: -2.5,
              }}
            >
              {restName}
            </Text>
          ) : null}
        </View>

        {/* PLANE 2 (MIDDLE): Subject portrait overlapping display type */}
        <View
          className="mx-4 border border-ink bg-paper-sunken overflow-hidden"
          style={{
            height: W * 0.82,
            marginTop: -26,
            zIndex: 2,
            shadowColor: "#111111",
            shadowOffset: { width: 0, height: 14 },
            shadowOpacity: 0.14,
            shadowRadius: 20,
            elevation: 6,
          }}
        >
          <Image
            source={user.photo ? { uri: user.photo } : undefined}
            style={{ width: "100%", height: "100%", backgroundColor: "#EAE5D9" }}
            contentFit="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(17,17,17,0.55)"]}
            locations={[0.45, 1]}
            style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 130 }}
          />

          {/* Framed stat callout overlapping subject */}
          <View
            className="absolute bottom-7 left-4 bg-card/95 border border-ink px-3.5 py-2.5 flex-row items-center"
            style={{ gap: 10 }}
          >
            <Text
              className="text-ink font-display-bold"
              style={{ fontSize: 32, lineHeight: 32, letterSpacing: -1.5 }}
            >
              {String(user.interests.length).padStart(2, "0")}
            </Text>
            <Text className="text-ink font-body-bold text-[9px] uppercase tracking-[1.8px] leading-[13px]">
              INDEXED{"\n"}PASSIONS
            </Text>
          </View>

          {user.school ? (
            <View className="absolute top-3 right-3 bg-card/95 border border-ink px-2.5 py-1">
              <Text className="text-ink font-body-semi text-[9px] uppercase tracking-[1.6px]">
                {user.school}
              </Text>
            </View>
          ) : null}
        </View>

        {/* PLANE 3 (TOP): Foreground bio, motive manifesto, and primary Edit CTA */}
        <View
          className="mx-4 bg-card border border-ink p-5 mb-6"
          style={{ marginTop: -18, zIndex: 3 }}
        >
          {user.motive ? (
            <View className="pb-3.5 mb-3.5 border-b border-border flex-row items-start gap-2">
              <View className="w-1.5 h-1.5 bg-primary mt-1.5" />
              <Text className="flex-1 text-ink font-body-bold text-[11px] uppercase tracking-[1.8px] leading-[17px]">
                {user.motive}
              </Text>
            </View>
          ) : null}

          <Text className="text-ink font-body text-[13px] leading-[20px] mb-5">
            {user.bio || "Add a short bio so kindred spirits know what you're building, reading, or exploring."}
          </Text>

          <Button
            label="Edit Profile"
            variant="primary"
            onPress={() => navigation.navigate("EditProfile")}
          />
        </View>

        {/* Interests Ledger */}
        <View className="px-4 mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-ink font-body-bold text-[10px] uppercase tracking-[2px]">
              MY PASSIONS
            </Text>
            <Pressable
              onPress={() => navigation.navigate("EditProfile")}
              className="active:opacity-70"
            >
              <Text className="text-primary font-body-bold text-[10px] uppercase tracking-[1.8px]">
                MODIFY
              </Text>
            </Pressable>
          </View>
          <View className="flex-row flex-wrap gap-2">
            {user.interests.map((id) => (
              <InterestChip
                key={id}
                label={getInterestLabel(id)}
                variant="selected"
              />
            ))}
          </View>

          {user.specificInterests ? (
            <View className="mt-4 pt-4 border-t border-border">
              <Text className="text-ink font-body-bold text-[10px] uppercase tracking-[2px] mb-1.5">
                SPECIFIC NICHES
              </Text>
              <Text className="text-muted font-body text-[13px] leading-[20px]">
                {user.specificInterests}
              </Text>
            </View>
          ) : null}
        </View>

        {/* System Menu — Ink & Paper ledger */}
        <View className="bg-card border border-ink mx-4 mb-4 overflow-hidden">
          {menuItems.map((item, i) => (
            <React.Fragment key={item.label}>
              <SettingsRow
                icon={item.icon}
                label={item.label}
                onPress={item.onPress}
              />
              {i < menuItems.length - 1 && (
                <View className="h-px bg-border" />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* Log Out */}
        <View className="px-4 mb-10">
          <Pressable
            onPress={() =>
              Alert.alert("Log Out", "Are you sure?", [
                { text: "Cancel", style: "cancel" },
                { text: "Log Out", style: "destructive", onPress: signOut },
              ])
            }
            className="bg-card border border-ink px-5 py-4 flex-row items-center justify-between active:opacity-75"
          >
            <Text className="text-danger font-body-bold text-xs uppercase tracking-[2px]">
              Log Out
            </Text>
            <Ionicons name="log-out-outline" size={16} color="#D92D20" />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
