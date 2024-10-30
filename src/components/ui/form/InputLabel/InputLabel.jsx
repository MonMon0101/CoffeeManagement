import { Feather } from "@expo/vector-icons";
import React from "react";
import { Animated, Text, TextInput, TouchableOpacity, View } from "react-native";
import HelperText from "../HelperText";

const InputLabel = ({
  label,
  margin,
  error,
  helperText,
  isSecure,
  uppercaseLabel,
  fontBoldLabel,
  style,
  ...props
}) => {
  const [show, setShow] = React.useState(false);

  const iconRight = React.useMemo(
    () => () => {
      if (isSecure) {
        return (
          <Animated.View className="absolute top-[60%] right-4">
            <TouchableOpacity activeOpacity={0.5} onPress={() => setShow((prev) => !prev)}>
              <Feather name={show ? "eye-off" : "eye"} size={24} color={error ? "red" : "gray"} />
            </TouchableOpacity>
          </Animated.View>
        );
      }

      return null;
    },
    [isSecure, show, error]
  );

  return (
    <View style={{ marginBottom: margin ?? 5 }}>
      <Text className="font-bold">{label}</Text>

      <Animated.View
        className={`bg-black/5 p-4 rounded-2xl w-full mt-1 relative ${
          error ? "border border-red-500" : ""
        }`}
      >
        <TextInput
          autoComplete="off"
          {...props}
          secureTextEntry={isSecure ? (show ? false : true) : false}
        />

        {iconRight()}
      </Animated.View>

      {helperText && (
        <View>
          <HelperText
            type={helperText && error ? "error" : "info"}
            visible={(helperText ? true : false) || error}
            text={helperText}
          />
        </View>
      )}
    </View>
  );
};

export default InputLabel;
