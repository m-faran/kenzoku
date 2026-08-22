import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/AuthContext";

import WelcomeScreen from "../screens/WelcomeScreen";
import SignUpScreen from "../screens/SignUpScreen";
import LoginScreen from "../screens/LoginScreen";
import ProfileSetupScreen from "../screens/ProfileSetupScreen";
import InterestSelectionScreen from "../screens/InterestSelectionScreen";
import PersonProfileScreen from "../screens/PersonProfileScreen";
import MainTabs from "./MainTabs";

export type RootStackParamList = {
  Welcome: undefined;
  SignUp: undefined;
  Login: undefined;
  ProfileSetup: undefined;
  InterestSelection: undefined;
  PersonProfile: { personId: string };
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {session ? (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          {/* Allow navigating to profile setup from Main if profile is incomplete */}
          <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
          <Stack.Screen name="InterestSelection" component={InterestSelectionScreen} />
          <Stack.Screen name="PersonProfile" component={PersonProfileScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
          <Stack.Screen name="InterestSelection" component={InterestSelectionScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
