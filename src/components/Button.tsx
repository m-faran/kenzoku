import React from "react";
import { Pressable, Text, ActivityIndicator } from "react-native";

type Variant = "primary" | "secondary" | "ghost" | "danger";

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
};

const variantClasses: Record<Variant, { container: string; text: string }> = {
  primary: {
    container: "bg-primary rounded-2xl py-4 items-center justify-center",
    text: "text-white font-body-semi text-base",
  },
  secondary: {
    container:
      "bg-white border border-primary rounded-2xl py-4 items-center justify-center",
    text: "text-primary font-body-semi text-base",
  },
  ghost: {
    container: "py-4 items-center justify-center",
    text: "text-muted font-body-medium text-base",
  },
  danger: {
    container: "bg-danger rounded-2xl py-4 items-center justify-center",
    text: "text-white font-body-semi text-base",
  },
};

export default function Button({
  label,
  onPress,
  variant = "primary",
  fullWidth = true,
  loading = false,
  disabled = false,
}: Props) {
  const classes = variantClasses[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`${classes.container} ${fullWidth ? "w-full" : ""} ${disabled ? "opacity-50" : "active:opacity-80"}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#fff" : "#7C3AED"} />
      ) : (
        <Text className={classes.text}>{label}</Text>
      )}
    </Pressable>
  );
}
