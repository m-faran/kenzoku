import React from "react";
import { View } from "react-native";
import { Image } from "expo-image";

type Props = {
  uri?: string;
  size?: number;
  online?: boolean;
};

export default function Avatar({ uri, size = 48, online = false }: Props) {
  return (
    <View style={{ width: size, height: size }}>
      <Image
        source={uri ? { uri } : undefined}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: "#A78BFA",
        }}
        contentFit="cover"
      />
      {online && (
        <View
          className="absolute bg-online border-2 border-white rounded-full"
          style={{
            width: size * 0.27,
            height: size * 0.27,
            bottom: 0,
            right: 0,
          }}
        />
      )}
    </View>
  );
}
