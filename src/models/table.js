import firestore from "@react-native-firebase/firestore";
import { getLastOrderByTable } from "./order";

export const getAllTables = async (withOrder = false) => {
    try {
        const tablesSnapshot = await firestore().collection("tables").orderBy("name").get();

        if (!tablesSnapshot.size) {
            return [];
        }

        let data = [];

        tablesSnapshot.forEach((documentSnapshot) => {
            data.push({ id: documentSnapshot.id, ...documentSnapshot.data() });
        });

        if (withOrder) {
            data = await Promise.all(
                data.map(async (item) => {
                    const lastOrder = await getLastOrderByTable(item.id);
                    return { ...item, lastOrder };
                })
            );
        }

        return data;
    } catch (error) {
        console.log("====================================");
        console.log(`error get data tables `, error);
        console.log("====================================");
        return [];
    }
};
