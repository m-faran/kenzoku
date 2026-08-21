import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, SafeAreaView, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../navigation/RootNavigator";
import Button from "../components/Button";
import Input from "../components/Input";
import { useUser } from "../context/UserContext";

type Props = NativeStackScreenProps<RootStackParamList, "ProfileSetup">;

export default function ProfileSetupScreen({ navigation }: Props) {
  const { user, updateUser, saveToDb } = useUser();
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [motive, setMotive] = useState(user.motive);
  const [city, setCity] = useState(user.city);
  const [school, setSchool] = useState(user.school);
  const [saving, setSaving] = useState(false);

  const handleContinue = async () => {
    updateUser({ name, bio, motive, city, school });
    setSaving(true);
    try {
      await saveToDb({ name, bio, motive, city, school });
      navigation.navigate("InterestSelection");
    } catch (e: any) {
      Alert.alert("Error", e.message ?? "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="flex-row items-center mb-8">
          {user.name ? (
            <Pressable onPress={() => navigation.goBack()} className="mr-4 active:opacity-70">
              <Ionicons name="arrow-back" size={24} color="#18181B" />
            </Pressable>
          ) : null}
          <View className="flex-1">
            <Text className="text-foreground font-display text-2xl">Your profile</Text>
            <Text className="text-muted font-body text-sm">Tell people a little about yourself</Text>
          </View>
        </View>

        {/* Step indicator */}
        <View className="flex-row gap-1.5 mb-8">
          {[1, 2, 3].map((step) => (
            <View
              key={step}
              className={`h-1 flex-1 rounded-full ${step === 1 ? "bg-primary" : "bg-border"}`}
            />
          ))}
        </View>

        {/* Avatar Upload */}
        <View className="items-center mb-8">
          <Pressable className="active:opacity-80">
            <View className="w-24 h-24 bg-primary/10 rounded-full items-center justify-center border-2 border-dashed border-primary/40">
              <Ionicons name="person" size={36} color="#A78BFA" />
            </View>
            <View className="absolute bottom-0 right-0 bg-primary w-7 h-7 rounded-full items-center justify-center border-2 border-white">
              <Ionicons name="add" size={16} color="#fff" />
            </View>
          </Pressable>
          <Text className="text-muted font-body text-sm mt-3">Add a profile photo</Text>
        </View>

        <Input
          label="Name"
          placeholder="Your first name"
          value={name}
          onChangeText={setName}
        />
        <Input
          label="Short bio"
          placeholder="What are you about? (e.g. 'Chess player and programmer from London')"
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={3}
        />
        <Input
          label="Motive"
          placeholder="Why are you joining? (e.g. 'Making friends', 'Networking')"
          value={motive}
          onChangeText={setMotive}
        />
        <Input
          label="City"
          placeholder="e.g. London, New York, Lagos"
          value={city}
          onChangeText={setCity}
        />
        <Input
          label="University / Workplace (optional)"
          placeholder="Where do you study or work?"
          value={school}
          onChangeText={setSchool}
        />

        <View className="mt-4">
          <Button
            label={saving ? "Saving..." : "Continue"}
            onPress={handleContinue}
            disabled={saving}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
