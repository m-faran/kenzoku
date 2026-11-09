import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../navigation/RootNavigator";
import Button from "../components/Button";
import Input from "../components/Input";
import InterestChip from "../components/InterestChip";
import { ALL_INTERESTS, Interest } from "../data/mockData";
import { useUser } from "../context/UserContext";

type Props = NativeStackScreenProps<RootStackParamList, "InterestSelection">;

import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function InterestSelectionScreen({ navigation }: Props) {
  const { user, updateUser, saveToDb } = useUser();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>(user.interests || []);
  const [specificInterests, setSpecificInterests] = useState(user.specificInterests || "");
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  const filtered = search
    ? ALL_INTERESTS.filter((i) =>
        i.label.toLowerCase().includes(search.toLowerCase())
      )
    : ALL_INTERESTS;

  const noMatch = search.length > 1 && filtered.length === 0;
  const showAdd =
    search.length > 1 &&
    !ALL_INTERESTS.some((i) => i.label.toLowerCase() === search.toLowerCase());

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const addCustom = () => {
    const customId = `custom-${search.toLowerCase().replace(/\s+/g, "-")}`;
    toggle(customId);
    setSearch("");
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-surface"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View className="flex-1">
        {/* Header */}
        <View className="px-5 pt-4 pb-3">
          <View className="flex-row items-center mb-5">
            <Pressable onPress={() => navigation.goBack()} className="mr-3 w-8 h-8 bg-card border border-ink items-center justify-center active:opacity-70">
              <Ionicons name="arrow-back" size={16} color="#111111" />
            </Pressable>
            <View className="flex-row gap-2 flex-1">
              {[1, 2, 3].map((step) => (
                <View
                  key={step}
                  className={`h-1 flex-1 ${step <= 2 ? "bg-primary" : "bg-border"}`}
                />
              ))}
            </View>
          </View>

          <View className="flex-row items-center gap-2 mb-1">
            <View className="w-2 h-2 bg-primary" />
            <Text className="text-ink font-body-bold text-[10px] uppercase tracking-[2px]">
              ONBOARDING · 02 / 03
            </Text>
          </View>

          <Text
            className="text-ink font-display uppercase mb-1"
            style={{ fontSize: 36, lineHeight: 32, letterSpacing: -1.5 }}
          >
            PASSION INDEX
          </Text>
          <Text className="text-muted font-body text-xs leading-[18px] mb-5">
            Choose what you are truly obsessed with to calculate kindred compatibility.
          </Text>

          {/* Search */}
          <View className="flex-row items-center bg-card border border-ink px-3 py-2.5 gap-2">
            <Ionicons name="search" size={15} color="#111111" />
            <TextInput
              className="flex-1 text-ink font-body text-xs"
              placeholder="SEARCH PASSIONS..."
              placeholderTextColor="#A8A29E"
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={16} color="#111111" />
              </Pressable>
            )}
          </View>
        </View>

        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-5"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Selected chips */}
          {selected.length > 0 && (
            <View className="mb-5 pb-5 border-b border-border">
              <View className="flex-row items-center justify-between mb-2.5">
                <Text className="text-ink font-body-bold text-[10px] uppercase tracking-[2px]">
                  SELECTED PASSIONS
                </Text>
                <Text className="text-muted font-body-semi text-[10px] uppercase tracking-[1.5px]">
                  {String(selected.length).padStart(2, "0")} TOTAL
                </Text>
              </View>
              <View className="flex-row flex-wrap gap-2">
                {selected.map((id) => {
                  const interest = ALL_INTERESTS.find((i) => i.id === id);
                  const label = interest?.label ?? id.replace("custom-", "").replace(/-/g, " ");
                  return (
                    <InterestChip
                      key={id}
                      label={label}
                      variant="selected"
                      onPress={() => toggle(id)}
                    />
                  );
                })}
              </View>
            </View>
          )}

          {/* Add custom */}
          {showAdd && (
            <Pressable
              onPress={addCustom}
              className="flex-row items-center justify-between bg-card border border-ink px-4 py-3 mb-4 active:opacity-85"
            >
              <Text className="text-ink font-body-bold text-[11px] uppercase tracking-[1.8px]">
                + INDEX "{search.toUpperCase()}"
              </Text>
              <Ionicons name="add" size={16} color="#111111" />
            </Pressable>
          )}

          {/* Grid */}
          <Text className="text-ink font-body-bold text-[10px] uppercase tracking-[2px] mb-3">
            {search ? "SEARCH RESULTS" : "POPULAR ARCHIVES"}
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-8">
            {filtered.map((interest) => (
              <InterestChip
                key={interest.id}
                label={interest.label}
                variant={selected.includes(interest.id) ? "selected" : "default"}
                onPress={() => toggle(interest.id)}
              />
            ))}
          </View>

          {/* Specific Interests prompt */}
          {selected.length > 0 && (
            <View className="mb-8">
              <Text className="text-ink font-body-bold text-[10px] uppercase tracking-[2px] mb-2">
                SPECIFY YOUR NICHES (OPTIONAL)
              </Text>
              <View className="bg-card border border-ink px-3.5 py-3">
                <TextInput
                  ref={inputRef}
                  className="text-ink font-body text-xs leading-[18px]"
                  placeholder="e.g. For Anime: Cyberpunk Edgerunners. For Coding: React Native, Rust. For Film: French New Wave, 35mm."
                  placeholderTextColor="#A8A29E"
                  value={specificInterests}
                  onChangeText={setSpecificInterests}
                  multiline
                  style={{ minHeight: 70, textAlignVertical: 'top' }}
                />
              </View>
            </View>
          )}
        </ScrollView>

        {/* CTA */}
        <View 
          className="px-5 pt-3 bg-surface border-t border-ink"
          style={{ paddingBottom: Math.max(20, insets.bottom + 10) }}
        >
          <Button
            label={selected.length > 0 ? `Continue with ${selected.length} passion${selected.length > 1 ? "s" : ""}` : "Select at least 1 passion"}
            onPress={() => {
              const proceed = async () => {
                updateUser({ interests: selected, specificInterests });
                try {
                  await saveToDb({ interests: selected, specificInterests });
                } catch (e) {
                  // non-blocking — profile saved locally either way
                }
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Main" }],
                });
              };

              if (selected.length > 0 && specificInterests.trim() === "") {
                Alert.alert(
                  "Specify Interests?",
                  "You haven't specified your interests. While optional, adding specifics helps us connect you with the right people!",
                  [
                    { 
                      text: "Add Specifics", 
                      style: "cancel",
                      onPress: () => {
                        setTimeout(() => {
                          scrollViewRef.current?.scrollToEnd({ animated: true });
                          inputRef.current?.focus();
                        }, 300);
                      }
                    },
                    { text: "Continue Anyway", onPress: proceed },
                  ]
                );
              } else {
                proceed();
              }
            }}
            disabled={selected.length === 0}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
