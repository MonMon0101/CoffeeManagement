import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import useAppBar from "~/hooks/useAppBar";
import { getAllStatistic } from "~/models/statistic";
import { themeColors } from "~/theme";
import { formatPrice } from "~/utils/number";

const DashboardScreen = () => {
    useAppBar({ title: "Tổng quan" });
    const [loading, setLoading] = useState(false);
    const [statistic, setStatistic] = useState({
        totalPrice: 0,
        totalStaff: 0,
        totalTable: 0,
        totalProduct: 0,
        totalCategory: 0,
        totalPriceCurrentDate: 0,
    });

    const fetchStatistic = useCallback(async () => {
        try {
            setLoading(true);
            const statistic = await getAllStatistic();

            console.log("====================================");
            console.log("statistic", statistic);
            console.log("====================================");
            setStatistic(statistic);
        } catch (error) {
            console.log("====================================");
            console.log("error fetchStatistic", error);
            console.log("====================================");
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchStatistic();
        }, [])
    );

    return (
        <View className="flex-1 bg-white p-3">
            {loading ? (
                <ActivityIndicator />
            ) : (
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View
                        className="items-center justify-center rounded-lg h-[200px] mb-2"
                        style={{ backgroundColor: themeColors.bgColor(0.8) }}
                    >
                        <AntDesign name="barschart" size={40} color={"green"} />
                        <Text className="text-black text-2xl mt-2">Tổng doanh thu</Text>
                        <Text className="text-black text-2xl mt-2">
                            {formatPrice(statistic.totalPrice)}
                        </Text>
                    </View>

                    <View
                        className="bg-gray-400 items-center justify-center rounded-lg h-[200px] mb-2"
                        style={{ backgroundColor: themeColors.bgColor(0.8) }}
                    >
                        <AntDesign name="barschart" size={40} color={"green"} />
                        <Text className="text-black text-2xl mt-2">Doanh thu hôm nay</Text>
                        <Text className="text-black text-2xl mt-2">
                            {formatPrice(statistic.totalPriceCurrentDate)}
                        </Text>
                    </View>

                    <View className="bg-blue-400/30 items-center justify-center rounded-lg h-[200px] mb-2">
                        <AntDesign name="user" size={40} color="blue" />
                        <Text className="text-black text-2xl mt-2">Số lượng nhân viên</Text>
                        <Text className="text-black text-2xl mt-2">{statistic.totalStaff}</Text>
                    </View>

                    <View className="bg-slate-600 items-center justify-center rounded-lg h-[200px] mb-2">
                        <MaterialIcons name="table-bar" size={40} color={"white"} />
                        <Text className="text-white text-2xl mt-2">Số lượng bàn</Text>
                        <Text className="text-white text-2xl mt-2">{statistic.totalTable}</Text>
                    </View>

                    <View className="bg-orange-200 items-center justify-center rounded-lg h-[200px] mb-2">
                        <AntDesign name="user" size={40} color="black" />
                        <Text className="text-black text-2xl mt-2">Số lượng danh mục</Text>
                        <Text className="text-black text-2xl mt-2">{statistic.totalCategory}</Text>
                    </View>

                    <View className="bg-gray-400 items-center justify-center rounded-lg h-[200px] mb-2">
                        <AntDesign name="user" size={40} color="black" />
                        <Text className="text-black text-2xl mt-2">Số lượng sản phẩm</Text>
                        <Text className="text-black text-2xl mt-2">{statistic.totalProduct}</Text>
                    </View>
                </ScrollView>
            )}
        </View>
    );
};

export default DashboardScreen;

const styles = StyleSheet.create({});
