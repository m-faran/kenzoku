import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, Alert, Linking } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import SettingsRow from "../components/SettingsRow";

export default function PrivacySafetyScreen() {
  const navigation = useNavigation();
  const [discoverable, setDiscoverable] = useState(true);
  const [locationVisible, setLocationVisible] = useState(true);

  return (
    <View className="flex-1 bg-surface">
      {/* Top technical bar */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-border">
        <Pressable onPress={() => navigation.goBack()} className="w-8 h-8 bg-card border border-ink items-center justify-center active:opacity-70">
          <Ionicons name="arrow-back" size={16} color="#111111" />
        </Pressable>
        <Text className="text-ink font-body-bold text-[10px] uppercase tracking-[2px]">
          SECURITY PROTOCOLS
        </Text>
        <View className="w-8" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4 pb-4">
          <Text
            className="text-ink font-display uppercase"
            style={{ fontSize: 36, lineHeight: 32, letterSpacing: -1.5 }}
          >
            PRIVACY & SAFETY
          </Text>
        </View>

        {/* Info banner */}
        <View className="mx-4 mb-6 bg-card border border-ink p-4">
          <View className="flex-row items-start gap-2.5">
            <View className="w-2 h-2 bg-primary mt-1" />
            <Text className="text-ink font-body text-xs flex-1 leading-[18px]">
              Kenzoku is built on mutual kindred affinity. Your location and profile are only surfaced to users sharing your indexed passions.
            </Text>
          </View>
        </View>

        {/* Discovery */}
        <View className="px-4 mb-2">
          <Text className="text-ink font-body-bold text-[10px] uppercase tracking-[2px]">
            DISCOVERY INDEX
          </Text>
        </View>
        <View className="bg-card border border-ink mx-4 mb-6 overflow-hidden">
          <SettingsRow
            icon="compass-outline"
            label="Who can discover me"
            toggle
            toggleValue={discoverable}
            onToggle={setDiscoverable}
          />
          <View className="h-px bg-border" />
          <SettingsRow
            icon="location-outline"
            label="Location visibility"
            toggle
            toggleValue={locationVisible}
            onToggle={setLocationVisible}
          />
        </View>

        {/* Danger zone */}
        <View className="px-4 mb-2">
          <Text className="text-danger font-body-bold text-[10px] uppercase tracking-[2px]">
            ACCOUNT ACTION
          </Text>
        </View>
        <View className="bg-card border border-ink mx-4 mb-8 overflow-hidden">
          <SettingsRow
            icon="trash-outline"
            label="Delete Account"
            iconColor="#D92D20"
            destructive
            showChevron={false}
            onPress={() =>
              Alert.alert(
                "Delete Account",
                "This will start the account deletion process. We will open your email client to send a deletion request.",
                [
                  { text: "Cancel", style: "cancel" },
                  { 
                    text: "Continue", 
                    style: "destructive",
                    onPress: () => Linking.openURL('mailto:kenzoku@codekin.xyz?subject=Account Deletion Request')
                  },
                ]
              )
            }
          />
        </View>
      </ScrollView>
    </View>
  );
}
