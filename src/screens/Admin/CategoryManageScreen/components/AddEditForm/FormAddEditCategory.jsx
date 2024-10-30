import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Formik } from "formik";
import React, { useState } from "react";
import { Alert, View } from "react-native";
import Toast from "react-native-toast-message";
import ButtonLoader from "~/components/ui/ButtonLoader";
import InputLabel from "~/components/ui/form/InputLabel";
import { BLUR_HASH } from "~/constants/image.constant";
import addEditCategorySchema from "~/validations/addEditCategorySchema";

export default function FormAddEditCategory({
    initialValues,
    onSubmit,
    loading = false,
    isEditMode = false,
    defaultImage = "",
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
            validationSchema={addEditCategorySchema}
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
                        label={"Tên danh mục"}
                        placeholder="Nhập tên danh mục"
                        value={values.name}
                        onBlur={handleBlur("name")}
                        onChangeText={handleChange("name")}
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
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
