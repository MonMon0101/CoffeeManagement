import firestore from "@react-native-firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Alert, FlatList, RefreshControl, Text, View } from "react-native";
import ButtonAdd from "~/components/ui/ButtonAdd";
import PATHS from "~/constants/path.constant";
import useAppBar from "~/hooks/useAppBar";
import { getAllUser } from "~/models/user";
import { navigate } from "~/routes/config/navigation";
import TableStaff from "./components/TableStaff";

export default function StaffManageScreen() {
    useAppBar({ title: "Quản lý nhân viên" });
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(false);

    const getData = async () => {
        try {
            setLoading(true);

            const data = await getAllUser();

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

    const handleDelete = useCallback(async (id) => {
        Alert.alert(
            "Xác nhận",
            "Bạn có chắc muốn xóa nhân viên này không?", // <- this part is optional, you can pass an empty string
            [
                { text: "Hủy", onPress: () => console.log("Cancel Pressed"), style: "cancel" },
                {
                    text: "OK",
                    onPress: async () => {
                        try {
                            const response = await firestore()
                                .collection("tables")
                                .doc(id)
                                .delete();
                            await getData();
                        } catch (error) {
                            console.log("====================================");
                            console.log(`error delete category`, error);
                            console.log("====================================");
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    }, []);

    const renderItem = useCallback(({ item }) => {
        return <TableStaff item={item} onDelete={handleDelete} />;
    }, []);

    const keyExtract = useCallback((item, index) => `${index}`, []);

    const spacingCom = useCallback(() => <View className="m-2" />, []);

    const ListHeaderComponent = useMemo(
        () => () => {
            return (
                <View>
                    <ButtonAdd
                        label="Thêm nhân viên"
                        onPress={() => navigate(PATHS.ADD_EDIT_STAFF)}
                    />

                    {loading ? (
                        <View className="mb-2">
                            <ActivityIndicator />
                        </View>
                    ) : null}

                    {!loading && !tables.length ? (
                        <View>
                            <Text className="text-center text-red-500">Chưa có nhân viên</Text>
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
                refreshing={false}
                onRefresh={handleRefreshing}
                contentContainerStyle={{ padding: 15 }}
                data={tables}
                renderItem={renderItem}
                keyExtractor={keyExtract}
                ItemSeparatorComponent={spacingCom}
                ListHeaderComponent={ListHeaderComponent}
            />
        </View>
    );
}
