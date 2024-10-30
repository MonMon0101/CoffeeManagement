import * as yup from "yup";

export const editProfileSchema = yup.object({
  first_name: yup
    .string()
    .min(2, ({ min }) => `Display name must be at least ${min} characters`)
    .required("Tên sinh viên là trường bắt buộc"),
  last_name: yup
    .string()
    .min(2, ({ min }) => `Display name must be at least ${min} characters`)
    .required("Họ và chữ lót là trường bắt buộc"),
});

export const changePwdSchema = yup.object({
  password: yup
    .string()
    .min(8, ({ min }) => `Password must be at least ${min} characters`)
    .required("Password is required"),
  newPassword: yup
    .string()
    .min(8, ({ min }) => `Password must be at least ${min} characters`)
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), undefined], "New password must match"),
});
