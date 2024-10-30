import React from "react";
import { Text, View } from "react-native";

const HelperText = ({ type, text, visible, fontSize }) => {
  if (!visible) return null;

  return (
    <View>
      <Text className={`${type === "error" ? "text-red-500" : ""} italic text-sm`}>{text}</Text>
    </View>
  );
};

export default HelperText;
