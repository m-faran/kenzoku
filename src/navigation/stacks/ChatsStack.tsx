import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatsScreen from "../../screens/ChatsScreen";
import ChatScreen from "../../screens/ChatScreen";

export type ChatsStackParamList = {
  Chats: undefined;
  Chat: { channelId: string; personId: string };
};

const Stack = createNativeStackNavigator<ChatsStackParamList>();

export default function ChatsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Chats" component={ChatsScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
}
