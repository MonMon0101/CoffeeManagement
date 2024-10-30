import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, ScrollView, View } from "react-native";
import useAppBar from "~/hooks/useAppBar";
import { goBack } from "~/routes/config/navigation";
import FormAddEditCategory from "./components/AddEditForm/FormAddEditCategory";

export default function AddEditCategoryScreen() {
    const { params } = useRoute();
    const isEditMode = useMemo(() => Boolean(params?.id), [params?.id]);
    const [editSelect, setEditSelect] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!params?.id) return;

        (async () => {
            try {
                setLoading(true);
                const category = await firestore().collection("categories").doc(params?.id).get();

                if (!category.exists) {
                    goBack();
                    return;
                }

                setEditSelect({ id: category.id, ...category.data() });
            } catch (error) {
                console.log("====================================");
                console.log(`error get category edit`, error);
                console.log("====================================");
            } finally {
                setLoading(false);
            }
        })();
    }, [params?.id]);

    useAppBar({ title: isEditMode ? "Cập nhật danh mục" : "Thêm danh mục" });

    const initialValues = useMemo(() => {
        if (!editSelect) return { name: "", image: "" };

        return editSelect;
    }, [editSelect]);

    const handleSubmit = useCallback(
        async (values) => {
            console.log("====================================");
            console.log(`handleSubmit category`, values.image);
            console.log("====================================");

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
                        alert("Tên danh mục đã tồn tại");
                        return;
                    }

                    const response = await firestore()
                        .collection("categories")
                        .doc(values.id)
                        .update({
                            name: values.name,
                            image: values.image,
                        });
                } else {
                    if (!snapshot.empty) {
                        alert("Tên danh mục đã tồn tại");
                        return;
                    }

                    const response = await firestore().collection("categories").add({
                        name: values.name,
                        image: values.image,
                    });
                }

                goBack();
            } catch (error) {
                console.log("====================================");
                console.log(`error add category `, error);
                console.log("====================================");
            } finally {
                setLoading(false);
            }
        },
        [isEditMode, params?.id, initialValues]
    );

    return (
        <View className="bg-white flex-1 p-3">
            {isEditMode && loading && !editSelect ? (
                <ActivityIndicator />
            ) : (
                <KeyboardAvoidingView behavior="padding">
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <FormAddEditCategory
                            initialValues={initialValues}
                            onSubmit={handleSubmit}
                            loading={loading}
                            isEditMode={isEditMode}
                            defaultImage={initialValues?.image}
                        />
                    </ScrollView>
                </KeyboardAvoidingView>
            )}
        </View>
    );
}
