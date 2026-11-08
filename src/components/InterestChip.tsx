import React from "react";
import { Pressable, Text, View } from "react-native";

type Variant = "default" | "selected" | "shared" | "outline";

type Props = {
  label: string;
  emoji?: string;
  variant?: Variant;
  onPress?: () => void;
  small?: boolean;
};

const variantClasses: Record<Variant, { container: string; text: string; dot?: string }> = {
  default: {
    container: "bg-card border border-border",
    text: "text-ink",
  },
  selected: {
    container: "bg-ink border border-ink",
    text: "text-card",
    dot: "bg-primary",
  },
  shared: {
    container: "bg-ink border border-ink",
    text: "text-card",
    dot: "bg-primary",
  },
  outline: {
    container: "bg-transparent border border-ink",
    text: "text-ink",
  },
};

export default function InterestChip({
  label,
  variant = "default",
  onPress,
  small = false,
}: Props) {
  const classes = variantClasses[variant];
  const padding = small ? "px-2.5 py-1" : "px-3 py-1.5";
  const textSize = small ? "text-[10px]" : "text-[11px]";

  const content = (
    <>
      {classes.dot && (
        <View className={`w-1.5 h-1.5 ${classes.dot} mr-1.5`} />
      )}
      <Text className={`${classes.text} font-body-semi uppercase tracking-[1.5px] ${textSize}`}>
        {label}
      </Text>
    </>
  );

  if (!onPress) {
    return (
      <View className={`${classes.container} ${padding} flex-row items-center`}>
        {content}
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      className={`${classes.container} ${padding} flex-row items-center active:opacity-70`}
    >
      {content}
    </Pressable>
  );
}
