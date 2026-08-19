import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, SafeAreaView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../navigation/RootNavigator";
import Button from "../components/Button";
import Input from "../components/Input";

type Props = NativeStackScreenProps<RootStackParamList, "SignUp">;

export default function SignUpScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back */}
        <Pressable onPress={() => navigation.goBack()} className="mb-6 active:opacity-70">
          <Ionicons name="arrow-back" size={24} color="#18181B" />
        </Pressable>

        <Text className="text-foreground font-display text-3xl mb-1">Create account</Text>
        <Text className="text-muted font-body text-base mb-8">
          Join and find people who share your interests.
        </Text>

        <Input
          label="Email"
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          label="Password"
          placeholder="At least 8 characters"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <View className="mt-2 mb-6">
          <Button
            label="Continue"
            onPress={() => navigation.navigate("ProfileSetup")}
          />
        </View>

        {/* Divider */}
        <View className="flex-row items-center mb-6">
          <View className="flex-1 h-px bg-border" />
          <Text className="text-muted font-body text-sm mx-4">or</Text>
          <View className="flex-1 h-px bg-border" />
        </View>

        {/* Google */}
        <Pressable className="flex-row items-center justify-center bg-white border border-border rounded-2xl py-4 gap-3 mb-8 active:opacity-80">
          <Text style={{ fontSize: 20 }}>🇬</Text>
          <Text className="text-foreground font-body-semi text-base">Continue with Google</Text>
        </Pressable>

        {/* Link to Login */}
        <Pressable
          onPress={() => navigation.navigate("Login")}
          className="items-center active:opacity-70"
        >
          <Text className="text-muted font-body text-base">
            Already have an account?{" "}
            <Text className="text-primary font-body-semi">Log in</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
