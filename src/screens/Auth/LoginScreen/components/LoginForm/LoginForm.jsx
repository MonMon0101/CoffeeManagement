import { Formik } from "formik";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ButtonLoader from "~/components/ui/ButtonLoader";
import InputLabel from "~/components/ui/form/InputLabel";
import PATHS from "~/constants/path.constant";
import { navigate } from "~/routes/config/navigation";
import { themeColors } from "~/theme";
import loginSchema from "~/validations/loginSchema";

export default function LoginForm({ initialValues, onSubmit, loading = false }) {
    return (
        <Formik
            enableReinitialize
            validationSchema={loginSchema}
            initialValues={initialValues}
            onSubmit={(values, { resetForm }) => {
                if (!onSubmit) return;
                onSubmit(values, resetForm);
            }}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View className="w-full h-full">
                    <InputLabel
                        label={"Tài khoản"}
                        placeholder="Nhập tài khoản của bạn"
                        value={values.username}
                        onBlur={handleBlur("username")}
                        onChangeText={handleChange("username")}
                        error={touched.username && Boolean(errors.username)}
                        helperText={touched.username && errors.username}
                    />

                    <InputLabel
                        label={"Mật khẩu"}
                        placeholder="Nhập số điện thoại của bạn"
                        isSecure
                        value={values.password}
                        onBlur={handleBlur("password")}
                        onChangeText={handleChange("password")}
                        error={touched.password && Boolean(errors.password)}
                        helperText={touched.password && errors.password}
                    />

                    <View className="mt-10">
                        <ButtonLoader
                            loading={loading}
                            onPress={handleSubmit}
                            label={"Đăng nhập"}
                        />
                    </View>

                    <View className="flex-row justify-center">
                        <Text>Bạn chưa có tài khoản? </Text>
                        <TouchableOpacity onPress={() => navigate(PATHS.REGISTER)}>
                            <Text style={{ color: themeColors.text }}>Đăng ký</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </Formik>
    );
}
