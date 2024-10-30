import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { Image } from "expo-image";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import { authActions, useAuth } from "~/stores/slices/authSlice";
import { themeColors } from "~/theme";

export default function CustomDrawer(props) {
    const dispatch = useDispatch();
    const { user } = useAuth();

    const handleLogout = () => {
        Alert.alert(
            "Xác nhận",
            "Bạn có chắc muốn xóa đăng xuất không?", // <- this part is optional, you can pass an empty string
            [
                { text: "Hủy", onPress: () => console.log("Cancel Pressed"), style: "cancel" },
                {
                    text: "OK",
                    onPress: () => {
                        dispatch(authActions.setUser(null));
                        Toast.show({
                            type: "success",
                            text1: "Thành công",
                            text2: "Đăng xuất thành công",
                            text2Style: { fontSize: 14 },
                        });
                    },
                },
            ],
            { cancelable: false }
        );
    };

    return (
        <View className="flex-1">
            <DrawerContentScrollView
                {...props}
                contentContainerStyle={{ backgroundColor: themeColors.bgColor(1) }}
            >
                <View className="p-3 items-center">
                    <Image
                        source={require("~/assets/images/avatar.png")}
                        className="h-20 w-20 rounded-full"
                    />

                    <Text className="font-bold text-white text-lg">{user?.displayName}</Text>
                    <Text className="font-bold text-white text-lg">{user?.username}</Text>
                </View>

                <View className="bg-white pt-3 flex-1">
                    <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>

            <View className="p-2">
                <TouchableOpacity
                    onPress={handleLogout}
                    className="w-full rounded-md mb-4 p-3"
                    style={{ backgroundColor: themeColors.bgColor(1) }}
                >
                    <Text className="text-center text-white font-semibold text-lg">Đăng xuất</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
