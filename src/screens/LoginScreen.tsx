import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, SafeAreaView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../navigation/RootNavigator";
import Button from "../components/Button";
import Input from "../components/Input";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable onPress={() => navigation.goBack()} className="mb-6 active:opacity-70">
          <Ionicons name="arrow-back" size={24} color="#18181B" />
        </Pressable>

        <Text className="text-foreground font-display text-3xl mb-1">Welcome back</Text>
        <Text className="text-muted font-body text-base mb-8">
          Log in to find your people.
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
          placeholder="Your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable className="mb-6 active:opacity-70">
          <Text className="text-primary font-body-medium text-sm text-right">Forgot password?</Text>
        </Pressable>

        <Button
          label="Log In"
          onPress={() => navigation.replace("Main")}
        />

        <View className="flex-row items-center my-6">
          <View className="flex-1 h-px bg-border" />
          <Text className="text-muted font-body text-sm mx-4">or</Text>
          <View className="flex-1 h-px bg-border" />
        </View>

        <Pressable className="flex-row items-center justify-center bg-white border border-border rounded-2xl py-4 gap-3 mb-8 active:opacity-80">
          <Text style={{ fontSize: 20 }}>🇬</Text>
          <Text className="text-foreground font-body-semi text-base">Continue with Google</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("SignUp")}
          className="items-center active:opacity-70"
        >
          <Text className="text-muted font-body text-base">
            Don't have an account?{" "}
            <Text className="text-primary font-body-semi">Sign up</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
