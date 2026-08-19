import React from "react";
import { View, Text, Pressable, SafeAreaView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import Button from "../components/Button";

type Props = NativeStackScreenProps<RootStackParamList, "Welcome">;

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="flex-1 px-8 justify-between py-12">
        {/* Logo */}
        <View className="items-center mt-12">
          <View className="w-24 h-24 bg-primary rounded-3xl items-center justify-center mb-6 shadow-lg">
            <Text style={{ fontSize: 44 }}>🌐</Text>
          </View>
          <Text className="text-primary font-display text-3xl tracking-tight">
            PeopleFind
          </Text>
        </View>

        {/* Hero */}
        <View className="items-center">
          <Text className="text-foreground font-display text-4xl text-center leading-tight mb-4">
            Find Your{"\n"}People
          </Text>
          <Text className="text-muted font-body text-base text-center leading-relaxed">
            Discover people who share the things you're into. No awkward intros — just common ground.
          </Text>
        </View>

        {/* Interest pills decoration */}
        <View className="items-center gap-2">
          <View className="flex-row gap-2 flex-wrap justify-center">
            {["♟️ Chess", "💻 Programming", "📷 Photography"].map((t) => (
              <View key={t} className="bg-white border border-border rounded-full px-3.5 py-2">
                <Text className="text-foreground font-body-medium text-sm">{t}</Text>
              </View>
            ))}
          </View>
          <View className="flex-row gap-2 flex-wrap justify-center">
            {["⛓️ Blockchain", "🎬 Film", "🚀 Startups"].map((t) => (
              <View key={t} className="bg-white border border-border rounded-full px-3.5 py-2">
                <Text className="text-foreground font-body-medium text-sm">{t}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* CTAs */}
        <View className="gap-3">
          <Button label="Get Started" onPress={() => navigation.navigate("SignUp")} />
          <Pressable
            onPress={() => navigation.navigate("Login")}
            className="py-3 items-center active:opacity-70"
          >
            <Text className="text-muted font-body text-base">
              Already have an account?{" "}
              <Text className="text-primary font-body-semi">Log in</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
