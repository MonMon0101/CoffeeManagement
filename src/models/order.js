import firestore from "@react-native-firebase/firestore";
import { getUserById } from "./user";
import STATUS from "~/constants/status.constant";
import moment from "moment";

export const getTableById = async (id) => {
    try {
        const tableSnapshot = await firestore().collection("tables").doc(id).get();

        if (!tableSnapshot.exists) {
            return null;
        }

        return { id: tableSnapshot.id, ...tableSnapshot.data() };
    } catch (error) {
        console.log("====================================");
        console.log(`error get table by id `, error);
        console.log("====================================");
        return null;
    }
};

export const getAllOrder = async (date = moment().format("YYYY-MM-DD").toString()) => {
    try {
        let foodsSnapshot = await firestore()
            .collection("orders")
            .where("createdAt", "==", date)
            .get();

        if (foodsSnapshot.empty) {
            return [];
        }

        const data = [];

        foodsSnapshot.forEach((documentSnapshot) => {
            data.push({ id: documentSnapshot.id, ...documentSnapshot.data() });
        });

        const res = await Promise.all(
            data.map(
                (item) =>
                    new Promise(async (rs, rj) => {
                        try {
                            const [user, paymentByStaff, table] = await Promise.all([
                                getUserById(item.userId),
                                getUserById(item?.paymentByStaffId),
                                getTableById(item?.tableId),
                            ]);
                            rs({ ...item, staffOrder: user, paymentByStaff, table });
                        } catch (error) {
                            rj(error);
                        }
                    })
            )
        );

        // sort by orderTime last
        res.sort((a, b) => {
            if (a.orderTime > b.orderTime) {
                return -1;
            }
            if (a.orderTime < b.orderTime) {
                return 1;
            }
            return 0;
        });

        return res;
    } catch (error) {
        console.log("====================================");
        console.log(`error get data orders `, error);
        console.log("====================================");
        return [];
    }
};

export const getOrderIsNotFinishByUserId = async (userId) => {
    try {
        const snapshot = await firestore()
            .collection("order")
            .where("userId", "==", userId)
            .where("status", "!=", STATUS.COMPLETE)
            .get();

        if (snapshot.empty) return false;

        return true;
    } catch (error) {
        console.log("====================================");
        console.log(`error getIsAdmin `, error);
        console.log("====================================");
        return false;
    }
};

export const getOrderById = async (id) => {
    try {
        const foodsSnapshot = await firestore().collection("orders").doc(id).get();

        if (!foodsSnapshot.exists) {
            return null;
        }

        const data = foodsSnapshot.data();

        const [user, paymentByStaff, table] = await Promise.all([
            getUserById(data.userId),
            getUserById(data?.paymentByStaffId),
            getTableById(data?.tableId),
        ]);

        return { ...data, id: foodsSnapshot.id, staffOrder: user, paymentByStaff, table };
    } catch (error) {
        console.log("====================================");
        console.log(`error get data orders `, error);
        console.log("====================================");
        return null;
    }
};

export const createOrder = async (data) => {
    try {
        await firestore().collection("orders").add(data);
        return true;
    } catch (error) {
        console.log("====================================");
        console.log(`error addUser`, error);
        console.log("====================================");
        return false;
    }
};

export const changeStatusOrder = async (status, id) => {
    try {
        await firestore()
            .collection("orders")
            .doc(id)
            .update({ status: switchStatus(status) });
        return true;
    } catch (error) {
        console.log("====================================");
        console.log(`error changeStatusOrder`, error);
        console.log("====================================");
        return false;
    }
};

export const updateOrder = async (data, id) => {
    try {
        await firestore().collection("orders").doc(id).update(data);
        return true;
    } catch (error) {
        console.log("====================================");
        console.log(`error updateOrder`, error);
        console.log("====================================");
        return false;
    }
};

export const convertStatus = (status) => {
    const statuses = {
        [STATUS.COMPLETE]: {
            text: "Hoàn thành",
            color: "green",
        },
        [STATUS.ORDERED]: {
            text: "Đã đặt hàng",
            color: "red",
        },
        [STATUS.TRANSPORTED]: {
            text: "Đang vận chuyển",
            color: "blue",
        },
    };

    return statuses[status];
};

export const switchStatus = (status) => {
    const statuses = {
        [STATUS.COMPLETE]: STATUS.COMPLETE,
        [STATUS.ORDERED]: STATUS.TRANSPORTED,
        [STATUS.TRANSPORTED]: STATUS.COMPLETE,
    };

    return statuses[status];
};

export const getLastOrderByTable = async (tableId) => {
    try {
        const snapshot = await firestore()
            .collection("orders")
            .where("tableId", "==", tableId)
            .where("createdAt", "==", moment().format("YYYY-MM-DD").toString())
            .get();

        if (snapshot.empty) return null;

        // filter status = PROCESSING
        const data = snapshot.docs
            .filter((item) => item.data().status === STATUS.PROCESSING)
            .map((item) => item.data());

        if (data.length === 0) return null;

        // sort by orderTime last
        data.sort((a, b) => {
            if (a.orderTime > b.orderTime) {
                return -1;
            }
            if (a.orderTime < b.orderTime) {
                return 1;
            }
            return 0;
        });

        return { ...data[0], id: snapshot.docs[0].id };
    } catch (error) {
        console.log("====================================");
        console.log(`error getLastOrderByTable`, error);
        console.log("====================================");
        return null;
    }
};
