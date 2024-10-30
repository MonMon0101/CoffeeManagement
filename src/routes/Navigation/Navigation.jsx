import { NavigationContainer } from "@react-navigation/native";
import ROLES from "~/constants/role.constant";
import { useAuth } from "~/stores/slices/authSlice";
import AdminStack from "../AdminStack";
import AuthStack from "../AuthStack";
import { navigationRef } from "../config/navigation";
import StaffStack from "../StaffStack";

const Navigation = () => {
    const { user } = useAuth();

    return (
        <NavigationContainer independent={true} ref={navigationRef}>
            {!user ? <AuthStack /> : user.role === ROLES.ADMIN ? <AdminStack /> : <StaffStack />}
        </NavigationContainer>
    );
};

export default Navigation;
