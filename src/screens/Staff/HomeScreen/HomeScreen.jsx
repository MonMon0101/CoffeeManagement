import { useFocusEffect } from "@react-navigation/native";
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
import useAppBar from "~/hooks/useAppBar";
import { getAllTables } from "~/models/table";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { themeColors } from "~/theme";
import PATHS from "~/constants/path.constant";
import { navigate } from "~/routes/config/navigation";
import { formatPrice } from "~/utils/number";

const HomeScreen = () => {
    useAppBar({ title: "Danh sách bàn" });
    const [search, setSearch] = useState('');
    const [tables, setTables] = useState([]);
    const [searchTables, setSearchTables] = useState([]);
    const [loading, setLoading] = useState(false);

    const getData = async () => {
        try {
            setLoading(true);

            const data = await getAllTables(true);

            setTables(data);
            // gan du lieu vao searchTable
            setSearchTables(data);
        } catch (error) {
            console.log("====================================");
            console.log(`error get data tables `, error);
            console.log("====================================");
        } finally {
            setLoading(false);
        }
    };

    const searchFilterFunction = (text) => {
        // Check if searched text is not blank
        if (text) {
          // Inserted text is not blank
          // Filter the masterDataSource and update FilteredDataSource
          const newData = tables.filter(function (item) {
            // Applying filter for the inserted text in search bar
            const itemData = item.name
              ? item.name.toUpperCase()
              : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setSearchTables(newData);
          setSearch(text);
        } else {
          // Inserted text is blank
          // Update FilteredDataSource with masterDataSource
          setSearchTables(tables);
          setSearch(text);
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
            <View style={styles.searchContainer}>
                <TextInput 
                    style={styles.textInput}
                    onChangeText={(text) => searchFilterFunction(text)}
                    value={search}
                    placeholder="Nhập tên bàn..."                                                                                                              
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
                contentInsetAdjustmentBehavior="automatic"
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                refreshing={false}
                onRefresh={handleRefreshing}
                contentContainerStyle={{ padding: 15 }}
                data={searchTables}
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

const styles = StyleSheet.create({
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
