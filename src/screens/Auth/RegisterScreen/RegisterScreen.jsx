import { Image } from "expo-image";
import React, { useCallback, useState } from "react";
import { KeyboardAvoidingView, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { themeColors } from "~/theme";
import RegisterForm from "./components/RegisterForm";
import Toast from "react-native-toast-message";
import { goBack } from "~/routes/config/navigation";
import { addUser, getIsAdmin, getUserByUsername } from "~/models/user";
import { hashPassword } from "~/utils/password";
import ROLES from "~/constants/role.constant";

export default function RegisterScreen() {
    const [loading, setLoading] = useState(false);

    const handleRegister = useCallback(async (values) => {
        try {
            setLoading(true);

            // Check exists role admin
            const [isExistsRoleAdmin, usernameExist] = await Promise.all([
                getIsAdmin(),
                getUserByUsername(values.username),
            ]);

            if (usernameExist) {
                Toast.show({
                    type: "error",
                    text1: "Lỗi",
                    text2: "Tài khoản đã tồn tại",
                    text2Style: { fontSize: 14 },
                });
                return;
            }

            let data = { ...values, password: hashPassword(values.password) };

            let message = "Bạn đã đăng ký thành công";

            if (!isExistsRoleAdmin) {
                // create first account is admin
                data = {
                    ...data,
                    role: ROLES.ADMIN,
                };

                message = "Chúc mừng bạn đã trở thành admin";
            } else {
                data = {
                    ...data,
                    role: ROLES.STAFF,
                };
            }

            await addUser(data);

            Toast.show({
                type: "success",
                text1: "Thành công",
                text2: message,
                text2Style: { fontSize: 14 },
            });

            goBack();
        } catch (error) {
            console.log("====================================");
            console.log(`error handleRegister`, error);
            console.log("====================================");
            Toast.show({
                type: "error",
                text1: "Lỗi",
                text2: error.message,
                text2Style: { fontSize: 14 },
            });
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView behavior="padding">
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View className="mt-20 p-4">
                        <Text
                            className="text-2xl text-center font-bold"
                            style={{ color: themeColors.text }}
                        >
                            Chào mừng bạn đến với QCoffee
                        </Text>

                        <View className="justify-center items-center my-2">
                            <Image
                                source={require("~/assets/images/auth.gif")}
                                contentFit="cover"
                                className="h-40 w-40 rounded-full"
                            />
                        </View>

                        <RegisterForm
                            loading={loading}
                            onSubmit={handleRegister}
                            initialValues={{ username: "", password: "", displayName: "" }}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
