import React from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import InterestChip from "./InterestChip";
import {
  Person,
  getSharedInterests,
  getInterestLabel,
} from "../data/mockData";
import { useUser } from "../context/UserContext";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_WIDTH = Math.min(SCREEN_WIDTH - 28, 380);
const CARD_HEIGHT = Math.min(Math.max(SCREEN_HEIGHT * 0.71, 480), 570);

type Props = {
  person: Person;
  onConnect?: () => void;
  onPass?: () => void;
  onPress?: () => void;
  shadow?: boolean;
};

export default function PersonCard({
  person,
  onConnect,
  onPass,
  onPress,
  shadow = true,
}: Props) {
  const { user } = useUser();
  const shared = getSharedInterests(person.interests, user.interests);

  const nameParts = (person.name || "Kindred").trim().split(/\s+/);
  const firstName = nameParts[0].toUpperCase();
  const restName = nameParts.slice(1).join(" ").toUpperCase();
  const statCount = shared.length > 0 ? shared.length : person.interests.length;
  const statLabel = shared.length > 0 ? "SHARED\nPASSIONS" : "ACTIVE\nPASSIONS";

  return (
    <Pressable
      onPress={onPress}
      className="bg-card border border-ink overflow-hidden"
      style={[
        { width: CARD_WIDTH, height: CARD_HEIGHT },
        shadow
          ? {
              shadowColor: "#111111",
              shadowOffset: { width: 0, height: 14 },
              shadowOpacity: 0.12,
              shadowRadius: 24,
              elevation: 8,
            }
          : undefined,
      ]}
    >
      {/* Top technical metadata strip — tiny scale */}
      <View className="flex-row items-center justify-between px-4 py-2.5 border-b border-border bg-surface">
        <View className="flex-row items-center gap-1.5">
          <Ionicons name="location-outline" size={11} color="#111111" />
          <Text className="text-ink font-body-semi text-[10px] uppercase tracking-[1.8px]">
            {person.city || "Nearby"}
          </Text>
        </View>
        <Text className="text-muted font-body-semi text-[10px] uppercase tracking-[1.8px]">
          {person.age ? `${person.age} YRS` : "PROFILE"}
        </Text>
        <View className="flex-row items-center gap-1.5">
          {shared.length > 0 && <View className="w-1.5 h-1.5 bg-primary" />}
          <Text className="text-ink font-body-bold text-[10px] uppercase tracking-[1.8px]">
            {shared.length > 0
              ? `${shared.length} IN COMMON`
              : `${person.interests.length} PASSIONS`}
          </Text>
        </View>
      </View>

      {/* PLANE 1 (BACK): Huge editorial display typography */}
      <View className="px-3.5 pt-2 pb-6 bg-surface" style={{ zIndex: 1 }}>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.55}
          className="text-ink font-display uppercase"
          style={{
            fontSize: 68,
            lineHeight: 62,
            letterSpacing: -2.5,
          }}
        >
          {firstName}
        </Text>
        {restName ? (
          <View className="flex-row items-center justify-between -mt-1">
            <Text
              numberOfLines={1}
              className="text-muted font-body-bold text-[10px] uppercase tracking-[2.2px]"
            >
              {restName}
            </Text>
            {person.motive ? (
              <Text
                numberOfLines={1}
                className="text-ink font-body-semi text-[10px] uppercase tracking-[1.5px] max-w-[65%]"
              >
                — {person.motive}
              </Text>
            ) : null}
          </View>
        ) : person.motive ? (
          <Text
            numberOfLines={1}
            className="text-muted font-body-semi text-[10px] uppercase tracking-[1.6px] mt-0.5"
          >
            {person.motive}
          </Text>
        ) : null}
      </View>

      {/* PLANE 2 (MIDDLE): Subject frame overlapping the huge background type */}
      <View
        className="flex-1 mx-3.5 border border-ink bg-paper-sunken overflow-hidden"
        style={{
          marginTop: -22,
          zIndex: 2,
          shadowColor: "#111111",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.16,
          shadowRadius: 16,
          elevation: 6,
        }}
      >
        <Image
          source={{ uri: person.photo }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
        />

        <LinearGradient
          colors={["transparent", "rgba(17,17,17,0.55)"]}
          locations={[0.45, 1]}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 110,
          }}
        />

        {/* Architectural callout badge overlapping subject plane (Maya Ross 8+ style) */}
        <View
          className="absolute bottom-5 left-3 bg-card/95 border border-ink px-3 py-2 flex-row items-center"
          style={{ gap: 8 }}
        >
          <Text
            className="text-ink font-display-bold"
            style={{ fontSize: 28, lineHeight: 28, letterSpacing: -1 }}
          >
            {String(statCount).padStart(2, "0")}
          </Text>
          <Text className="text-ink font-body-bold text-[9px] uppercase tracking-[1.6px] leading-[12px]">
            {statLabel}
          </Text>
        </View>

        {/* Inspect profile hint in corner */}
        <View className="absolute top-2.5 right-2.5 bg-card/90 border border-ink px-2 py-1 flex-row items-center gap-1">
          <Text className="text-ink font-body-bold text-[9px] uppercase tracking-[1.5px]">
            DOSSIER
          </Text>
          <Ionicons name="arrow-up-outline" size={11} color="#111111" style={{ transform: [{ rotate: "45deg" }] }} />
        </View>
      </View>

      {/* PLANE 3 (TOP): Foreground bio, ink & paper chips, and signal CTA bar overlapping subject */}
      <View
        className="bg-card border-t border-ink px-4 pt-3.5 pb-3.5"
        style={{ marginTop: -12, zIndex: 3 }}
      >
        {/* Bio in compact high-contrast ink */}
        <Text
          className="text-ink font-body text-[12px] leading-[17px] mb-2.5"
          numberOfLines={2}
        >
          {person.bio}
        </Text>

        {/* Interest chips — Ink & Paper */}
        <View className="flex-row flex-wrap gap-1.5 mb-3.5">
          {person.interests.slice(0, 4).map((id) => (
            <InterestChip
              key={id}
              label={getInterestLabel(id)}
              variant={shared.includes(id) ? "shared" : "default"}
              small
            />
          ))}
        </View>

        {/* Foreground Action Bar: Paper 'Pass' + Signal Color 'Connect' */}
        {(onConnect || onPass) && (
          <View className="flex-row items-stretch gap-2.5">
            {onPass && (
              <Pressable
                onPress={onPass}
                className="px-5 py-3.5 bg-surface border border-ink items-center justify-center active:opacity-70"
              >
                <Text className="text-ink font-body-bold text-[11px] uppercase tracking-[2px]">
                  Pass
                </Text>
              </Pressable>
            )}
            {onConnect && (
              <Pressable
                onPress={onConnect}
                className="flex-1 bg-primary border border-ink flex-row items-center justify-between px-4 py-3.5 active:opacity-85"
              >
                <Text className="text-card font-body-bold text-[11px] uppercase tracking-[2px]">
                  Connect
                </Text>
                <Ionicons name="arrow-forward" size={16} color="#FCFBF7" />
              </Pressable>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}
