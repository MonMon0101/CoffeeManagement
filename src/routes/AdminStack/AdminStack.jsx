import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PATHS from "~/constants/path.constant";
import AddEditCategoryScreen from "~/screens/Admin/CategoryManageScreen/AddEditCategoryScreen";
import AddEditProductScreen from "~/screens/Admin/ProductManageScreen/AddEditProductScreen";
import AddEditStaffScreen from "~/screens/Admin/StaffManageScreen/AddEditStaffScreen";
import AddEditTableScreen from "~/screens/Admin/TableManageScreen/AddEditTableScreen";
import BillDetailsScreen from "~/screens/Staff/BillScreen/BillDetailsScreen";
import DrawerAdmin from "./DrawerAdmin";

const Stack = createNativeStackNavigator();

export default function AdminStack() {
    return (
        <Stack.Navigator
            initialRouteName={PATHS.ADMIN}
            screenOptions={{
                headerShown: false,
                statusBarHidden: false,
                statusBarTranslucent: true,
                statusBarAnimation: "fade",
                statusBarStyle: "auto",
                statusBarColor: "transparent",
            }}
        >
            <Stack.Screen name={PATHS.ADMIN} component={DrawerAdmin} />

            <Stack.Screen
                name={PATHS.ADD_EDIT_CATE}
                component={AddEditCategoryScreen}
                options={{ presentation: "modal", animation: "fade" }}
            />

            <Stack.Screen
                name={PATHS.ADD_EDIT_PRODUCT}
                component={AddEditProductScreen}
                options={{ presentation: "modal", animation: "fade" }}
            />

            <Stack.Screen
                name={PATHS.ADD_EDIT_TABLE}
                component={AddEditTableScreen}
                options={{ presentation: "modal", animation: "fade" }}
            />

            <Stack.Screen
                name={PATHS.ADD_EDIT_STAFF}
                component={AddEditStaffScreen}
                options={{ presentation: "modal", animation: "fade" }}
            />

            <Stack.Screen
                name={PATHS.BILL_DETAILS}
                component={BillDetailsScreen}
                initialParams={{ isAdmin: true }}
                options={{ presentation: "modal", animation: "fade" }}
            />
        </Stack.Navigator>
    );
}
