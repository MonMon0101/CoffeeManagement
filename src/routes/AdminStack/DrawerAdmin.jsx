import { MaterialIcons } from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawer from "~/components/shared/CustomDrawer";
import PATHS from "~/constants/path.constant";
import CategoryManageScreen from "~/screens/Admin/CategoryManageScreen";
import DashboardScreen from "~/screens/Admin/DashboardScreen";
import ProductManageScreen from "~/screens/Admin/ProductManageScreen";
import StaffManageScreen from "~/screens/Admin/StaffManageScreen";
import TableManageScreen from "~/screens/Admin/TableManageScreen";
import BillScreen from "~/screens/Staff/BillScreen";
import { themeColors } from "~/theme";

const Drawer = createDrawerNavigator();

export default function DrawerAdmin() {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawer {...props} />}
            initialRouteName={PATHS.DASHBOARD}
            screenOptions={{
                headerShown: false,
                drawerLabelStyle: { marginLeft: -20 },
                drawerActiveBackgroundColor: themeColors.bgColor(1),
                drawerActiveTintColor: "white",
                drawerInactiveTintColor: "#333",
            }}
        >
            <Drawer.Screen
                name={PATHS.DASHBOARD}
                component={DashboardScreen}
                options={{
                    title: "Tổng quan",
                    presentation: "modal",
                    animation: "fade",
                    drawerIcon: ({ color }) => (
                        <MaterialIcons name="dashboard" size={24} color={color} />
                    ),
                }}
            />

            <Drawer.Screen
                name={PATHS.CATEGORY_MANAGE}
                component={CategoryManageScreen}
                options={{
                    title: "Quản lý danh mục",
                    presentation: "modal",
                    animation: "fade",
                    drawerIcon: ({ color }) => (
                        <MaterialIcons name="category" size={24} color={color} />
                    ),
                }}
            />

            <Drawer.Screen
                name={PATHS.PRODUCT_MANAGE}
                component={ProductManageScreen}
                options={{
                    title: "Quản lý sản phẩm",
                    presentation: "modal",
                    animation: "fade",
                    drawerIcon: ({ color }) => (
                        <MaterialIcons name="fastfood" size={24} color={color} />
                    ),
                }}
            />

            <Drawer.Screen
                name={PATHS.TABLE_MANAGE}
                component={TableManageScreen}
                options={{
                    title: "Quản lý bàn",
                    presentation: "modal",
                    animation: "fade",
                    drawerIcon: ({ color }) => (
                        <MaterialIcons name="table-bar" size={24} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name={PATHS.STAFF_MANAGE}
                component={StaffManageScreen}
                options={{
                    title: "Quản lý nhân viên",
                    presentation: "modal",
                    animation: "fade",
                    drawerIcon: ({ color }) => (
                        <MaterialIcons name="people" size={24} color={color} />
                    ),
                }}
            />

            <Drawer.Screen
                name={PATHS.BILL}
                component={BillScreen}
                options={{
                    title: "Quản lý hóa đơn",
                    presentation: "modal",
                    animation: "fade",
                    drawerIcon: ({ color }) => (
                        <MaterialIcons name="receipt" size={24} color={color} />
                    ),
                }}
            />
        </Drawer.Navigator>
    );
}
