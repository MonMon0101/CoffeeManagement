import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Formik } from "formik";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import ButtonLoader from "~/components/ui/ButtonLoader";
import HelperText from "~/components/ui/form/HelperText";
import InputLabel from "~/components/ui/form/InputLabel";
import { BLUR_HASH } from "~/constants/image.constant";
import { addEditFoodSchema } from "~/validations/addEditCategorySchema";
import Toast from "react-native-toast-message";

export default function FormAddEditProduct({
    initialValues,
    onSubmit,
    loading = false,
    isEditMode = false,
    defaultImage = "",
    categories = [],
}) {
    const [image, setImage] = useState(null);
    const [loadingImage, setLoading] = useState(false);

    const onPressPickImage = async () => {
        try {
            setLoading(true);

            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== "granted") {
                // If permission is denied, show an alert
                Alert.alert(
                    "Permission Denied",
                    `Sorry, we need camera  
             roll permission to upload images.`
                );
            } else {
                // Launch the image library and get
                // the selected image
                const result = await ImagePicker.launchImageLibraryAsync();

                if (!result.canceled) {
                    // Get uri
                    setImage(result.assets[0]);
                }
            }
        } catch (error) {
            console.log("====================================");
            console.log(`error onPressPickImage`, error);
            console.log("====================================");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Formik
            enableReinitialize
            validationSchema={addEditFoodSchema}
            initialValues={initialValues}
            onSubmit={(values, { resetForm }) => {
                if (!onSubmit) return;

                if (!isEditMode) {
                    if (!image) {
                        Toast.show({
                            type: "error",
                            text1: "Lỗi",
                            text2: "Vui lòng chọn ảnh",
                            text2Style: { fontSize: 14 },
                        });
                        return;
                    }
                }

                if (image) {
                    values.image = image.uri;
                }

                onSubmit(values, resetForm);
            }}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View className="w-full h-full">
                    <InputLabel
                        label={"Tên sản phẩm"}
                        placeholder="Nhập tên sản phẩm"
                        value={values.name}
                        onBlur={handleBlur("name")}
                        onChangeText={handleChange("name")}
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                    />

                    <Text className="font-bold">{"Danh mục"}</Text>

                    <Dropdown
                        className={`bg-black/5 p-3 rounded-2xl w-full mt-1 relative mb-1 ${
                            touched.categoryId && Boolean(errors.categoryId)
                                ? "border border-red-500"
                                : ""
                        }`}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={categories}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Chọn danh mục"
                        searchPlaceholder="Tìm ..."
                        value={values.categoryId}
                        onChange={(item) => {
                            handleChange("categoryId")(item.value);
                        }}
                    />
                    {touched.categoryId && Boolean(errors.categoryId) ? (
                        <View>
                            <HelperText type={"error"} visible={true} text={errors.categoryId} />
                        </View>
                    ) : null}

                    <InputLabel
                        inputMode="decimal"
                        label={"Giá"}
                        placeholder="Nhập giá"
                        value={values.price}
                        onBlur={handleBlur("price")}
                        onChangeText={handleChange("price")}
                        error={touched.price && Boolean(errors.price)}
                        helperText={touched.price && errors.price}
                    />

                    <InputLabel
                        numberOfLines={4}
                        label={"Mô tả"}
                        placeholder="Nhập mô tả"
                        value={values.description}
                        onBlur={handleBlur("description")}
                        onChangeText={handleChange("description")}
                        error={touched.description && Boolean(errors.description)}
                        helperText={touched.description && errors.description}
                    />

                    <View className="mt-2">
                        <ButtonLoader
                            label={isEditMode ? "Chọn ảnh mới" : "Chọn ảnh"}
                            loading={loadingImage}
                            onPress={onPressPickImage}
                        />
                    </View>

                    {image || defaultImage ? (
                        // Display the selected image
                        <View className="mt-1 relative">
                            <Image
                                placeholder={BLUR_HASH}
                                source={{ uri: image?.uri || defaultImage }}
                                contentFit="cover"
                                className="w-24 h-24 rounded-md"
                            />
                        </View>
                    ) : null}

                    <View className="mt-10">
                        <ButtonLoader
                            label={isEditMode ? "Lưu thay đổi" : "Tạo mới"}
                            loading={loading}
                            onPress={handleSubmit}
                        />
                    </View>
                </View>
            )}
        </Formik>
    );
}

const styles = StyleSheet.create({
    dropdown: {
        margin: 16,
        height: 50,
        borderBottomColor: "gray",
        borderBottomWidth: 0.5,
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: 14,
    },
    selectedTextStyle: {
        fontSize: 14,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});
