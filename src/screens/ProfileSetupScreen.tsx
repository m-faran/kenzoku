import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../navigation/RootNavigator";
import Button from "../components/Button";
import Input from "../components/Input";
import Avatar from "../components/Avatar";
import { useUser } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";
import { pickAndUploadAvatar } from "../lib/api/storage";

type Props = NativeStackScreenProps<RootStackParamList, "ProfileSetup">;

import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileSetupScreen({ navigation }: Props) {
  const { user, updateUser, saveToDb } = useUser();
  const { user: authUser } = useAuth();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [motive, setMotive] = useState(user.motive);
  const [city, setCity] = useState(user.city);
  const [school, setSchool] = useState(user.school);
  const [photo, setPhoto] = useState(user.photo);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handlePickPhoto = async () => {
    if (!authUser?.id) return;
    setUploadingPhoto(true);
    try {
      const url = await pickAndUploadAvatar(authUser.id);
      if (url) {
        setPhoto(url);
        updateUser({ photo: url });
        await saveToDb({ photo: url });
      }
    } catch (e: any) {
      Alert.alert("Upload Failed", e.message ?? "Could not upload photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

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
    <KeyboardAvoidingView 
      className="flex-1 bg-surface"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: Math.max(24, insets.bottom + 24) }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="flex-row items-center mb-6">
          {user.name ? (
            <Pressable onPress={() => navigation.goBack()} className="mr-3 w-8 h-8 bg-card border border-ink items-center justify-center active:opacity-70">
              <Ionicons name="arrow-back" size={16} color="#111111" />
            </Pressable>
          ) : null}
          <View className="flex-1">
            <View className="flex-row items-center gap-2 mb-1">
              <View className="w-2 h-2 bg-primary" />
              <Text className="text-ink font-body-bold text-[10px] uppercase tracking-[2px]">
                ONBOARDING · 01 / 03
              </Text>
            </View>
            <Text
              className="text-ink font-display uppercase"
              style={{ fontSize: 36, lineHeight: 32, letterSpacing: -1.5 }}
            >
              IDENTITY DOSSIER
            </Text>
          </View>
        </View>

        {/* Step indicator */}
        <View className="flex-row gap-2 mb-8">
          {[1, 2, 3].map((step) => (
            <View
              key={step}
              className={`h-1 flex-1 ${step === 1 ? "bg-primary" : "bg-border"}`}
            />
          ))}
        </View>

        {/* Avatar Upload */}
        <View className="items-center mb-8">
          <Pressable className="active:opacity-80" onPress={handlePickPhoto} disabled={uploadingPhoto}>
            {photo && photo !== "" ? (
              <Avatar uri={photo} size={96} />
            ) : (
              <View className="w-24 h-24 bg-card border border-dashed border-ink items-center justify-center">
                <Ionicons name="person-outline" size={32} color="#111111" />
              </View>
            )}
            <View className="absolute bottom-0 right-0 bg-primary w-7 h-7 border border-ink items-center justify-center">
              <Ionicons name={photo ? "camera" : "add"} size={14} color="#FCFBF7" />
            </View>
          </Pressable>
          <Text className="text-ink font-body-bold text-[10px] uppercase tracking-[1.5px] mt-3">
            {uploadingPhoto ? "UPLOADING..." : photo ? "CHANGE PORTRAIT" : "UPLOAD PORTRAIT"}
          </Text>
        </View>

        <Input
          label="Your Full Name"
          placeholder="E.G. ALEX VANCE"
          value={name}
          onChangeText={setName}
        />
        <Input
          label="Short Bio"
          placeholder="WHAT ARE YOU ABOUT? (E.G. CHESS PLAYER AND PROGRAMMER)"
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={3}
        />
        <Input
          label="Core Motive"
          placeholder="WHY ARE YOU JOINING? (E.G. MAKING FRIENDS, COLLABORATING)"
          value={motive}
          onChangeText={setMotive}
        />
        <Input
          label="City / Base"
          placeholder="E.G. LONDON, TOKYO, NEW YORK"
          value={city}
          onChangeText={setCity}
        />
        <Input
          label="Institution / Studio (Optional)"
          placeholder="WHERE DO YOU STUDY OR CREATE?"
          value={school}
          onChangeText={setSchool}
        />

        <View className="mt-4 mb-6">
          <Button
            label={saving ? "Saving..." : "Continue to Passions"}
            onPress={handleContinue}
            disabled={saving}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
