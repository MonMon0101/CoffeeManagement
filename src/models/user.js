import firestore from "@react-native-firebase/firestore";
import ROLES from "~/constants/role.constant";

export const getAllUser = async (role = ROLES.STAFF) => {
    try {
        const snapshot = await firestore().collection("users").where("role", "==", role).get();

        if (!snapshot.size) {
            return [];
        }

        const data = [];

        snapshot.forEach((documentSnapshot) => {
            data.push({ id: documentSnapshot.id, ...documentSnapshot.data() });
        });

        return data;
    } catch (error) {
        console.log("====================================");
        console.log(`error get data users `, error);
        console.log("====================================");
        return [];
    }
};

export const getUserById = async (id = "") => {
    try {
        const snapshot = await firestore().collection("users").doc(id).get();

        if (!snapshot.exists) {
            return null;
        }

        return { id: snapshot.id, ...snapshot.data() };
    } catch (error) {
        console.log("====================================");
        console.log(`error get data users `, error);
        console.log("====================================");
        return null;
    }
};

export const getUserByUsername = async (username) => {
    try {
        const snapshot = await firestore()
            .collection("users")
            .where("username", "==", username)
            .get();

        if (snapshot.empty) return null;

        const data = [];

        snapshot.forEach((item) => {
            if (item.exists) {
                data.push({ id: item.id, ...item.data() });
            }
        });

        return data[0];
    } catch (error) {
        console.log("====================================");
        console.log(`error getUserByUsername `, error);
        console.log("====================================");
        return null;
    }
};

export const getIsAdmin = async () => {
    try {
        const snapshot = await firestore()
            .collection("users")
            .where("role", "==", ROLES.ADMIN)
            .get();

        if (snapshot.empty) return false;

        return true;
    } catch (error) {
        console.log("====================================");
        console.log(`error getIsAdmin `, error);
        console.log("====================================");
        throw error;
    }
};

export const addUser = async (data) => {
    try {
        await firestore().collection("users").add(data);
        return true;
    } catch (error) {
        console.log("====================================");
        console.log(`error addUser`, error);
        console.log("====================================");
        throw error;
    }
};
