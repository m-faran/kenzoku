import React from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import InterestChip from "./InterestChip";
import {
  Person,
  getSharedInterests,
  getInterestLabel,
  getInterestEmoji,
} from "../data/mockData";
import { useUser } from "../context/UserContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = Math.min(SCREEN_WIDTH - 32, 360);
const CARD_HEIGHT = CARD_WIDTH * 1.35;

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

  return (
    <Pressable
      onPress={onPress}
      className={`rounded-3xl overflow-hidden bg-card ${shadow ? "shadow-lg" : ""}`}
      style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
    >
      {/* Photo */}
      <Image
        source={{ uri: person.photo }}
        style={{ width: CARD_WIDTH, height: CARD_HEIGHT, position: "absolute" }}
        contentFit="cover"
      />

      {/* Gradient overlay */}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.25)", "rgba(0,0,0,0.85)"]}
        locations={[0.35, 0.6, 1]}
        style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: CARD_HEIGHT * 0.65 }}
      />

      {/* Content */}
      <View className="absolute bottom-0 left-0 right-0 p-5">
        {/* Shared interests banner */}
        {shared.length > 0 && (
          <View className="bg-accent rounded-xl px-3 py-2 mb-3 flex-row items-center gap-2">
            <Text className="text-white font-body-semi text-xs">
              You both like {shared.map((id) => getInterestLabel(id)).join(" · ")}
            </Text>
          </View>
        )}

        {/* Name + location */}
        <Text className="text-white font-display text-2xl mb-0.5">
          {person.name}, {person.age}
        </Text>
        <Text className="text-white/80 font-body text-sm mb-2">
          📍 {person.city}
        </Text>

        {/* Bio */}
        <Text className="text-white/90 font-body text-sm mb-3" numberOfLines={2}>
          {person.bio}
        </Text>

        {/* Interest chips */}
        <View className="flex-row flex-wrap gap-1.5 mb-4">
          {person.interests.slice(0, 4).map((id) => (
            <InterestChip
              key={id}
              label={getInterestLabel(id)}
              emoji={getInterestEmoji(id)}
              variant={shared.includes(id) ? "shared" : "default"}
              small
            />
          ))}
        </View>

        {/* Actions */}
        {(onConnect || onPass) && (
          <View className="flex-row gap-3">
            {onPass && (
              <Pressable
                onPress={onPass}
                className="flex-1 bg-white/20 rounded-2xl py-3.5 items-center active:opacity-70"
              >
                <Text className="text-white font-body-semi text-base">Pass</Text>
              </Pressable>
            )}
            {onConnect && (
              <Pressable
                onPress={onConnect}
                className="flex-[2] bg-primary rounded-2xl py-3.5 items-center active:opacity-80"
              >
                <Text className="text-white font-body-semi text-base">Connect</Text>
              </Pressable>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}
