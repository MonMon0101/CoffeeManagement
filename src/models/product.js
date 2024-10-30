import firestore from "@react-native-firebase/firestore";

export const getAllProduct = async ({ categoryId = "", name = "" }) => {
    try {
        let foodsSnapshot;

        if (categoryId || name) {
            if (name && categoryId) {
                foodsSnapshot = await firestore()
                    .collection("products")
                    .where("categoryId", "==", categoryId)
                    .orderBy("name")
                    .startAt(name)
                    .endAt(name + "\uf8ff")
                    .get();
            } else {
                if (name) {
                    foodsSnapshot = await firestore()
                        .collection("products")
                        .orderBy("name")
                        .startAt(name)
                        .endAt(name + "\uf8ff")
                        .get();
                } else {
                    foodsSnapshot = await firestore()
                        .collection("products")
                        .where("categoryId", "==", categoryId)
                        .get();
                }
            }
        } else {
            foodsSnapshot = await firestore().collection("products").get();
        }

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
                            const category = await firestore()
                                .collection("categories")
                                .doc(item?.categoryId)
                                .get();

                            if (!category.exists) {
                                return rs(null);
                            }

                            rs({ ...item, category: { ...category.data(), id: category.id } });
                        } catch (error) {
                            rj(error);
                        }
                    })
            )
        );

        return res;
    } catch (error) {
        console.log("====================================");
        console.log(`error get data foods `, error);
        console.log("====================================");
        return [];
    }
};

export const getProductById = async (id) => {
    try {
        const snapshot = await firestore().collection("products").doc(id).get();

        if (!snapshot.exists) {
            return null;
        }

        return { id: snapshot.id, ...snapshot.data() };
    } catch (error) {
        console.log("====================================");
        console.log(`error get data a food `, error);
        console.log("====================================");
        return null;
    }
};
