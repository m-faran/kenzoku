import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import Button from "../components/Button";

type Props = NativeStackScreenProps<RootStackParamList, "Welcome">;

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <View className="flex-1 bg-surface">
      <View className="flex-1 px-8 justify-center py-8">
        {/* Logo */}
        <View className="items-center mb-10">
          <Image
            source={require("../../assets/kenzoku_logo.png")}
            className="w-56 h-56 rounded-3xl mb-4"
            resizeMode="contain"
          />
          <Text className="text-primary font-display text-4xl tracking-tight">
            Kenzoku
          </Text>
        </View>

        {/* Hero */}
        <View className="items-center mb-10">
          <Text className="text-foreground font-display text-4xl text-center leading-tight">
            Find Your{"\n"}People
          </Text>
        </View>

        {/* CTAs */}
        <View className="gap-4 w-full">
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
    </View>
  );
}
