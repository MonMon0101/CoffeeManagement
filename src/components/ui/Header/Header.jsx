import { AntDesign, Feather, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import PATHS from "~/constants/path.constant";
import { goBack, navigate } from "~/routes/config/navigation";
import { themeColors } from "~/theme";

const Header = ({ name, isBack = false, isShowGoBackHome = false, pathHome = PATHS.HOME }) => {
    const navigation = useNavigation();

    return (
        <View style={{ backgroundColor: "white" }}>
            <View style={styles.wrapHeader}>
                <View style={styles.wrapHeaderLeft}>
                    {isBack ? (
                        <TouchableOpacity onPress={goBack} activeOpacity={0.75} style={styles.back}>
                            <AntDesign name="back" size={20} color="black" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={() => navigation.openDrawer()}
                            activeOpacity={0.75}
                            style={styles.back}
                        >
                            <FontAwesome name="bars" size={20} color="black" />
                        </TouchableOpacity>
                    )}

                    <Text style={styles.textHeader}>{name}</Text>
                </View>

                <View className="flex-row gap-2 items-center">
                    {isShowGoBackHome ? (
                        <TouchableOpacity
                            onPress={() => navigate(pathHome)}
                            activeOpacity={0.75}
                            style={styles.back}
                        >
                            <Feather name="home" size={20} color="black" />
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    display: {
        position: "absolute",
        bottom: 5,
        left: 0,
        right: 0,
        justifyContent: "center",
        alignItems: "center",
    },
    back: {
        width: 30,
        height: 30,
        backgroundColor: "white",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    wrapHeaderLeft: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    wrapHeader: {
        position: "relative",
        flexDirection: "row",
        alignItems: "center",
        padding: 14,
        backgroundColor: themeColors.bgColor(1),
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        height: 120,
        shadowColor: themeColors.bgColor(1),
        elevation: 25,
        justifyContent: "space-between",
    },
    textHeader: {
        fontWeight: "bold",
        fontSize: 15,
        color: "white",
        flex: 1,
        flexWrap: "wrap",
        maxWidth: 230,
    },
});
