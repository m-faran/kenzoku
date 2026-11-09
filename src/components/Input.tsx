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
        <Text className="text-ink font-body-bold text-[10px] uppercase tracking-[2px] mb-2">
          {label}
        </Text>
      )}
      <View
        className={`bg-card border px-4 py-3.5 ${
          error
            ? "border-danger"
            : focused
            ? "border-ink"
            : "border-border"
        }`}
      >
        <TextInput
          className="text-ink font-body text-sm"
          placeholderTextColor="#A8A29E"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
      </View>
      {error && (
        <Text className="text-danger font-body-semi text-[10px] uppercase tracking-[1px] mt-1.5">
          {error}
        </Text>
      )}
    </View>
  );
}
