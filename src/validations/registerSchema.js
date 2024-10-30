import * as yup from "yup";

const registerSchema = yup.object({
  username: yup
    .string()
    .required("Tài khoản là trường bắt buộc"),
  password: yup
    .string()
    .min(5, "Ít nhất 5 kí tự")
    .max(40, "Nhiều nhất 40 kí tự!")
    .required("Mật khẩu là trường bắt buộc"),
  displayName: yup
    .string()
    .required("Tên hiển thị là trường bắt buộc")
    .min(2, "Ít Nhất 2 kí tự")
    .max(40, "Nhiều nhất 40 kí tự"),
});

export default registerSchema;
