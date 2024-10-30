import { Image } from "expo-image";
import { useCallback, useState } from "react";
import { KeyboardAvoidingView, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { getUserByUsername } from "~/models/user";
import { themeColors } from "~/theme";
import LoginForm from "./components/LoginForm";
import Toast from "react-native-toast-message";
import { comparePassword } from "~/utils/password";
import { authActions } from "~/stores/slices/authSlice";

export default function LoginScreen() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const handleSubmit = useCallback(async (values) => {
        try {
            setLoading(true);
            const user = await getUserByUsername(values.username);

            if (!user) {
                Toast.show({
                    type: "error",
                    text1: "Lỗi",
                    text2: "Tài khoản không tồn tại",
                    text2Style: { fontSize: 14 },
                });
                return;
            }

            if (!comparePassword(user.password, values.password)) {
                Toast.show({
                    type: "error",
                    text1: "Lỗi",
                    text2: "Mật khẩu không chính xác",
                    text2Style: { fontSize: 14 },
                });
                return;
            }

            dispatch(authActions.setUser(user));

            Toast.show({
                type: "success",
                text1: "Thành công",
                text2: "Đăng nhập thành công",
                text2Style: { fontSize: 14 },
            });
        } catch (error) {
            console.log("====================================");
            console.log(`error login`, error);
            console.log("====================================");

            Toast.show({
                type: "error",
                text1: "Lỗi",
                text2: error?.message,
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

                        <LoginForm
                            loading={loading}
                            initialValues={{ username: "", password: "" }}
                            onSubmit={handleSubmit}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
