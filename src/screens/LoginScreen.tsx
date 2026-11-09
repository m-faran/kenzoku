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
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: Math.max(24, insets.bottom + 24) }}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable onPress={() => navigation.goBack()} className="mb-6 w-9 h-9 bg-card border border-ink items-center justify-center active:opacity-70">
          <Ionicons name="arrow-back" size={18} color="#111111" />
        </Pressable>

        <View className="flex-row items-center gap-2 mb-2">
          <View className="w-2 h-2 bg-primary" />
          <Text className="text-ink font-body-bold text-[10px] uppercase tracking-[2px]">
            AUTHENTICATION
          </Text>
        </View>

        <Text
          className="text-ink font-display uppercase mb-1"
          style={{ fontSize: 44, lineHeight: 40, letterSpacing: -2 }}
        >
          WELCOME{"\n"}BACK
        </Text>
        <Text className="text-muted font-body text-xs leading-[18px] mb-8">
          Enter your credentials to access your kindred circle.
        </Text>

        <Input
          label="Email"
          placeholder="YOU@EXAMPLE.COM"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          label="Password"
          placeholder="ENTER PASSWORD"
          secureTextEntry
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (error) setError("");
          }}
        />

        {error ? (
          <Text className="text-danger font-body-semi text-xs mt-1 mb-2">{error}</Text>
        ) : null}

        <Pressable
          className="mb-8 active:opacity-70"
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
          <Text className="text-primary font-body-bold text-[10px] uppercase tracking-[1.5px] text-right">
            Forgot password?
          </Text>
        </Pressable>

        <View className="mb-6">
          <Button
            label={loading ? "Authenticating..." : "Log In"}
            onPress={handleLogin}
            disabled={loading}
          />
        </View>

        <Pressable
          onPress={() => navigation.navigate("SignUp")}
          className="items-center active:opacity-70"
        >
          <Text className="text-muted font-body text-xs">
            Don't have an account?{" "}
            <Text className="text-primary font-body-bold uppercase tracking-[1px]">Sign up</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
