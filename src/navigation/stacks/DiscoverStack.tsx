import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DiscoverScreen from "../../screens/DiscoverScreen";
import PersonProfileScreen from "../../screens/PersonProfileScreen";

export type DiscoverStackParamList = {
  Discover: undefined;
  PersonProfile: { personId: string };
};

const Stack = createNativeStackNavigator<DiscoverStackParamList>();

export default function DiscoverStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Discover" component={DiscoverScreen} />
      <Stack.Screen name="PersonProfile" component={PersonProfileScreen} />
    </Stack.Navigator>
  );
}
