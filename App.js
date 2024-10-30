import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Navigation from "~/routes/Navigation";
import store, { persistor } from "~/stores";

// LogBox.ignoreLogs([`Setting a timer for a long period`]);
// LogBox.ignoreLogs([
//     'Key "cancelled" in the image picker result is deprecated and will be removed in SDK 51, use "canceled" instead',
// ]);

export default function App() {
    // useEffect(() => {
    //     if (Platform.OS !== "web") {
    //         (async () => {
    //             const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    //             if (status !== "granted") {
    //                 alert("Sorry, we need camera roll permissions to make this work!");
    //             }
    //         })();
    //     }
    // }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Provider store={store}>
                <PersistGate persistor={persistor} loading={null}>
                    <Navigation />
                    <Toast />
                </PersistGate>
            </Provider>
        </GestureHandlerRootView>
    );
}
