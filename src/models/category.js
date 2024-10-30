import firestore from "@react-native-firebase/firestore";
import { getAllProduct } from "./product";

export const getAllCategories = async () => {
    try {
        const categoriesSnapshot = await firestore().collection("categories").get();

        if (!categoriesSnapshot.size) {
            return [];
        }

        const data = [];

        categoriesSnapshot.forEach((documentSnapshot) => {
            data.push({ id: documentSnapshot.id, ...documentSnapshot.data() });
        });

        return data;
    } catch (error) {
        console.log("====================================");
        console.log(`error get data categories `, error);
        console.log("====================================");
        return [];
    }
};

export const getProductsCategories = async () => {
    try {
        const categories = await getAllCategories();

        if (categories.length === 0) {
            return [];
        }

        const results = await Promise.all(
            categories.map(async (category) => {
                const productsSnapshot = await getAllProduct({ categoryId: category.id });

                return {
                    ...category,
                    products: productsSnapshot,
                };
            })
        );

        return results.filter((category) => category.products.length > 0);
    } catch (error) {
        console.log("====================================");
        console.log(`error get data categories `, error);
        console.log("====================================");
        return [];
    }
};
