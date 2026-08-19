import React, { useState } from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";

type Props = TextInputProps & {
  label?: string;
  error?: string;
};

export default function Input({ label, error, ...props }: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-foreground font-body-medium text-sm mb-1.5">
          {label}
        </Text>
      )}
      <TextInput
        className={`bg-white border rounded-xl px-4 py-3.5 text-foreground font-body text-base ${
          focused ? "border-primary" : "border-border"
        } ${error ? "border-danger" : ""}`}
        placeholderTextColor="#A1A1AA"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      {error && (
        <Text className="text-danger font-body text-xs mt-1">{error}</Text>
      )}
    </View>
  );
}
