import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  SafeAreaView,
  TextInput,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../navigation/RootNavigator";
import Button from "../components/Button";
import InterestChip from "../components/InterestChip";
import { ALL_INTERESTS, Interest } from "../data/mockData";

type Props = NativeStackScreenProps<RootStackParamList, "InterestSelection">;

export default function InterestSelectionScreen({ navigation }: Props) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

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
    <SafeAreaView className="flex-1 bg-surface">
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <View className="flex-row items-center mb-6">
            <Pressable onPress={() => navigation.goBack()} className="mr-4 active:opacity-70">
              <Ionicons name="arrow-back" size={24} color="#18181B" />
            </Pressable>
            <View className="flex-row gap-1.5 flex-1">
              {[1, 2, 3].map((step) => (
                <View
                  key={step}
                  className={`h-1 flex-1 rounded-full ${step <= 2 ? "bg-primary" : "bg-border"}`}
                />
              ))}
            </View>
          </View>

          <Text className="text-foreground font-display text-3xl mb-2">What are you into?</Text>
          <Text className="text-muted font-body text-base mb-6">
            Choose things you're passionate about so we can find people who share them.
          </Text>

          {/* Search */}
          <View className="flex-row items-center bg-white border border-border rounded-xl px-4 py-3 gap-2">
            <Ionicons name="search" size={18} color="#A1A1AA" />
            <TextInput
              className="flex-1 text-foreground font-body text-base"
              placeholder="Search interests..."
              placeholderTextColor="#A1A1AA"
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={18} color="#A1A1AA" />
              </Pressable>
            )}
          </View>
        </View>

        <ScrollView
          className="flex-1 px-6"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Selected chips */}
          {selected.length > 0 && (
            <View className="mb-5">
              <Text className="text-foreground font-body-semi text-sm mb-2">
                Selected ({selected.length})
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {selected.map((id) => {
                  const interest = ALL_INTERESTS.find((i) => i.id === id);
                  const label = interest?.label ?? id.replace("custom-", "").replace(/-/g, " ");
                  return (
                    <InterestChip
                      key={id}
                      label={label}
                      emoji={interest?.emoji}
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
              className="flex-row items-center gap-2 bg-accent/10 border border-accent/30 rounded-xl px-4 py-3 mb-4 active:opacity-80"
            >
              <Ionicons name="add-circle" size={20} color="#F59E0B" />
              <Text className="text-foreground font-body-medium text-base">
                + Add "{search}"
              </Text>
            </Pressable>
          )}

          {/* Grid */}
          <Text className="text-muted font-body-medium text-sm mb-3">
            {search ? "Results" : "Popular interests"}
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-8">
            {filtered.map((interest) => (
              <InterestChip
                key={interest.id}
                label={interest.label}
                emoji={interest.emoji}
                variant={selected.includes(interest.id) ? "selected" : "default"}
                onPress={() => toggle(interest.id)}
              />
            ))}
          </View>
        </ScrollView>

        {/* CTA */}
        <View className="px-6 pb-6 pt-3 bg-surface border-t border-border">
          <Button
            label={selected.length > 0 ? `Continue with ${selected.length} interest${selected.length > 1 ? "s" : ""}` : "Continue"}
            onPress={() => navigation.replace("Main")}
            disabled={selected.length === 0}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
