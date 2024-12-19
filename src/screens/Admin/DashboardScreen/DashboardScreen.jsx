import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import DateTimePicker from "@react-native-community/datetimepicker";
import MonthPicker from 'react-native-month-year-picker';
import moment from "moment";
import useAppBar from "~/hooks/useAppBar";
import { getAllStatistic, getAllStatisticWithCondition } from "~/models/statistic";
import { themeColors } from "~/theme";
import { formatPrice } from "~/utils/number";

const DashboardScreen = () => {
    useAppBar({ title: "Tổng quan" });
    const [loading, setLoading] = useState(false);
    const [current, setCurrent] = useState("day");
    // dung cho day
    const [open, setOpen] = useState(false);
    const [day, setDay] = useState(new Date());
    // dung cho month
    const [date, setDate] = useState(new Date());
    const [showMonth, setShowMonth] = useState(false);

    const [statistic, setStatistic] = useState({
        totalPrice: 0,
        totalStaff: 0,
        totalTable: 0,
        totalProduct: 0,
        totalCategory: 0,
        totalPriceCurrentDate: 0,
    });

    const fetchStatistic = useCallback(async (fromDate, toDate) => {
        try 
        {
            setLoading(true);
            //const statistic = await getAllStatistic();
            const statistic = await getAllStatisticWithCondition(fromDate, toDate);

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

    const getFromToDate = (date) => {
        fetchStatistic(moment(date).startOf('month').format('YYYY-MM-DD'), moment(date).endOf('month').format('YYYY-MM-DD'));
    };

    const getCurrentDate = (value) => {
        fetchStatistic(moment(value).format("YYYY-MM-DD"), moment(value).format("YYYY-MM-DD"));
    }

    useFocusEffect(
        useCallback(() => {
            const fromDate = moment(new Date()).format("YYYY-MM-DD");
            const toDate = moment(new Date()).format("YYYY-MM-DD");
            fetchStatistic(fromDate, toDate);
        }, [])
    );

    return (
        <View className="flex-1 bg-white p-3">
            <View style={styles.conditionContainer}>
                <RadioButtonGroup
                    containerStyle={{ marginBottom: 10, flexDirection: 'row' }}
                    selected={current}
                    onSelected={(value) => setCurrent(value)}
                    containerOptionStyle={{margin:5}}
                    radioBackground="green"
                >
                    <RadioButtonItem value="month" label="Tháng" />
                    <RadioButtonItem value="day" label="Ngày"  />
                </RadioButtonGroup>
            </View>
            <View style={styles.dateContainer}>
                {current === 'day' ? 
                    <View>
                        <TouchableOpacity
                            onPress={() => setOpen(true)}
                            className="flex-row items-center justify-center mb-2 py-3 px-2 border rounded-lg border-gray-400"
                        >
                            <MaterialIcons name="date-range" size={24} color="black" />
                            <Text className="text-black font-bold ml-2">
                                {moment(day).format("DD/MM/YYYY")}
                            </Text>
                        </TouchableOpacity>
                        {open && (
                                <DateTimePicker
                                    mode="date"
                                    value={day}
                                    onChange={(event, date) => {
                                        // console.log("====================================");
                                        // console.log(`date change`, date);
                                        // console.log("====================================");
                                        setOpen(false);
                                        getCurrentDate(date);
                                        setDay(date);
                                    }}
                                    // onCancel={() => setOpen(false)}
                                />
                            )}
                    </View>
                    :
                    <View>
                        <TouchableOpacity
                            onPress={() => setShowMonth(true)}
                            className="flex-row items-center justify-center mb-2 py-3 px-2 border rounded-lg border-gray-400"
                        >
                            <MaterialIcons name="date-range" size={24} color="black" />
                            <Text className="text-black font-bold ml-2">
                                {moment(date).format("MM-YYYY")}
                            </Text>
                        </TouchableOpacity>
                        {showMonth && (
                                <MonthPicker
                                    onChange={(event, date) => {
                                        //console.log(date);
                                        setShowMonth(false);
                                        setDate(date);
                                        getFromToDate(date);
                                    }}
                                    value={date}
                                    minimumDate={new Date(2022, 1)}
                                    maximumDate={new Date(2025, 5)}
                                    locale="vi"
                                />
                            )}
                    </View>
                }
            </View>

            {loading ? (
                <ActivityIndicator />
            ) : (
                <ScrollView showsVerticalScrollIndicator={false}>
                    {current == 'month' && (
                        <View
                            className="items-center justify-center rounded-lg h-[200px] mb-2"
                            style={{ backgroundColor: themeColors.bgColor(0.8) }}
                        >
                            <AntDesign name="barschart" size={40} color={"green"} />
                            <Text className="text-black text-2xl mt-2">Doanh thu theo tháng</Text>
                            <Text className="text-black text-2xl mt-2">
                                {formatPrice(statistic.totalPrice)}
                            </Text>
                        </View>
                    )}

                    {current == 'day' && (
                        <View
                            className="bg-gray-400 items-center justify-center rounded-lg h-[200px] mb-2"
                            style={{ backgroundColor: themeColors.bgColor(0.8) }}>
                            <AntDesign name="barschart" size={40} color={"green"} />
                            <Text className="text-black text-2xl mt-2">Doanh thu theo ngày</Text>
                            <Text className="text-black text-2xl mt-2">
                                {formatPrice(statistic.totalPriceCurrentDate)}
                            </Text>
                        </View>
                    )}

                    <View className="bg-blue-200 items-center justify-center rounded-lg h-[200px] mb-2">
                        <AntDesign name="user" size={40} color="black" />
                        <Text className="text-black text-2xl mt-2">Số lượng nhân viên</Text>
                        <Text className="text-black text-2xl mt-2">{statistic.totalStaff}</Text>
                    </View>

                    <View className="bg-orange-200 items-center justify-center rounded-lg h-[200px] mb-2">
                        <MaterialIcons name="table-bar" size={40} color={"black"} />
                        <Text className="text-black text-2xl mt-2">Số lượng bàn</Text>
                        <Text className="text-black text-2xl mt-2">{statistic.totalTable}</Text>
                    </View>

                    <View className="bg-indigo-200 items-center justify-center rounded-lg h-[200px] mb-2">
                        <AntDesign name="user" size={40} color="black" />
                        <Text className="text-black text-2xl mt-2">Số lượng danh mục</Text>
                        <Text className="text-black text-2xl mt-2">{statistic.totalCategory}</Text>
                    </View>

                    <View className="bg-slate-500 items-center justify-center rounded-lg h-[200px] mb-2">
                        <AntDesign name="user" size={40} color="white" />
                        <Text className="text-white text-2xl mt-2">Số lượng sản phẩm</Text>
                        <Text className="text-white text-2xl mt-2">{statistic.totalProduct}</Text>
                    </View>
                </ScrollView>
            )}
        </View>
    );
};

export default DashboardScreen;

const styles = StyleSheet.create({
    conditionContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    dateContainer: {
        marginBottom: 10,
    }
});
