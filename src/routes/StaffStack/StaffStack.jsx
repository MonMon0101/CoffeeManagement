import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PATHS from "~/constants/path.constant";
import OrderTableScreen from "~/screens/Staff/OrderTableScreen";
import OrderDetails from "~/screens/Staff/OrderTableScreen/OrderDetails";
import DrawerStaff from "./DrawerStaff";
import { TransitionPresets } from "@react-navigation/stack";
import BillDetailsScreen from "~/screens/Staff/BillScreen/BillDetailsScreen";

const Stack = createNativeStackNavigator();

export default function StaffStack() {
    return (
        <Stack.Navigator
            initialRouteName={PATHS.STAFF}
            screenOptions={{
                ...TransitionPresets.ModalTransition,
                safeAreaInsets: { top: 0, bottom: 0, left: 0, right: 0 },
                headerShown: false,
                statusBarHidden: false,
                statusBarTranslucent: true,
                statusBarAnimation: "fade",
                statusBarStyle: "auto",
                statusBarColor: "transparent",
                cardStyle: {
                    backgroundColor: "transparent",
                    overflow: "visible",
                },
                headerMode: "screen",
            }}
        >
            <Stack.Screen name={PATHS.STAFF} component={DrawerStaff} />
            <Stack.Screen
                options={{ presentation: "modal", animation: "fade" }}
                name={PATHS.ORDER_TABLE}
                component={OrderTableScreen}
            />
            <Stack.Screen
                options={{ presentation: "modal", animation: "fade" }}
                name={PATHS.ORDER_DETAILS}
                component={OrderDetails}
            />
            <Stack.Screen
                options={{ presentation: "modal", animation: "fade" }}
                name={PATHS.BILL_DETAILS}
                component={BillDetailsScreen}
            />
        </Stack.Navigator>
    );
}
