import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect } from "@react-navigation/native";
import moment from "moment";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import BillItem from "~/components/shared/BillItem";
import PATHS from "~/constants/path.constant";
import useAppBar from "~/hooks/useAppBar";
import { getAllOrder } from "~/models/order";
import { navigate } from "~/routes/config/navigation";

const BillScreen = () => {
    useAppBar({ title: `Hóa đơn` });
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(new Date());

    const fetchOrder = useCallback(async () => {
        try {
            setLoading(true);
            const order = await getAllOrder(moment(new Date(date)).format("YYYY-MM-DD").toString());
            setOrders(order);
        } catch (error) {
            console.log("====================================");
            console.log(`error fetchOrder`, error);
            console.log("====================================");
        } finally {
            setLoading(false);
        }
    }, [date]);

    useFocusEffect(
        useCallback(() => {
            fetchOrder();
        }, [date])
    );

    const renderItem = useCallback(({ item, index }) => {
        return (
            <BillItem item={item} onPress={() => navigate(PATHS.BILL_DETAILS, { id: item.id })} />
        );
    }, []);

    const keyExtract = useCallback((item, index) => `${index}${item.id}`, []);

    const ListHeaderComponent = () => {
        return (
            <View>
                {loading ? (
                    <View className="mb-2">
                        <ActivityIndicator />
                    </View>
                ) : null}

                {orders && (
                    <>
                        <TouchableOpacity
                            onPress={() => setOpen(true)}
                            className="flex-row items-center justify-center mb-2 py-3 px-2 border rounded-lg border-gray-400"
                        >
                            <MaterialIcons name="date-range" size={24} color="black" />
                            <Text className="text-black font-bold ml-2">
                                {moment(date).format("DD/MM/YYYY")}
                            </Text>
                        </TouchableOpacity>

                        {open && (
                            <DateTimePicker
                                mode="date"
                                value={date}
                                onChange={(event, date) => {
                                    console.log("====================================");
                                    console.log(`date change`, date);
                                    console.log("====================================");
                                    setOpen(false);
                                    setDate(date);
                                }}
                                // onCancel={() => setOpen(false)}
                            />
                        )}
                    </>
                )}

                {!loading && !orders.length ? (
                    <View>
                        <Text className="text-center text-red-500">Không có hóa đơn nào</Text>
                    </View>
                ) : null}
            </View>
        );
    };

    const handleRefreshing = async () => {
        await fetchOrder();
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
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                refreshing={false}
                onRefresh={handleRefreshing}
                contentContainerStyle={{ padding: 15 }}
                data={orders}
                renderItem={renderItem}
                keyExtractor={keyExtract}
                ListHeaderComponent={ListHeaderComponent}
                ListFooterComponent={<View className="h-32" />}
            />
        </View>
    );
};

export default BillScreen;

const styles = StyleSheet.create({});
