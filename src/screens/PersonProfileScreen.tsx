import React from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Dimensions,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { DiscoverStackParamList } from "../navigation/stacks/DiscoverStack";
import InterestChip from "../components/InterestChip";
import Button from "../components/Button";
import {
  getPersonById,
  getSharedInterests,
  getInterestLabel,
  getInterestEmoji,
} from "../data/mockData";
import { useUser } from "../context/UserContext";
import { useNotifications } from "../context/NotificationContext";

type Props = NativeStackScreenProps<DiscoverStackParamList, "PersonProfile">;

const { width: W } = Dimensions.get("window");
const PHOTO_HEIGHT = W * 1.05;

export default function PersonProfileScreen({ route, navigation }: Props) {
  const person = getPersonById(route.params.personId);
  const { user } = useUser();
  const { addNotification } = useNotifications();
  if (!person) return null;

  const shared = getSharedInterests(person.interests, user.interests);
  const otherInterests = person.interests.filter((id) => !shared.includes(id));

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        bounces
      >
        {/* Photo header */}
        <View style={{ height: PHOTO_HEIGHT }}>
          <Image
            source={{ uri: person.photo }}
            style={{ width: W, height: PHOTO_HEIGHT }}
            contentFit="cover"
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.4)", "transparent", "transparent"]}
            style={{ position: "absolute", top: 0, left: 0, right: 0, height: 120 }}
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.6)"]}
            style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 200 }}
          />

          {/* Back button */}
          <Pressable
            onPress={() => navigation.goBack()}
            className="absolute top-14 left-5 w-10 h-10 bg-white/20 rounded-full items-center justify-center active:opacity-70"
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </Pressable>

          {/* Name overlay */}
          <View className="absolute bottom-6 left-6 right-6">
            <Text className="text-white font-display text-3xl mb-0.5">
              {person.name}, {person.age}
            </Text>
            <Text className="text-white/80 font-body text-base">
              📍 {person.city}
            </Text>
          </View>
        </View>

        {/* Content */}
        <View className="px-6 pt-6 pb-10">
          {/* Bio */}
          <Text className="text-foreground font-body text-base leading-relaxed mb-6">
            {person.bio}
          </Text>

          {/* Motive */}
          {person.motive && (
            <View className="bg-accent/10 border border-accent/20 rounded-2xl p-4 mb-6 items-center">
              <Text className="text-accent font-body-semi text-xs text-center uppercase tracking-wider mb-1">Motive</Text>
              <Text className="text-foreground font-body text-sm text-center">"{person.motive}"</Text>
            </View>
          )}

          {/* Shared interests */}
          {shared.length > 0 && (
            <View className="bg-accent/10 border border-accent/30 rounded-2xl p-4 mb-6">
              <View className="flex-row items-center gap-2 mb-3">
                <Text style={{ fontSize: 18 }}>✨</Text>
                <Text className="text-foreground font-body-semi text-base">You both like</Text>
              </View>
              <View className="flex-row flex-wrap gap-2">
                {shared.map((id) => (
                  <InterestChip
                    key={id}
                    label={getInterestLabel(id)}
                    emoji={getInterestEmoji(id)}
                    variant="shared"
                  />
                ))}
              </View>
            </View>
          )}

          {/* All interests */}
          <Text className="text-foreground font-body-semi text-base mb-3">
            All interests
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-8">
            {person.interests.map((id) => (
              <InterestChip
                key={id}
                label={getInterestLabel(id)}
                emoji={getInterestEmoji(id)}
                variant={shared.includes(id) ? "shared" : "default"}
              />
            ))}
          </View>

          {/* Connect */}
          <Button
            label={`Connect with ${person.name}`}
            onPress={() => {
              addNotification({
                type: "connection",
                text: `You sent a connection request to ${person.name}`,
                timestamp: "Just now",
                read: false,
                avatarUrl: person.photo,
              });
              Alert.alert("Connected!", `You've sent a connection request to ${person.name}.`);
            }}
          />

          {/* Safety actions */}
          <View className="flex-row justify-center gap-6 mt-5">
            <Pressable
              onPress={() => Alert.alert("Report", "Thanks for keeping the community safe.")}
              className="active:opacity-70"
            >
              <Text className="text-muted font-body text-sm">Report</Text>
            </Pressable>
            <Text className="text-border">•</Text>
            <Pressable
              onPress={() => Alert.alert("Blocked", `${person.name} has been blocked.`)}
              className="active:opacity-70"
            >
              <Text className="text-muted font-body text-sm">Block</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
