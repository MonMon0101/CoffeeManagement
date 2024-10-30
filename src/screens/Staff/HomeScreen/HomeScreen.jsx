import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import useAppBar from "~/hooks/useAppBar";
import { getAllTables } from "~/models/table";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { themeColors } from "~/theme";
import PATHS from "~/constants/path.constant";
import { navigate } from "~/routes/config/navigation";
import { formatPrice } from "~/utils/number";

const HomeScreen = () => {
    useAppBar({ title: "Danh sách bàn" });
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(false);

    const getData = async () => {
        try {
            setLoading(true);

            const data = await getAllTables(true);

            setTables(data);
        } catch (error) {
            console.log("====================================");
            console.log(`error get data tables `, error);
            console.log("====================================");
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            getData();
        }, [])
    );

    const renderItem = useCallback(({ item, index }) => {
        return (
            <TouchableOpacity
                className={`rounded-lg shadow-2xl flex-grow aspect-square p-2 flex-1 m-2 justify-center items-center`}
                style={{
                    backgroundColor: !item?.lastOrder
                        ? themeColors.bgColor(0.2)
                        : themeColors.bgColor(0.8),
                }}
                onPress={() => {
                    navigate(PATHS.ORDER_TABLE, { id: item.id, name: item.name });
                }}
            >
                <MaterialIcons name="table-bar" size={40} color="black" />
                <Text className="text-lg font-semibold">{item.name}</Text>
                <Text
                    className={`text-lg font-semibold ${
                        !item?.lastOrder ? "text-red-500" : "text-white"
                    }`}
                >
                    {!item?.lastOrder ? "Có sẵn" : "Đang hoạt động"}
                </Text>

                {item?.lastOrder && (
                    <View className="flex-col items-center">
                        <Text>{`SL: ${item?.lastOrder?.products?.reduce(
                            (a, b) => a + b.quantity,
                            0
                        )}`}</Text>
                        <Text>{`Tổng tiền: ${formatPrice(
                            item?.lastOrder?.products?.reduce((a, b) => a + b.quantity * b.price, 0)
                        )}`}</Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    }, []);

    const keyExtract = useCallback((item, index) => `${index}`, []);

    const ListHeaderComponent = useMemo(
        () => () => {
            return (
                <View>
                    {loading ? (
                        <View className="mb-2">
                            <ActivityIndicator />
                        </View>
                    ) : null}

                    {!loading && !tables.length ? (
                        <View>
                            <Text className="text-center text-red-500">Chưa có bàn</Text>
                        </View>
                    ) : null}
                </View>
            );
        },
        [loading, tables]
    );

    const handleRefreshing = async () => {
        await getData();
    };

    return (
        <View className="flex-1 bg-white">
            <FlatList
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={handleRefreshing}
                        tintColor="#F8852D"
                    />
                }
                contentInsetAdjustmentBehavior="automatic"
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                refreshing={false}
                onRefresh={handleRefreshing}
                contentContainerStyle={{ padding: 15 }}
                data={tables}
                renderItem={renderItem}
                keyExtractor={keyExtract}
                numColumns={2}
                key={2}
                ListHeaderComponent={ListHeaderComponent}
            />
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({});
