import { MaterialIcons } from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawer from "~/components/shared/CustomDrawer";
import PATHS from "~/constants/path.constant";
import BillScreen from "~/screens/Staff/BillScreen";
import HomeScreen from "~/screens/Staff/HomeScreen";
import { themeColors } from "~/theme";

const Drawer = createDrawerNavigator();

export default function DrawerStaff() {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawer {...props} />}
            initialRouteName={PATHS.HOME}
            screenOptions={{
                headerShown: false,
                drawerLabelStyle: { marginLeft: -20 },
                drawerActiveBackgroundColor: themeColors.bgColor(1),
                drawerActiveTintColor: "white",
                drawerInactiveTintColor: "#333",
            }}
        >
            <Drawer.Screen
                name={PATHS.HOME}
                component={HomeScreen}
                options={{
                    title: "Trang chủ",
                    animation: "fade",
                    drawerIcon: ({ color }) => (
                        <MaterialIcons name="category" size={24} color={color} />
                    ),
                }}
            />

            <Drawer.Screen
                name={PATHS.BILL}
                component={BillScreen}
                options={{
                    title: "Hóa đơn",
                    animation: "fade",
                    drawerIcon: ({ color }) => (
                        <MaterialIcons name="receipt" size={24} color={color} />
                    ),
                }}
            />
        </Drawer.Navigator>
    );
}
