import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { Image } from "expo-image";
import moment from "moment";
import { useCallback, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    TextInput,
} from "react-native";
import Toast from "react-native-toast-message";
import { BLUR_HASH } from "~/constants/image.constant";
import PATHS from "~/constants/path.constant";
import STATUS, { BuyOptions } from "~/constants/status.constant";
import useAppBar from "~/hooks/useAppBar";
import { getProductsCategories } from "~/models/category";
import { createOrder, getLastOrderByTable, updateOrder } from "~/models/order";
import { navigate } from "~/routes/config/navigation";
import { useAuth } from "~/stores/slices/authSlice";
import { themeColors } from "~/theme";
import { formatPrice } from "~/utils/number";
import QuantityInput from "./components/QuantityInput";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const OrderTableScreen = () => {
    const { params } = useRoute();
    useAppBar({ title: `Chi tiết ${params?.name}` });
    const [search, setSearch] = useState('');
    const [lastOrder, setLastOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [productsCategories, setProductsCategories] = useState([]);
    const [searchProductsCategories, setSearchProductsCategories] = useState([]);

    const { user } = useAuth();
    const snapPoints = useMemo(() => ["13%", "80%"], []);
    const bottomSheetRef = useRef(null);

    // callbacks
    const handleSheetChanges = useCallback((index) => {
        console.log("handleSheetChanges", index);
    }, []);

    const fetchProductsCategories = useCallback(async () => {
        try {
            setLoading(true);
            const categories = await getProductsCategories();
            setProductsCategories(categories);

            // sea
            setSearchProductsCategories(categories);

        } catch (error) {
            console.log("====================================");
            console.log(`error get categories`, error);
            console.log("====================================");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchLastOrder = useCallback(async () => {
        try {
            setLoading(true);
            const order = await getLastOrderByTable(params?.id);

            setLastOrder(order);
        } catch (error) {
            console.log("====================================");
            console.log(`error fetchLastOrder`, error);
            console.log("====================================");
        } finally {
            setLoading(false);
        }
    }, [params?.id]);

    const fetchAll = async () => {
        try {
            setLoading(true);
            const [categories, order] = await Promise.all([
                getProductsCategories(),
                getLastOrderByTable(params?.id),
            ]);

            setProductsCategories(categories);
            setSearchProductsCategories(categories);
            setLastOrder(order);
        } catch (error) {
            console.log("====================================");
            console.log(`error get categories`, error);
            console.log("====================================");
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchAll();
        }, [params?.id])
    );

    const searchFilterFunction = (text) => {
        // Check if searched text is not blank
        if (text) {
          
          const newData = productsCategories.map((item) => 
            ({...item, 
                products: item.products.filter((product) =>
                    product.name.toLowerCase().includes(text.toLowerCase())),
            })).filter((item) => item.products.length > 0);
        
          setSearchProductsCategories(newData);
          setSearch(text);
        } else {
        
          setSearchProductsCategories(productsCategories);
          setSearch(text);
        }
    };

    const handleAddOrder = async (item) => {
        if (lastOrder) {
            // update last order

            const prevLastOrder = { ...lastOrder };

            // find item in last order
            const index = prevLastOrder.products.findIndex((product) => product.id === item.id);

            if (index === -1) {
                prevLastOrder.products.push({ ...item, quantity: 1 });
            } else {
                prevLastOrder.products[index] = {
                    ...prevLastOrder.products[index],
                    quantity: prevLastOrder.products[index].quantity + 1,
                };
            }

            // update last order

            try {
                await updateOrder(prevLastOrder, lastOrder.id);
                Toast.show({
                    type: "success",
                    text1: "Thành công",
                    text2: "Thêm đồ uống thành công",
                    text2Style: { fontSize: 14 },
                });

                await fetchLastOrder();
            } catch (error) {
                console.log("====================================");
                console.log(`error add order`, error);
                console.log("====================================");
            }

            return;
        }

        // create new order

        const order = {
            createdAt: moment().format("YYYY-MM-DD"),
            orderTime: moment().format("HH:mm:ss"),
            paymentTime: null,
            userId: user.id,
            paymentByStaffId: null,
            tableId: params?.id,
            status: STATUS.PROCESSING,
            products: [{ ...item, quantity: 1 }],
            buyOption: BuyOptions.AT_TABLE,
        };

        try {
            await createOrder(order);
            Toast.show({
                type: "success",
                text1: "Thành công",
                text2: "Thêm đồ uống thành công",
                text2Style: { fontSize: 14 },
            });

            await fetchLastOrder();
        } catch (error) {
            console.log("====================================");
            console.log(`error add order`, error);
            console.log("====================================");
        }
    };

    const renderItem = useCallback(
        ({ item }) => {
            return (
                <View>
                    <Text
                        className="text-lg font-semibold border-b border-gray-200 italic uppercase"
                        style={{ color: themeColors.text }}
                    >
                        {item.name}
                    </Text>

                    

                    <FlatList
                        data={item.products}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => handleAddOrder(item)}
                                key={item.id}
                                style={styles.item}
                            >
                                <Image
                                    source={{ uri: item?.image }}
                                    className="h-32 w-32 rounded-tl-lg rounded-bl-lg object-cover"
                                    placeholder={BLUR_HASH}
                                    transition={500}
                                />

                                <Text className="text-base font-semibold">{item.name}</Text>

                                <Text className="text-base font-semibold">
                                    {formatPrice(item.price)}
                                </Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={keyExtract}
                        numColumns={2}
                        columnWrapperStyle={styles.row}
                        style={{ marginTop: 10, flex: 1 }}
                    />
                </View>
            );
        },
        [handleAddOrder]
    );

    const keyExtract = useCallback((item, index) => `${index}`, []);

    const spacingCom = useCallback(() => <View className="m-2" />, []);

    const ListHeaderComponent = useMemo(
        () => () => {
            return (
                <View>
                    {loading ? (
                        <View className="mb-2">
                            <ActivityIndicator />
                        </View>
                    ) : null}

                    {!loading && !productsCategories.length ? (
                        <View>
                            <Text className="text-center text-red-500">
                                Chưa có danh mục sản phẩm nào
                            </Text>
                        </View>
                    ) : null}
                </View>
            );
        },
        [loading, productsCategories]
    );

    const handleRefreshing = async () => {
        await fetchProductsCategories();
    };

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

    return (
        <View className="flex-1 bg-white">
            <View style={styles.searchContainer}>
                        <TextInput 
                            style={styles.textInput}
                            onChangeText={(text) => searchFilterFunction(text)}
                            value={search}
                            placeholder="Nhập món cần tìm..."                                                                                                              
                        />
                        <MaterialIcons name="search" size={30} color="gray" style={styles.icon} />
                    </View>
            <FlatList
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={handleRefreshing}
                        tintColor="#F8852D"
                    />
                }
                refreshing={false}
                onRefresh={handleRefreshing}
                contentContainerStyle={{ padding: 15 }}
                data={searchProductsCategories}
                renderItem={renderItem}
                keyExtractor={keyExtract}
                ItemSeparatorComponent={spacingCom}
                ListHeaderComponent={ListHeaderComponent}
                ListFooterComponent={<View className="h-32" />}
            />

            {lastOrder && (
                <BottomSheet
                    index={1}
                    ref={bottomSheetRef}
                    onChange={handleSheetChanges}
                    snapPoints={snapPoints}
                    style={styles.bottomSheet}
                    backgroundStyle={{ backgroundColor: themeColors.bgColor(1) }}
                    enableDynamicSizing={false}
                >
                    <View style={styles.bottomSheetView}>
                        <View className="w-full flex-row justify-between">
                            <View>
                                <Text className="text-base font-semibold">
                                    Đã chọn:{" "}
                                    {lastOrder?.products?.reduce((t, v) => t + v.quantity, 0)} thức
                                    uống
                                </Text>
                                <Text className="text-base font-semibold">
                                    Tổng tiền:{" "}
                                    {formatPrice(
                                        lastOrder?.products?.reduce(
                                            (t, v) => t + v.quantity * v.price,
                                            0
                                        )
                                    )}
                                </Text>
                            </View>

                            <View>
                                <TouchableOpacity
                                    onPress={() =>
                                        navigate(PATHS.ORDER_DETAILS, {
                                            orderId: lastOrder.id,
                                            ...params,
                                        })
                                    }
                                    className="p-2 rounded-full bg-white px-8"
                                >
                                    <Text className="text-base font-semibold">Chi tiết</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <BottomSheetFlatList
                            scrollEventThrottle={16}
                            data={lastOrder?.products || []}
                            keyExtractor={keyExtract}
                            showsVerticalScrollIndicator={false}
                            style={{ marginTop: 10, marginBottom: 50 }}
                            renderItem={({ item }) => (
                                <View className="flex-row justify-between items-center my-2 bg-gray-200/20 p-2 rounded-lg">
                                    <View>
                                        <Image
                                            source={{ uri: item?.image }}
                                            className="h-16 w-16 rounded-tl-lg rounded-lg object-cover"
                                            placeholder={BLUR_HASH}
                                            transition={500}
                                        />

                                        <Text className="text-base font-semibold">
                                            {formatPrice(item.price)}
                                        </Text>

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
                            )}
                        />
                    </View>
                </BottomSheet>
            )}
        </View>
    );
};

export default OrderTableScreen;

const styles = StyleSheet.create({
    row: {
        justifyContent: "space-between",
    },
    item: {
        padding: 4,
        marginHorizontal: 5,
        marginVertical: 5,
        width: "48%",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#d1d1d1",
        minHeight: 200,
        alignItems: "center",
    },
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
    },
    bottomSheetView: {
        padding: 10,
        position: "relative",
    },

    searchContainer: {
        flexDirection: 'row',
        //justifyContent: 'center',
        alignItems:'center',
        marginRight:  25
    },
    textInput: {
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 15,
        marginLeft: 25,
        //marginRight: 25,
        borderRadius: 10,
        height: 45,
        paddingLeft: 12,
        flex: 1,
        fontSize: 18
    },
    icon: {
        marginTop: 15,
        marginLeft: -32
    }
});
