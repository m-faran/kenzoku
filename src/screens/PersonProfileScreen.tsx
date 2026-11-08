import React from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { DiscoverStackParamList } from "../navigation/stacks/DiscoverStack";
import InterestChip from "../components/InterestChip";
import Button from "../components/Button";
import {
  getSharedInterests,
  getInterestLabel,
} from "../data/mockData";
import { useUser } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";
import { useBlockStatus, useToggleBlock } from "../hooks/useBlocks";
import { ProfileRow } from "../lib/api/profiles";
import { supabase } from "../lib/supabase";
import { useConnectionStatus, useSendConnection } from "../hooks/useConnections";

type Props = NativeStackScreenProps<DiscoverStackParamList, "PersonProfile">;

const { width: W } = Dimensions.get("window");

export default function PersonProfileScreen({ route, navigation }: Props) {
  const { user } = useUser();
  const { user: authUser } = useAuth();
  const sendConnection = useSendConnection();
  const { data: connectionStatus } = useConnectionStatus(route.params.personId);
  const { data: isBlocked } = useBlockStatus(route.params.personId);
  const { mutate: toggleBlock } = useToggleBlock(route.params.personId, !!isBlocked);

  const { data: person, isLoading } = useQuery({
    queryKey: ["profile", route.params.personId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", route.params.personId)
        .single();
      if (error) throw error;
      return data as ProfileRow;
    },
  });

  const [didRequestConnection, setDidRequestConnection] = React.useState(false);
  const [reporting, setReporting] = React.useState(false);

  if (isLoading || !person) {
    return (
      <View className="flex-1 bg-surface items-center justify-center">
        <ActivityIndicator size="large" color="#FF3B1D" />
      </View>
    );
  }

  const shared = getSharedInterests(person.interests ?? [], user.interests);
  const personInterests = person.interests ?? [];
  const nameParts = (person.name || "Kindred").trim().split(/\s+/);
  const firstName = nameParts[0].toUpperCase();
  const restName = nameParts.slice(1).join(" ").toUpperCase();
  const statCount = shared.length > 0 ? shared.length : personInterests.length;
  const statLabel = shared.length > 0 ? "SHARED\nPASSIONS" : "ACTIVE\nPASSIONS";

  const handleConnect = () => {
    if (sendConnection.isPending || didRequestConnection) return;
    setDidRequestConnection(true);

    sendConnection.mutate(person.id, {
      onSuccess: () => {
        Alert.alert("Connected!", `You've sent a connection request to ${person.name}.`);
      },
      onError: (err: any) => {
        setDidRequestConnection(false);
        Alert.alert("Error", err.message ?? "Failed to send connection request");
      },
    });
  };

  const handleReport = () => {
    if (reporting || !person || !authUser) return;
    Alert.alert(
      "Report User",
      `Are you sure you want to report ${person.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Report",
          style: "destructive",
          onPress: async () => {
            setReporting(true);
            try {
              const { error } = await supabase.from('reports').insert({
                reporter_id: authUser.id,
                reported_id: person.id,
                reason: "Inappropriate behavior"
              });
              if (error) throw error;
              Alert.alert("Reported", "Thanks for keeping the community safe.");
            } catch (e: any) {
              Alert.alert("Error", e.message ?? "Failed to send report.");
            } finally {
              setReporting(false);
            }
          }
        }
      ]
    );
  };

  const isActuallyPending = connectionStatus === "pending" || didRequestConnection;

  return (
    <View className="flex-1 bg-surface">
      {/* Top navigation & technical spec bar */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-border bg-surface">
        <Pressable
          onPress={() => navigation.goBack()}
          className="w-9 h-9 bg-card border border-ink items-center justify-center active:opacity-70"
        >
          <Ionicons name="arrow-back" size={18} color="#111111" />
        </Pressable>

        <View className="flex-row items-center gap-3">
          {person.city ? (
            <View className="flex-row items-center gap-1">
              <Ionicons name="location-outline" size={11} color="#111111" />
              <Text className="text-ink font-body-semi text-[10px] uppercase tracking-[1.8px]">
                {person.city}
              </Text>
            </View>
          ) : null}
          {person.age ? (
            <Text className="text-muted font-body-semi text-[10px] uppercase tracking-[1.8px]">
              {person.age} YRS
            </Text>
          ) : null}
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        bounces
      >
        {/* PLANE 1 (BACK): Massive two-line editorial display name */}
        <View className="px-4 pt-3 pb-7 bg-surface" style={{ zIndex: 1 }}>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.5}
            className="text-ink font-display uppercase"
            style={{
              fontSize: 72,
              lineHeight: 64,
              letterSpacing: -3,
            }}
          >
            {firstName}
          </Text>
          {restName ? (
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.5}
              className="text-ink font-display uppercase"
              style={{
                fontSize: 64,
                lineHeight: 58,
                letterSpacing: -2.5,
              }}
            >
              {restName}
            </Text>
          ) : null}
        </View>

        {/* PLANE 2 (MIDDLE): Subject portrait overlapping background display typography */}
        <View
          className="mx-4 border border-ink bg-paper-sunken overflow-hidden"
          style={{
            height: W * 0.92,
            marginTop: -26,
            zIndex: 2,
            shadowColor: "#111111",
            shadowOffset: { width: 0, height: 14 },
            shadowOpacity: 0.15,
            shadowRadius: 20,
            elevation: 6,
          }}
        >
          <Image
            source={{ uri: person.photo_url }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(17,17,17,0.6)"]}
            locations={[0.45, 1]}
            style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 140 }}
          />

          {/* Framed architectural stat box (Maya Ross 8+ Experience style) */}
          <View
            className="absolute bottom-7 left-4 bg-card/95 border border-ink px-3.5 py-2.5 flex-row items-center"
            style={{ gap: 10 }}
          >
            <Text
              className="text-ink font-display-bold"
              style={{ fontSize: 34, lineHeight: 34, letterSpacing: -1.5 }}
            >
              {String(statCount).padStart(2, "0")}
            </Text>
            <Text className="text-ink font-body-bold text-[9px] uppercase tracking-[1.8px] leading-[13px]">
              {statLabel}
            </Text>
          </View>

          {person.school ? (
            <View className="absolute top-3 right-3 bg-card/95 border border-ink px-2.5 py-1">
              <Text className="text-ink font-body-semi text-[9px] uppercase tracking-[1.6px]">
                {person.school}
              </Text>
            </View>
          ) : null}
        </View>

        {/* PLANE 3 (TOP): Foreground dossier card overlapping portrait plane */}
        <View
          className="mx-4 bg-card border border-ink p-5"
          style={{ marginTop: -18, zIndex: 3 }}
        >
          {/* Motive as crisp uppercase manifesto */}
          {person.motive ? (
            <View className="pb-3.5 mb-3.5 border-b border-border flex-row items-start gap-2">
              <View className="w-1.5 h-1.5 bg-primary mt-1.5" />
              <Text className="flex-1 text-ink font-body-bold text-[11px] uppercase tracking-[1.8px] leading-[17px]">
                {person.motive}
              </Text>
            </View>
          ) : null}

          {/* Bio */}
          <Text className="text-ink font-body text-[13px] leading-[20px]">
            {person.bio}
          </Text>

          {person.specific_interests ? (
            <View className="mt-4 pt-3.5 border-t border-border">
              <Text className="text-ink font-body text-[12px] leading-[18px] text-muted">
                {person.specific_interests}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Shared Passions Spec Block */}
        <View className="px-4 pt-6 pb-10">
          {shared.length > 0 && (
            <View className="mb-6 pb-6 border-b border-border">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center gap-2">
                  <View className="w-2 h-2 bg-primary" />
                  <Text className="text-ink font-body-bold text-[10px] uppercase tracking-[2px]">
                    MUTUAL WAVELENGTH
                  </Text>
                </View>
                <Text className="text-muted font-body-semi text-[10px] uppercase tracking-[1.8px]">
                  {String(shared.length).padStart(2, "0")} MATCHED
                </Text>
              </View>
              <View className="flex-row flex-wrap gap-2">
                {shared.map((id) => (
                  <InterestChip
                    key={id}
                    label={getInterestLabel(id)}
                    variant="shared"
                  />
                ))}
              </View>
            </View>
          )}

          {/* All Interests Index */}
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-ink font-body-bold text-[10px] uppercase tracking-[2px]">
              FULL PASSION INDEX
            </Text>
            <Text className="text-muted font-body-semi text-[10px] uppercase tracking-[1.8px]">
              {String(personInterests.length).padStart(2, "0")} TOTAL
            </Text>
          </View>
          <View className="flex-row flex-wrap gap-2 mb-8">
            {personInterests.map((id) => (
              <InterestChip
                key={id}
                label={getInterestLabel(id)}
                variant={shared.includes(id) ? "shared" : "default"}
              />
            ))}
          </View>

          {/* Safety actions in tiny uppercase ink */}
          <View className="flex-row justify-center items-center gap-6 pt-4 border-t border-border">
            <Pressable onPress={handleReport} className="py-1 active:opacity-70">
              <Text className="text-muted font-body-semi text-[10px] uppercase tracking-[1.8px]">
                Report Profile
              </Text>
            </Pressable>
            <View className="w-1 h-1 bg-border" />
            <Pressable
              onPress={() => {
                Alert.alert(
                  "Options",
                  isBlocked ? `Unblock ${person.name}?` : `Block ${person.name}?`,
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: isBlocked ? "Unblock" : "Block",
                      style: isBlocked ? "default" : "destructive",
                      onPress: () => toggleBlock(),
                    },
                  ]
                );
              }}
              className="py-1 active:opacity-70"
            >
              <Text className="text-muted font-body-semi text-[10px] uppercase tracking-[1.8px]">
                {isBlocked ? "Unblock User" : "Block User"}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Foreground Action Bar (Maya Ross 'Book a session' bar) */}
      <View className="px-4 py-3 bg-surface border-t border-ink">
        {(connectionStatus === "none" || connectionStatus === "rejected") && !isActuallyPending && (
          <Button
            label={`Connect with ${person.name}`}
            onPress={handleConnect}
            disabled={sendConnection.isPending || didRequestConnection}
          />
        )}

        {isActuallyPending && (
          <View className="bg-card border border-ink py-4 px-5 flex-row items-center justify-between">
            <Text className="text-ink font-body-bold text-xs uppercase tracking-[2px]">
              Request Pending
            </Text>
            <View className="w-2 h-2 bg-primary" />
          </View>
        )}

        {connectionStatus === "accepted" && !isActuallyPending && (
          <View className="bg-ink border border-ink py-4 px-5 flex-row items-center justify-between">
            <Text className="text-card font-body-bold text-xs uppercase tracking-[2px]">
              Connected
            </Text>
            <Ionicons name="checkmark" size={16} color="#FF3B1D" />
          </View>
        )}
      </View>
    </View>
  );
}
