import { useFocusEffect, useRoute } from "@react-navigation/native";
import { Image } from "expo-image";
import moment from "moment";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { BLUR_HASH } from "~/constants/image.constant";
import PATHS from "~/constants/path.constant";
import STATUS, { labelBuyOption } from "~/constants/status.constant";
import useAppBar from "~/hooks/useAppBar";
import { getOrderById } from "~/models/order";
import { formatPrice } from "~/utils/number";

const BillDetailsScreen = () => {
    const { params } = useRoute();
    useAppBar({
        title: `Chi tiết hóa đơn`,
        isShowGoBackHome: true,
        pathHome: params.isAdmin ? PATHS.BILL : PATHS.HOME,
    });
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState(null);

    const getData = async () => {
        try {
            setLoading(true);

            const data = await getOrderById(params.id);

            setOrder(data);
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
        }, [params.id])
    );

    const renderItem = useCallback(({ item, index }) => {
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
                    <Text className="text-base font-semibold">{`SL: ${item.quantity}`}</Text>

                    <Text className="text-base font-semibold">
                        {formatPrice(item.price * item.quantity)}
                    </Text>
                </View>
            </View>
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

                    {order && (
                        <>
                            <View className="mb-2 bg-gray-200 rounded-lg p-4">
                                <Text className="font-bold text-base">
                                    Nhân viên order: {order?.staffOrder?.displayName}
                                </Text>
                                <Text className="font-bold text-base">
                                    Thời gian order:{" "}
                                    {`${moment(order?.createdAt, "YYYY-MM-DD").format(
                                        "DD/MM/YYYY"
                                    )} ${order?.orderTime}`}
                                </Text>

                                <View className="my-2 h-0.5 bg-gray-300 " />

                                <Text className="font-bold text-base">
                                    Số lượng order:{" "}
                                    {order?.products?.reduce(
                                        (total, product) => total + product?.quantity,
                                        0
                                    )}
                                </Text>

                                <Text className="font-bold text-base">
                                    Tổng tiền:{" "}
                                    {formatPrice(
                                        order?.products?.reduce(
                                            (total, product) =>
                                                total + product?.quantity * product?.price,
                                            0
                                        )
                                    )}
                                </Text>

                                {order?.paymentByStaff && (
                                    <>
                                        <View className="my-2 h-0.5 bg-gray-300 " />

                                        <Text className="font-bold text-base">
                                            Nhân viên thanh toán:{" "}
                                            {order?.paymentByStaff?.displayName}
                                        </Text>

                                        <Text className="font-bold text-base">
                                            Thanh toán lúc: {order?.paymentTime}
                                        </Text>
                                    </>
                                )}

                                <View className="my-2 h-0.5 bg-gray-300 " />

                                <Text className="font-bold text-base">
                                    Hình thức mua: {labelBuyOption(order?.buyOption)}
                                </Text>

                                <Text className="font-bold text-base">
                                    Bàn: {order?.table?.name}
                                </Text>

                                <Text
                                    className={`text-base font-semibold ${
                                        order.status === STATUS.PROCESSING
                                            ? "text-red-500"
                                            : "text-green-500"
                                    }`}
                                >
                                    Trạng thái:{" "}
                                    {order.status === STATUS.PROCESSING
                                        ? "Đang hoạt động"
                                        : "Đã kết thúc"}
                                </Text>
                            </View>
                        </>
                    )}

                    {!loading && !order?.products?.length ? (
                        <View>
                            <Text className="text-center text-red-500">Chưa có thông tin</Text>
                        </View>
                    ) : null}
                </View>
            );
        },
        [loading, order]
    );

    const handleRefreshing = async () => {
        await getData();
    };

    return (
        <View className="flex-1 bg-white p-3">
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
                // contentContainerStyle={{ padding: 15 }}
                data={order?.products}
                renderItem={renderItem}
                keyExtractor={keyExtract}
                ListHeaderComponent={ListHeaderComponent}
            />
        </View>
    );
};

export default BillDetailsScreen;

const styles = StyleSheet.create({});
