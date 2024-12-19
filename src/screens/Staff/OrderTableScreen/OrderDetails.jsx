import { useFocusEffect, useRoute } from "@react-navigation/native";
import { Image } from "expo-image";
import moment from "moment";
import { useCallback, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "react-native-toast-message";
import { BLUR_HASH } from "~/constants/image.constant";
import PATHS from "~/constants/path.constant";
import STATUS, { BuyOptions, labelBuyOption } from "~/constants/status.constant";
import useAppBar from "~/hooks/useAppBar";
import { getLastOrderByTable, updateOrder } from "~/models/order";
import { navigate } from "~/routes/config/navigation";
import { themeColors } from "~/theme";
import { formatPrice } from "~/utils/number";
import ChoseBuyOption from "./components/ChoseBuyOption";
import QuantityInput from "./components/QuantityInput";
import { useAuth } from "~/stores/slices/authSlice";

//Quy add
import { getUserById } from "../../../models/user";

const OrderDetails = () => {
    const { params } = useRoute();
    const [lastOrder, setLastOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userObj, setUserObj] = useState(null);
    const { user } = useAuth();

    const fetchLastOrder = useCallback(async () => {
        try {
            setLoading(true);
            const order = await getLastOrderByTable(params?.id);
            setLastOrder(order);

            // Lay thong tin user dang nhap
            getDataUser(order.userId);

        } catch (error) {
            console.log("====================================");
            console.log(`error fetchLastOrder`, error);
            console.log("====================================");
        } finally {
            setLoading(false);
        }
    }, [params?.id]);

    const getDataUser = async (userId) => {
        try {
            const data = await getUserById(userId);
            setUserObj(data);
        } catch (error) {
            console.log("====================================");
            console.log(`error get data tables `, error);
            console.log("====================================");
        } finally {
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchLastOrder();
        }, [])
    );

    useAppBar({ title: `Chi tiết order: ${params?.name}`, isShowGoBackHome: true, staffName: `${userObj?.displayName}` });

    const handleOnDecrement = async (item) => {
        // 1. find item in last order
        const prevLastOrder = { ...lastOrder };

        // 2. update quantity
        const index = prevLastOrder.products.findIndex((product) => product.id === item.id);

        if (index === -1) {
            return;
        }

        if (prevLastOrder.products[index].quantity === 1) {
            return;
        }

        prevLastOrder.products[index] = {
            ...prevLastOrder.products[index],
            quantity: prevLastOrder.products[index].quantity - 1,
        };

        // 2. update order

        try {
            await updateOrder(prevLastOrder, lastOrder.id);
            await fetchLastOrder();
        } catch (error) {
            console.log("====================================");
            console.log(`error add order`, error);
            console.log("====================================");
        }
    };

    const handleOnIncrement = async (item) => {
        // 1. find item in last order
        const prevLastOrder = { ...lastOrder };

        // 2. update quantity
        const index = prevLastOrder.products.findIndex((product) => product.id === item.id);

        if (index === -1) {
            return;
        }

        prevLastOrder.products[index] = {
            ...prevLastOrder.products[index],
            quantity: prevLastOrder.products[index].quantity + 1,
        };

        // 2. update order

        try {
            await updateOrder(prevLastOrder, lastOrder.id);
            await fetchLastOrder();
        } catch (error) {
            console.log("====================================");
            console.log(`error add order`, error);
            console.log("====================================");
        }
    };

    const renderItem = useCallback(
        ({ item, index }) => {
            return (
                <View className="flex-row justify-between items-center my-2 bg-gray-300/20 p-2 rounded-lg">
                    <View>
                        <Image
                            source={{ uri: item?.image }}
                            className="h-16 w-16 rounded-tl-lg rounded-lg object-cover"
                            placeholder={BLUR_HASH}
                            transition={500}
                        />

                        <Text className="text-base font-semibold">{formatPrice(item.price)}</Text>

                        <Text className="text-base font-semibold">{item.name}</Text>
                    </View>

                    <View className="flex-col items-end gap-2">
                        <QuantityInput
                            onIncrement={() => handleOnIncrement(item)}
                            onDecrement={() => handleOnDecrement(item)}
                            quantity={item.quantity}
                        />

                        <Text className="text-base font-semibold">
                            {formatPrice(item.price * item.quantity)}
                        </Text>
                    </View>
                </View>
            );
        },
        [handleOnIncrement, handleOnDecrement]
    );

    const keyExtract = useCallback((item, index) => `${index}${item.id}`, []);

    const ListHeaderComponent = useMemo(
        () => () => {
            return (
                <View>
                    {loading ? (
                        <View className="mb-2">
                            <ActivityIndicator />
                        </View>
                    ) : null}

                    {!loading && !lastOrder?.products.length ? (
                        <View>
                            <Text className="text-center text-red-500">
                                Chưa có thông tin. Vui lòng kiểm tra lại.
                            </Text>
                        </View>
                    ) : null}
                </View>
            );
        },
        [loading, lastOrder?.products]
    );

    const handleRefreshing = async () => {
        await fetchLastOrder();
    };

    const handleSubmitPayment = async () => {
        if (!lastOrder || !user.id) {
            return;
        }

        if (!lastOrder?.buyOption) {
            Toast.show({
                type: "error",
                text1: "Chọn hình thức mua",
                text2: "Vui lòng chọn hình thức mua",
                position: "bottom",
                text2Style: { fontSize: 14 },
            });
            return;
        }

        // update order
        const newOrder = {
            ...lastOrder,
            status: STATUS.COMPLETE,
            paymentTime: moment().format("HH:mm:ss"),
            paymentByStaffId: user.id,
        };

        try {
            setLoading(true);
            await updateOrder(newOrder, lastOrder.id);

            Toast.show({
                type: "success",
                text1: "Đã xuất bán",
                text2: "Đã bán thành công",
                position: "bottom",
                text2Style: { fontSize: 14 },
            });

            navigate(PATHS.HOME);
        } catch (error) {
            console.log("====================================");
            console.log(`error add order`, error);
            console.log("====================================");
        } finally {
            setLoading(false);
        }
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
                data={lastOrder?.products}
                renderItem={renderItem}
                keyExtractor={keyExtract}
                ListHeaderComponent={ListHeaderComponent}
                ListFooterComponent={<View className="h-32" />}
            />

            <View style={styles.bottomSheet}>
                <View className="w-full flex-row justify-between">
                    <View>
                        <Text className="text-base font-semibold ml-2">
                            Đã chọn: {lastOrder?.products?.reduce((t, v) => t + v.quantity, 0)} thức
                            uống
                        </Text>
                        <Text className="text-base font-semibold ml-2">
                            Tổng tiền:{" "}
                            {formatPrice(
                                lastOrder?.products?.reduce((t, v) => t + v.quantity * v.price, 0)
                            )}
                        </Text>

                        <Text className="text-base font-semibold mt-2 ml-2">Hình thức mua:</Text>

                        <View className="mt-1 ml-4">
                            {Object.keys(BuyOptions).map((key) => {
                                return (
                                    <ChoseBuyOption
                                        key={key}
                                        option={labelBuyOption(BuyOptions[key])}
                                        value={key}
                                        active={lastOrder?.buyOption === BuyOptions[key]}
                                        onChoseOption={(value) => {
                                            setLastOrder({
                                                ...lastOrder,
                                                buyOption: value,
                                            });
                                        }}
                                    />
                                );
                            })}
                        </View>
                    </View>

                    <View>
                        <TouchableOpacity
                            onPress={handleSubmitPayment}
                            className="p-2 rounded-full bg-white px-8 min-w-[150px] min-h-[40px]"
                        >
                            {loading ? (
                                <ActivityIndicator />
                            ) : (
                                <Text className="text-base font-semibold">Thanh toán</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default OrderDetails;

const styles = StyleSheet.create({
    bottomSheet: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 10,
        backgroundColor: themeColors.bgColor(1),
        padding: 10,
        minHeight: 100,
    },
    
});
