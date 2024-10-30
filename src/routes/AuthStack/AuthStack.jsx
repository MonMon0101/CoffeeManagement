import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import PATHS from "~/constants/path.constant";
import LoginScreen from "~/screens/Auth/LoginScreen";
import RegisterScreen from "~/screens/Auth/RegisterScreen";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName={PATHS.LOGIN}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name={PATHS.LOGIN}
        component={LoginScreen}
        options={{ presentation: "modal", animation: "slide_from_left" }}
      />
      <Stack.Screen
        name={PATHS.REGISTER}
        component={RegisterScreen}
        options={{ presentation: "modal", animation: "slide_from_right" }}
      />
    </Stack.Navigator>
  );
}
