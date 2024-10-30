import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { themeColors } from "~/theme";

export default function ButtonLoader({
  label,
  onPress = () => {},
  loading = false,
  disabled = false,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`w-full p-3 rounded-full mb-3 flex-row justify-center items-center`}
      style={{
        backgroundColor: disabled || loading ? "rgba(204,211,202, 0.4)" : themeColors.bgColor(1),
      }}
      disabled={disabled || loading}
    >
      {loading ? <ActivityIndicator color={themeColors.text} /> : null}
      <Text
        className={`text-lg font-bold text-center ml-2`}
        style={{ color: disabled || loading ? themeColors.text : "white" }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
