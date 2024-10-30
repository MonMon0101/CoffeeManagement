import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { themeColors } from "~/theme";

export default function ButtonAdd({ onPress = () => {}, label = "" }) {
  return (
    <TouchableOpacity
      className="w-full mb-5 p-4 rounded-md flex-row justify-center items-center space-x-2"
      onPress={onPress}
      style={{ backgroundColor: themeColors.bgColor(0.8) }}
    >
      <AntDesign name="plus" size={20} color="black" />
      <Text className="text-center font-bold">{label}</Text>
    </TouchableOpacity>
  );
}
