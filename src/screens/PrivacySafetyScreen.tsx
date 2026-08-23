import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, SafeAreaView, Alert, Linking } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import SettingsRow from "../components/SettingsRow";

export default function PrivacySafetyScreen() {
  const navigation = useNavigation();
  const [discoverable, setDiscoverable] = useState(true);
  const [locationVisible, setLocationVisible] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center px-5 py-4 mb-2">
          <Pressable onPress={() => navigation.goBack()} className="mr-4 active:opacity-70">
            <Ionicons name="arrow-back" size={24} color="#18181B" />
          </Pressable>
          <Text className="text-foreground font-display text-2xl">Privacy & Safety</Text>
        </View>

        {/* Info banner */}
        <View className="mx-4 mb-5 bg-primary/10 border border-primary/20 rounded-2xl p-4">
          <View className="flex-row items-start gap-3">
            <Text style={{ fontSize: 20 }}>🌐</Text>
            <Text className="text-foreground font-body text-sm flex-1 leading-relaxed">
              PeopleFind is a friendship and interest-based discovery platform. Your safety and privacy are our priority.
            </Text>
          </View>
        </View>

        {/* Discovery */}
        <Text className="text-muted font-body-semi text-xs uppercase tracking-wider px-5 mb-2">
          Discovery
        </Text>
        <View className="bg-white rounded-2xl mx-4 mb-4 overflow-hidden">
          <SettingsRow
            icon="compass"
            label="Who can discover me"
            toggle
            toggleValue={discoverable}
            onToggle={setDiscoverable}
          />
          <View className="h-px bg-border ml-16" />
          <SettingsRow
            icon="location"
            label="Location visibility"
            toggle
            toggleValue={locationVisible}
            onToggle={setLocationVisible}
          />
        </View>



        {/* Danger zone */}
        <Text className="text-muted font-body-semi text-xs uppercase tracking-wider px-5 mb-2">
          Account
        </Text>
        <View className="bg-white rounded-2xl mx-4 mb-8 overflow-hidden">
          <SettingsRow
            icon="trash"
            label="Delete Account"
            iconColor="#EF4444"
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
    </SafeAreaView>
  );
}
