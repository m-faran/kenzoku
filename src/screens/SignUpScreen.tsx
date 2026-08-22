import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, SafeAreaView, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../navigation/RootNavigator";
import Button from "../components/Button";
import Input from "../components/Input";
import { useUser } from "../context/UserContext";
import { signUp } from "../lib/api/auth";
import { upsertProfile } from "../lib/api/profiles";

type Props = NativeStackScreenProps<RootStackParamList, "SignUp">;

export default function SignUpScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { updateUser } = useUser();

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
      const data = await signUp(email.trim(), password);

      updateUser({ email: email.trim(), age: parsedAge });

      if (data.user?.id) {
        try {
          await upsertProfile(data.user.id, { age: parsedAge });
        } catch (e) {
          console.warn("Could not save initial profile", e);
        }
      }

      if (!data.session) {
        Alert.alert("Success", "Please check your inbox for email verification!");
      }
      // If there IS a session, AuthContext will automatically redirect to Main!
    } catch (e: any) {
      setError(e.message ?? "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

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
          label="Age"
          placeholder="e.g. 22"
          keyboardType="number-pad"
          value={age}
          onChangeText={(text) => {
            setAge(text);
            if (error) setError("");
          }}
        />
        <Input
          label="Create Password"
          placeholder="At least 8 characters"
          secureTextEntry
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (error) setError("");
          }}
        />
        <Input
          label="Confirm Password"
          placeholder="Repeat your password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            if (error) setError("");
          }}
        />

        {error ? (
          <Text className="text-red-500 font-body text-sm mt-1">{error}</Text>
        ) : null}

        <View className={error ? "mt-3 mb-6" : "mt-2 mb-6"}>
          <Button
            label={loading ? "Creating account..." : "Continue"}
            onPress={handleContinue}
            disabled={loading}
          />
        </View>

        {/* Divider */}
        <View className="flex-row items-center mb-6">
          <View className="flex-1 h-px bg-border" />
          <Text className="text-muted font-body text-sm mx-4">or</Text>
          <View className="flex-1 h-px bg-border" />
        </View>

        {/* Google — deferred */}
        <Pressable 
          onPress={() => Alert.alert("Notice", "Google service unavailable at the moment, please enter credentials manually.")}
          className="flex-row items-center justify-center bg-white border border-border rounded-2xl py-4 gap-3 mb-8 active:opacity-80"
        >
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
