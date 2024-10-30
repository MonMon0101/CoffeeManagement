import firestore from "@react-native-firebase/firestore";
import { useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, ScrollView, View } from "react-native";
import useAppBar from "~/hooks/useAppBar";
import { goBack } from "~/routes/config/navigation";
import FormAddEditProduct from "./components/FormAddEditProduct";
import { useFocusEffect } from "@react-navigation/native";
import { getAllCategories } from "~/models/category";
import storage from "@react-native-firebase/storage";

export default function AddEditProductScreen() {
    const { params } = useRoute();
    const isEditMode = useMemo(() => Boolean(params?.id), [params?.id]);
    const [editSelect, setEditSelect] = useState(null);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (!params?.id) return;

        (async () => {
            try {
                setLoading(true);
                const food = await firestore().collection("products").doc(params?.id).get();

                if (!food.exists) {
                    goBack();
                    return;
                }

                setEditSelect({ id: food.id, ...food.data() });
            } catch (error) {
                console.log("====================================");
                console.log(`error get food edit`, error);
                console.log("====================================");
            } finally {
                setLoading(false);
            }
        })();
    }, [params?.id]);

    useAppBar({ title: isEditMode ? "Cập nhật sản phẩm" : "Thêm sản phẩm" });

    useFocusEffect(
        useCallback(() => {
            (async () => {
                try {
                    setLoading(true);

                    const data = await getAllCategories();

                    setCategories(data);
                } catch (error) {
                    console.log("====================================");
                    console.log(`error get data categories `, error);
                    console.log("====================================");
                } finally {
                    setLoading(false);
                }
            })();
        }, [])
    );

    const initialValues = useMemo(() => {
        if (!editSelect)
            return {
                name: "",
                categoryId: "",
                description: "",
                price: "",
                image: "",
            };

        return editSelect;
    }, [editSelect]);

    const handleSubmit = useCallback(
        async (values) => {
            console.log("====================================");
            console.log(`handleSubmit food`, values);
            console.log("====================================");

            // return;

            try {
                setLoading(true);

                if (initialValues?.image !== values.image) {
                    const uploadUri = String(values.image);

                    let fileName = uploadUri.substring(uploadUri.lastIndexOf("/") + 1);

                    const extension = fileName.split(".").pop();
                    const name = fileName.split(".").slice(0, -1).join(".");

                    fileName = name + Date.now() + "." + extension;

                    await storage().ref(fileName).putFile(uploadUri);

                    const url = await storage().ref(fileName).getDownloadURL();

                    values.image = url;
                }

                const snapshot = await firestore()
                    .collection("categories")
                    .where("name", "==", values.name)
                    .where("categoryId", "==", values.categoryId)
                    .get();

                if (isEditMode) {
                    let isExists = false;

                    if (!snapshot.empty) {
                        snapshot.forEach((item) => {
                            if (item.id !== params?.id) {
                                isExists = true;
                                return;
                            }
                        });
                    }

                    if (isExists) {
                        alert("Tên sản phẩm đã tồn tại");
                        return;
                    }

                    const response = await firestore()
                        .collection("products")
                        .doc(values.id)
                        .update(values);

                    console.log("====================================");
                    console.log(`updated food => `, response);
                    console.log("====================================");
                } else {
                    if (!snapshot.empty) {
                        alert("Tên sản phẩm đã tồn tại");
                        return;
                    }

                    const response = await firestore().collection("products").add(values);

                    console.log("====================================");
                    console.log(`added food => `, response);
                    console.log("====================================");
                }

                goBack();
            } catch (error) {
                console.log("====================================");
                console.log(`error add food `, error);
                console.log("====================================");
            } finally {
                setLoading(false);
            }
        },
        [isEditMode, params?.id, initialValues]
    );

    return (
        <View className="bg-white flex-1 p-3">
            {!categories.length || (isEditMode && loading && !editSelect) ? (
                <ActivityIndicator />
            ) : (
                <KeyboardAvoidingView behavior="padding">
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <FormAddEditProduct
                            initialValues={initialValues}
                            onSubmit={handleSubmit}
                            loading={loading}
                            isEditMode={isEditMode}
                            categories={categories?.map((t) => ({ label: t?.name, value: t?.id }))}
                            defaultImage={initialValues?.image}
                        />
                    </ScrollView>
                </KeyboardAvoidingView>
            )}
        </View>
    );
}
