import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Avatar from "../components/Avatar";
import Input from "../components/Input";
import Button from "../components/Button";
import InterestChip from "../components/InterestChip";
import { MY_INTERESTS, getInterestLabel, getInterestEmoji } from "../data/mockData";

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState("Alex Rivera");
  const [bio, setBio] = useState("Builder and chess obsessive. Working on dev tools for distributed teams.");
  const [city, setCity] = useState("San Francisco");
  const [school, setSchool] = useState("Stanford University");

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between py-4 mb-4">
          <Pressable onPress={() => navigation.goBack()} className="active:opacity-70">
            <Ionicons name="arrow-back" size={24} color="#18181B" />
          </Pressable>
          <Text className="text-foreground font-body-semi text-base">Edit Profile</Text>
          <Pressable
            onPress={() => {
              Alert.alert("Saved", "Your profile has been updated.");
              navigation.goBack();
            }}
            className="active:opacity-70"
          >
            <Text className="text-primary font-body-semi text-base">Save</Text>
          </Pressable>
        </View>

        {/* Avatar */}
        <View className="items-center mb-8">
          <Pressable className="active:opacity-80">
            <Avatar
              uri="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&auto=format"
              size={88}
            />
            <View className="absolute bottom-0 right-0 bg-primary w-7 h-7 rounded-full items-center justify-center border-2 border-white">
              <Ionicons name="camera" size={13} color="#fff" />
            </View>
          </Pressable>
          <Text className="text-primary font-body-medium text-sm mt-2">Change photo</Text>
        </View>

        <Input label="Name" value={name} onChangeText={setName} placeholder="Your name" />
        <Input
          label="Bio"
          value={bio}
          onChangeText={setBio}
          placeholder="Tell people what you're about"
          multiline
          numberOfLines={3}
        />
        <Input label="City" value={city} onChangeText={setCity} placeholder="Your city" />
        <Input
          label="University / Workplace"
          value={school}
          onChangeText={setSchool}
          placeholder="Optional"
        />

        {/* Interests */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-foreground font-body-semi text-sm">Interests</Text>
            <Pressable className="active:opacity-70">
              <Text className="text-primary font-body-medium text-sm">Edit</Text>
            </Pressable>
          </View>
          <View className="flex-row flex-wrap gap-2">
            {MY_INTERESTS.map((id) => (
              <InterestChip
                key={id}
                label={getInterestLabel(id)}
                emoji={getInterestEmoji(id)}
                variant="selected"
              />
            ))}
          </View>
        </View>

        <Button label="Save Changes" onPress={() => {
          Alert.alert("Saved", "Your profile has been updated.");
          navigation.goBack();
        }} />
      </ScrollView>
    </SafeAreaView>
  );
}
