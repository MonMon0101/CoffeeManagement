import moment from "moment";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import STATUS, { labelBuyOption } from "~/constants/status.constant";
import { formatPrice } from "~/utils/number";

const BillItem = ({ item, onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className={`my-2 p-2 rounded-lg shadow-lg ${
                item.status === STATUS.COMPLETE ? "bg-green-100" : "bg-red-100"
            }`}
            style={{ elevation: 10 }}
        >
            <View className="flex-row justify-between">
                <Text className="text-base font-semibold underline">{item.table?.name}</Text>
                <Text className="text-base font-semibold">{`NV order: ${item?.staffOrder?.displayName}`}</Text>
            </View>

            <View className="flex-row justify-between my-2">
                <Text className="text-base font-semibold">{`Ngày: ${moment(
                    item?.createdAt,
                    "YYYY-MM-DD"
                ).format("DD/MM/YYYY")}`}</Text>
                <Text className="text-base font-semibold">{`Thời gian order: ${item.orderTime}`}</Text>
            </View>

            <View className="flex-row justify-between">
                <View className="flex-row gap-2">
                    <Text className="text-base font-semibold">SL order</Text>

                    <Text className="text-base font-semibold text-red-500">
                        {item.products?.reduce(
                            (previousValue, currentValue) => previousValue + currentValue.quantity,
                            0
                        )}
                    </Text>
                </View>

                <Text className="text-base font-semibold text-red-500">{`Tổng tiền: ${formatPrice(
                    item.products?.reduce(
                        (previousValue, currentValue) =>
                            previousValue + currentValue.quantity * currentValue.price,
                        0
                    )
                )}`}</Text>
            </View>

            <View className="flex-row justify-between mt-2">
                <View className="flex-row gap-2">
                    <Text className="text-base font-semibold">Trạng thái</Text>

                    <Text
                        className={`text-base font-semibold ${
                            item.status === STATUS.PROCESSING ? "text-red-500" : "text-green-500"
                        }`}
                    >
                        {item.status === STATUS.PROCESSING ? "Đang hoạt động" : "Đã kết thúc"}
                    </Text>
                </View>

                <Text className="text-base font-semibold text-red-500">{`Hình thức: ${labelBuyOption(
                    item.buyOption
                )}`}</Text>
            </View>

            {item.paymentByStaffId ? (
                <View className="flex-row justify-between mt-2">
                    <View className="flex-row gap-2">
                        <Text className="text-base font-semibold">NV Thanh toán</Text>

                        <Text
                            className={`text-base font-semibold ${
                                item.status === STATUS.PROCESSING
                                    ? "text-red-500"
                                    : "text-green-500"
                            }`}
                        >
                            {item?.paymentByStaff?.displayName}
                        </Text>
                    </View>
                </View>
            ) : null}

            {item.paymentTime ? (
                <View className="flex-row justify-between mt-2">
                    <View className="flex-row gap-2">
                        <Text className="text-base font-semibold">Thời gian thanh toán</Text>

                        <Text
                            className={`text-base font-semibold ${
                                item.status === STATUS.PROCESSING
                                    ? "text-red-500"
                                    : "text-green-500"
                            }`}
                        >
                            {item?.paymentTime}
                        </Text>
                    </View>
                </View>
            ) : null}
        </TouchableOpacity>
    );
};

export default BillItem;

const styles = StyleSheet.create({});
