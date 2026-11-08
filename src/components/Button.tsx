import React from "react";
import { Pressable, Text, View, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Variant = "primary" | "secondary" | "ghost" | "danger";

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
};

export default function Button({
  label,
  onPress,
  variant = "primary",
  fullWidth = true,
  loading = false,
  disabled = false,
}: Props) {
  if (variant === "primary") {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        className={`flex-row items-stretch bg-ink border border-ink overflow-hidden ${
          fullWidth ? "w-full" : ""
        } ${disabled ? "opacity-40" : "active:opacity-85"}`}
      >
        <View className="flex-1 px-5 py-4 justify-center">
          {loading ? (
            <ActivityIndicator color="#FCFBF7" />
          ) : (
            <Text className="text-card font-body-bold text-xs uppercase tracking-[2px]">
              {label}
            </Text>
          )}
        </View>
        <View className="w-14 bg-primary items-center justify-center border-l border-ink">
          <Ionicons name="arrow-forward" size={18} color="#FCFBF7" />
        </View>
      </Pressable>
    );
  }

  const variantClasses: Record<Exclude<Variant, "primary">, { container: string; text: string }> = {
    secondary: {
      container:
        "bg-card border border-ink px-5 py-4 flex-row items-center justify-between",
      text: "text-ink font-body-bold text-xs uppercase tracking-[2px]",
    },
    ghost: {
      container: "py-3.5 items-center justify-center",
      text: "text-muted font-body-semi text-xs uppercase tracking-[1.8px]",
    },
    danger: {
      container: "bg-danger px-5 py-4 items-center justify-center",
      text: "text-card font-body-bold text-xs uppercase tracking-[2px]",
    },
  };

  const classes = variantClasses[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`${classes.container} ${fullWidth ? "w-full" : ""} ${
        disabled ? "opacity-40" : "active:opacity-75"
      }`}
    >
      {loading ? (
        <ActivityIndicator color="#111111" />
      ) : (
        <>
          <Text className={classes.text}>{label}</Text>
          {variant === "secondary" && (
            <Ionicons name="arrow-up-outline" size={15} color="#111111" style={{ transform: [{ rotate: "45deg" }] }} />
          )}
        </>
      )}
    </Pressable>
  );
}
