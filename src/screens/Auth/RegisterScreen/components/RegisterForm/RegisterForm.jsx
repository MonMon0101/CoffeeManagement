import { Formik } from "formik";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ButtonLoader from "~/components/ui/ButtonLoader";
import InputLabel from "~/components/ui/form/InputLabel";
import { goBack } from "~/routes/config/navigation";
import { themeColors } from "~/theme";
import registerSchema from "~/validations/registerSchema";

export default function RegisterForm({ initialValues, onSubmit, loading = false }) {
    return (
        <Formik
            enableReinitialize
            validationSchema={registerSchema}
            initialValues={initialValues}
            onSubmit={(values, { resetForm }) => {
                if (!onSubmit) return;
                onSubmit(values, resetForm);
            }}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View className="w-full h-full">
                    <InputLabel
                        label={`Tài khoản`}
                        placeholder="Nhập tài khoản của bạn"
                        value={values.username}
                        onBlur={handleBlur("username")}
                        onChangeText={handleChange("username")}
                        error={touched.username && Boolean(errors.username)}
                        helperText={touched.username && errors.username}
                    />

                    <InputLabel
                        label={`Tên hiển thị`}
                        placeholder="Nhập tên hiển thị"
                        value={values.displayName}
                        onBlur={handleBlur("displayName")}
                        onChangeText={handleChange("displayName")}
                        error={touched.displayName && Boolean(errors.displayName)}
                        helperText={touched.displayName && errors.displayName}
                    />

                    <InputLabel
                        label={`Mật khẩu`}
                        placeholder="Nhập mật khẩu"
                        value={values.password}
                        onBlur={handleBlur("password")}
                        onChangeText={handleChange("password")}
                        error={touched.password && Boolean(errors.password)}
                        helperText={touched.password && errors.password}
                        isSecure
                    />

                    <View className="mt-10">
                        <ButtonLoader label={"Đăng ký"} onPress={handleSubmit} loading={loading} />
                    </View>

                    <View className="flex-row justify-center">
                        <Text>Bạn đã có tài khoản? </Text>
                        <TouchableOpacity onPress={goBack}>
                            <Text style={{ color: themeColors.text }}>Đăng nhập</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </Formik>
    );
}
