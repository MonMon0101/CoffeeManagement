import firestore from "@react-native-firebase/firestore";
import { useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, ScrollView, View } from "react-native";
import useAppBar from "~/hooks/useAppBar";
import { goBack } from "~/routes/config/navigation";
import FormAddEditStaff from "./components/AddEditForm/FormAddEditStaff";
import { hashPassword } from "~/utils/password";
import ROLES from "~/constants/role.constant";

export default function AddEditStaffScreen() {
    const { params } = useRoute();
    const isEditMode = useMemo(() => Boolean(params?.id), [params?.id]);
    const [editSelect, setEditSelect] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!params?.id) return;

        (async () => {
            try {
                setLoading(true);
                const category = await firestore().collection("users").doc(params?.id).get();

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

    useAppBar({ title: isEditMode ? "Cập nhật nhân viên" : "Thêm nhân viên" });

    const initialValues = useMemo(() => {
        if (!editSelect) return { name: "" };

        return editSelect;
    }, [editSelect]);

    const handleSubmit = useCallback(
        async (values) => {
            try {
                setLoading(true);

                const snapshot = await firestore()
                    .collection("users")
                    .where("username", "==", values.username)
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
                        alert("Tài khoản nhân viên đã tồn tại");
                        return;
                    }

                    await firestore().collection("users").doc(values.id).update({
                        displayName: values.displayName,
                    });
                } else {
                    if (!snapshot.empty) {
                        alert("Tài khoản nhân viên đã tồn tại");
                        return;
                    }

                    await firestore()
                        .collection("users")
                        .add({
                            displayName: values.displayName,
                            password: hashPassword(values.password),
                            username: values.username,
                            role: ROLES.STAFF,
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
                        <FormAddEditStaff
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
