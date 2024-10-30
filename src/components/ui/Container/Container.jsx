import React from "react";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Container = ({ children, style }) => {
  const styles = useStyle();

  return <SafeAreaView style={[styles.flex, styles.wrapperView, style]}>{children}</SafeAreaView>;
};

export default memo(Container);

const useStyle = () => {
  const inset = useSafeAreaInsets();

  return StyleSheet.create({
    flex: {
      flex: 1,
    },
    wrapperView: {
      paddingBottom: inset.bottom,
    },
  });
};
