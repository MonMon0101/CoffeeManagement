import firestore from "@react-native-firebase/firestore";
import moment from "moment";
import { getAllUser, getUserById } from "./user";
import STATUS from "~/constants/status.constant";
import ROLES from "~/constants/role.constant";
import { getAllTables } from "./table";
import { getAllProduct } from "./product";
import { getAllCategories } from "./category";

export const getAllOrder = async () => {
    try {
        let foodsSnapshot = await firestore()
            .collection("orders")
            .where("status", "==", STATUS.COMPLETE)
            .get();

        if (foodsSnapshot.empty) {
            return { totalPrice: 0, totalPriceCurrentDate: 0 };
        }

        const data = [];

        foodsSnapshot.forEach((documentSnapshot) => {
            data.push({ id: documentSnapshot.id, ...documentSnapshot.data() });
        });

        const dataCurrentDate = data.filter((item) => {
            return moment(item.createdAt, "YYYY-MM-DD").isSame(moment().format("YYYY-MM-DD"));
        });

        const reduceData = (total, item) => {
            const price = item.products.reduce((totalItem, product) => {
                return totalItem + product.price * product.quantity;
            }, 0);

            return total + price;
        };

        const totalPrice = data.reduce(reduceData, 0);

        const totalPriceCurrentDate = dataCurrentDate.reduce(reduceData, 0);

        return { totalPrice, totalPriceCurrentDate };
    } catch (error) {
        console.log("====================================");
        console.log(`error get data orders `, error);
        console.log("====================================");
        return { totalPrice: 0, totalPriceCurrentDate: 0 };
    }
};

export const getAllStatistic = async () => {
    try {
        const [responseOrder, staffs, tables, products, categories] = await Promise.all([
            getAllOrder(),
            getAllUser(ROLES.STAFF),
            getAllTables(),
            getAllProduct({}),
            getAllCategories(),
        ]);

        return {
            ...responseOrder,
            totalStaff: staffs.length,
            totalTable: tables.length,
            totalProduct: products.length,
            totalCategory: categories.length,
        };
    } catch (error) {
        console.log("====================================");
        console.log(`error get data statistics `, error);
        console.log("====================================");
        return {
            totalPrice: 0,
            totalStaff: 0,
            totalTable: 0,
            totalProduct: 0,
            totalPriceCurrentDate: 0,
            totalCategory: 0,
        };
    }
};

// Quy add theo dieu kien
export const getAllOrderWithCondition = async (fromDate, toDate) => {
    try {
        let foodsSnapshot = await firestore()
            .collection("orders")
            .where("status", "==", STATUS.COMPLETE)
            .where("createdAt", ">=", fromDate)
            .where("createdAt", "<=" , toDate)
            .get();

        if (foodsSnapshot.empty) {
            return { totalPrice: 0, totalPriceCurrentDate: 0 };
        }

        const data = [];

        foodsSnapshot.forEach((documentSnapshot) => {
            data.push({ id: documentSnapshot.id, ...documentSnapshot.data() });
        });

        // const dataCurrentDate = data.filter((item) => {
        //     return moment(item.createdAt, "YYYY-MM-DD").isSame(moment().format("YYYY-MM-DD"));
        // });

        const reduceData = (total, item) => {
            const price = item.products.reduce((totalItem, product) => {
                return totalItem + product.price * product.quantity;
            }, 0);

            return total + price;
        };

        const totalPrice = data.reduce(reduceData, 0);

        //const totalPriceCurrentDate = dataCurrentDate.reduce(reduceData, 0);
        const totalPriceCurrentDate = data.reduce(reduceData, 0);

        return { totalPrice, totalPriceCurrentDate };
    } catch (error) {
        console.log("====================================");
        console.log(`error get data orders `, error);
        console.log("====================================");
        return { totalPrice: 0, totalPriceCurrentDate: 0 };
    }
};

export const getAllStatisticWithCondition = async (fromDate, toDate) => {
    try {
        const [responseOrder, staffs, tables, products, categories] = await Promise.all([
            getAllOrderWithCondition(fromDate, toDate),
            getAllUser(ROLES.STAFF),
            getAllTables(),
            getAllProduct({}),
            getAllCategories(),
        ]);

        return {
            ...responseOrder,
            totalStaff: staffs.length,
            totalTable: tables.length,
            totalProduct: products.length,
            totalCategory: categories.length,
        };
    } catch (error) {
        console.log("====================================");
        console.log(`error get data statistics `, error);
        console.log("====================================");
        return {
            totalPrice: 0,
            totalStaff: 0,
            totalTable: 0,
            totalProduct: 0,
            totalPriceCurrentDate: 0,
            totalCategory: 0,
        };
    }
};
