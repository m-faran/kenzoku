import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../navigation/RootNavigator";
import Button from "../components/Button";
import Input from "../components/Input";
import { useUser } from "../context/UserContext";
import { signUp } from "../lib/api/auth";
import { upsertProfile } from "../lib/api/profiles";

type Props = NativeStackScreenProps<RootStackParamList, "SignUp">;

import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SignUpScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { updateUser } = useUser();
  const insets = useSafeAreaInsets();

  const handleContinue = async () => {
    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge < 18 || parsedAge > 120) {
      setError("You must be at least 18 years old to join.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await signUp(email.trim(), password, parsedAge);

      updateUser({ email: email.trim(), age: parsedAge });

      if (!data.session) {
        Alert.alert(
          "Verify your email first",
          "We've sent a verification link to your email. Please click the link to verify your account before logging in.",
          [{ text: "OK", onPress: () => navigation.navigate("Login") }]
        );
      }
      // If there IS a session, AuthContext will automatically redirect to Main!
    } catch (e: any) {
      setError(e.message ?? "Sign up failed");
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
        {/* Back */}
        <Pressable onPress={() => navigation.goBack()} className="mb-6 w-9 h-9 bg-card border border-ink items-center justify-center active:opacity-70">
          <Ionicons name="arrow-back" size={18} color="#111111" />
        </Pressable>

        <View className="flex-row items-center gap-2 mb-2">
          <View className="w-2 h-2 bg-primary" />
          <Text className="text-ink font-body-bold text-[10px] uppercase tracking-[2px]">
            MEMBERSHIP
          </Text>
        </View>

        <Text
          className="text-ink font-display uppercase mb-1"
          style={{ fontSize: 40, lineHeight: 36, letterSpacing: -2 }}
        >
          CREATE{"\n"}ACCOUNT
        </Text>
        <Text className="text-muted font-body text-xs leading-[18px] mb-8">
          Join and connect with people on your exact wavelength.
        </Text>

        <Input
          label="Email Address"
          placeholder="YOU@EXAMPLE.COM"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          label="Your Age"
          placeholder="E.G. 22"
          keyboardType="number-pad"
          value={age}
          onChangeText={(text) => {
            setAge(text);
            if (error) setError("");
          }}
        />
        <Input
          label="Password (min 8 characters)"
          placeholder="AT LEAST 8 CHARACTERS"
          secureTextEntry
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (error) setError("");
          }}
        />
        <Input
          label="Confirm Password"
          placeholder="REPEAT YOUR PASSWORD"
          secureTextEntry
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            if (error) setError("");
          }}
        />

        {error ? (
          <Text className="text-danger font-body-semi text-xs mt-1 mb-2">{error}</Text>
        ) : null}

        <View className="mt-3 mb-6">
          <Button
            label={loading ? "Registering..." : "Continue"}
            onPress={handleContinue}
            disabled={loading}
          />
        </View>

        {/* Link to Login */}
        <Pressable
          onPress={() => navigation.navigate("Login")}
          className="items-center active:opacity-70"
        >
          <Text className="text-muted font-body text-xs">
            Already have an account?{" "}
            <Text className="text-primary font-body-bold uppercase tracking-[1px]">Log in</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
