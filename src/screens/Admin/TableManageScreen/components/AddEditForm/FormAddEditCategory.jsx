import { Formik } from "formik";
import { View } from "react-native";
import ButtonLoader from "~/components/ui/ButtonLoader";
import InputLabel from "~/components/ui/form/InputLabel";
import addEditCategorySchema from "~/validations/addEditCategorySchema";

export default function FormAddEditTable({
    initialValues,
    onSubmit,
    loading = false,
    isEditMode = false,
}) {
    return (
        <Formik
            enableReinitialize
            validationSchema={addEditCategorySchema}
            initialValues={initialValues}
            onSubmit={(values, { resetForm }) => {
                if (!onSubmit) return;

                onSubmit(values, resetForm);
            }}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View className="w-full h-full">
                    <InputLabel
                        label={"Tên bàn"}
                        placeholder="Nhập tên bàn"
                        value={values.name}
                        onBlur={handleBlur("name")}
                        onChangeText={handleChange("name")}
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                    />

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
