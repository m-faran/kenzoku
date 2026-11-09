import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Avatar from "../components/Avatar";
import Input from "../components/Input";
import Button from "../components/Button";
import InterestChip from "../components/InterestChip";
import { getInterestLabel, getInterestEmoji } from "../data/mockData";
import { useUser } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";
import { pickAndUploadAvatar } from "../lib/api/storage";

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { user, updateUser, saveToDb } = useUser();
  const { user: authUser } = useAuth();
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [motive, setMotive] = useState(user.motive);
  const [specificInterests, setSpecificInterests] = useState(user.specificInterests);
  const [city, setCity] = useState(user.city);
  const [school, setSchool] = useState(user.school);
  const [photo, setPhoto] = useState(user.photo);
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

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-surface"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between py-4 mb-4 border-b border-border">
          <Pressable onPress={() => navigation.goBack()} className="w-8 h-8 bg-card border border-ink items-center justify-center active:opacity-70">
            <Ionicons name="arrow-back" size={16} color="#111111" />
          </Pressable>
          <Text className="text-ink font-body-bold text-[10px] uppercase tracking-[2px]">
            EDIT IDENTITY
          </Text>
          <Pressable
            onPress={async () => {
              updateUser({ name, bio, motive, specificInterests, city, school });
              try {
                await saveToDb({ name, bio, motive, specificInterests, city, school });
                Alert.alert("Saved", "Your profile has been updated.");
                navigation.goBack();
              } catch (e: any) {
                Alert.alert("Error", e.message ?? "Failed to save profile");
              }
            }}
            className="px-3 py-1.5 bg-primary border border-ink active:opacity-85"
          >
            <Text className="text-card font-body-bold text-[10px] uppercase tracking-[1.5px]">SAVE</Text>
          </Pressable>
        </View>

        {/* Avatar */}
        <View className="items-center mb-8">
          <Pressable className="active:opacity-80" onPress={handlePickPhoto} disabled={uploadingPhoto}>
            <Avatar
              uri={photo}
              size={96}
            />
            <View className="absolute bottom-0 right-0 bg-primary w-7 h-7 border border-ink items-center justify-center">
              <Ionicons name="camera" size={13} color="#FCFBF7" />
            </View>
          </Pressable>
          <Text className="text-ink font-body-bold text-[10px] uppercase tracking-[1.5px] mt-3">
            {uploadingPhoto ? "UPLOADING..." : "MODIFY PORTRAIT"}
          </Text>
        </View>

        <Input label="Full Name" value={name} onChangeText={setName} placeholder="Your name" />
        <Input
          label="Short Bio"
          value={bio}
          onChangeText={setBio}
          placeholder="Tell people what you are about"
          multiline
          numberOfLines={3}
        />
        <Input
          label="Motive"
          value={motive}
          onChangeText={setMotive}
          placeholder="Why are you joining? (e.g. Making friends, Building)"
        />
        <Input
          label="Specific Niches & Obsessions"
          value={specificInterests}
          onChangeText={setSpecificInterests}
          placeholder="e.g. For Anime, Attack on Titan. For Coding, React or Rust."
          multiline
          numberOfLines={3}
        />
        <Input label="City / Region" value={city} onChangeText={setCity} placeholder="Your city" />
        <Input
          label="Institution / Workspace"
          value={school}
          onChangeText={setSchool}
          placeholder="Optional"
        />

        {/* Interests */}
        <View className="mt-2 mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-ink font-body-bold text-[10px] uppercase tracking-[2px]">INDEXED PASSIONS</Text>
            <Pressable className="active:opacity-70" onPress={() => navigation.navigate("InterestSelection" as never)}>
              <Text className="text-primary font-body-bold text-[10px] uppercase tracking-[1.8px]">MODIFY</Text>
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
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
