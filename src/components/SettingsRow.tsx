import React from "react";
import { View, Text, Pressable, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  value?: string;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (val: boolean) => void;
  onPress?: () => void;
  destructive?: boolean;
  showChevron?: boolean;
};

export default function SettingsRow({
  label,
  icon,
  iconColor = "#111111",
  value,
  toggle,
  toggleValue,
  onToggle,
  onPress,
  destructive,
  showChevron = true,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center px-5 py-4 bg-card active:bg-paper-sunken"
    >
      {icon && (
        <View className="w-7 h-7 border border-border bg-surface items-center justify-center mr-3.5">
          <Ionicons name={icon} size={15} color={destructive ? "#D92D20" : iconColor} />
        </View>
      )}
      <Text
        className={`flex-1 font-body-semi text-xs uppercase tracking-[1.5px] ${
          destructive ? "text-danger" : "text-ink"
        }`}
      >
        {label}
      </Text>
      {value && !toggle && (
        <Text className="text-muted font-body text-xs mr-2">{value}</Text>
      )}
      {toggle && (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: "#DCD6CA", true: "#FF3B1D" }}
          thumbColor="#FCFBF7"
        />
      )}
      {!toggle && showChevron && !destructive && (
        <Ionicons name="arrow-forward" size={14} color="#111111" />
      )}
    </Pressable>
  );
}
