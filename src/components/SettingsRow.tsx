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
  iconColor = "#7C3AED",
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
      className="flex-row items-center px-5 py-4 bg-white active:bg-surface"
    >
      {icon && (
        <View
          className="w-8 h-8 rounded-lg items-center justify-center mr-3"
          style={{ backgroundColor: iconColor + "18" }}
        >
          <Ionicons name={icon} size={17} color={iconColor} />
        </View>
      )}
      <Text
        className={`flex-1 font-body-medium text-base ${destructive ? "text-danger" : "text-foreground"}`}
      >
        {label}
      </Text>
      {value && !toggle && (
        <Text className="text-muted font-body text-sm mr-2">{value}</Text>
      )}
      {toggle && (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: "#E4E4E7", true: "#7C3AED" }}
          thumbColor="#fff"
        />
      )}
      {!toggle && showChevron && !destructive && (
        <Ionicons name="chevron-forward" size={16} color="#A1A1AA" />
      )}
    </Pressable>
  );
}
