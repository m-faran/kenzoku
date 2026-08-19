import React from "react";
import { Pressable, Text } from "react-native";

type Variant = "default" | "selected" | "shared" | "outline";

type Props = {
  label: string;
  emoji?: string;
  variant?: Variant;
  onPress?: () => void;
  small?: boolean;
};

const variantClasses: Record<Variant, { container: string; text: string }> = {
  default: {
    container: "bg-surface border border-border rounded-full",
    text: "text-foreground",
  },
  selected: {
    container: "bg-primary rounded-full",
    text: "text-white",
  },
  shared: {
    container: "bg-accent rounded-full",
    text: "text-white",
  },
  outline: {
    container: "bg-white border border-primary rounded-full",
    text: "text-primary",
  },
};

export default function InterestChip({
  label,
  emoji,
  variant = "default",
  onPress,
  small = false,
}: Props) {
  const classes = variantClasses[variant];
  const padding = small ? "px-2.5 py-1" : "px-3.5 py-2";
  const textSize = small ? "text-xs" : "text-sm";

  return (
    <Pressable
      onPress={onPress}
      className={`${classes.container} ${padding} flex-row items-center gap-1 active:opacity-70`}
    >
      {emoji && (
        <Text className={textSize}>
          {emoji}
        </Text>
      )}
      <Text className={`${classes.text} font-body-medium ${textSize}`}>
        {label}
      </Text>
    </Pressable>
  );
}
