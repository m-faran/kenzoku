import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../navigation/RootNavigator";
import Button from "../components/Button";
import Input from "../components/Input";
import { signIn, resetPassword } from "../lib/api/auth";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      // AuthContext picks up the session change → RootNavigator auto-navigates to Main
    } catch (e: any) {
      setError(e.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-surface"
      behavior="padding"
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: Math.max(24, insets.bottom + 24) }}
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
          onChangeText={(text) => {
            setPassword(text);
            if (error) setError("");
          }}
        />

        {error ? (
          <Text className="text-red-500 font-body text-sm mt-1 mb-2">{error}</Text>
        ) : null}

        <Pressable
          className="mb-6 active:opacity-70"
          onPress={async () => {
            if (!email) {
              Alert.alert("Error", "Please enter your email address first.");
              return;
            }
            try {
              await resetPassword(email.trim());
              Alert.alert("Check Your Email", "A password reset link has been sent to your email address.");
            } catch (e: any) {
              Alert.alert("Error", e.message ?? "Failed to send reset email.");
            }
          }}
        >
          <Text className="text-primary font-body-medium text-sm text-right">Forgot password?</Text>
        </Pressable>

        <Button
          label={loading ? "Logging in..." : "Log In"}
          onPress={handleLogin}
          disabled={loading}
        />



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
    </KeyboardAvoidingView>
  );
}
