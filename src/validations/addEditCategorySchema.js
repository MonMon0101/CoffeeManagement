import * as yup from "yup";

export const addEditFoodSchema = yup.object({
    name: yup.string().required("Tên là trường bắt buộc"),
    categoryId: yup.string().required("Danh mục là trường bắt buộc"),
    price: yup.number().required("Giá là trường bắt buộc"),
    description: yup.string(),
    image: yup.mixed(),
});

const addEditCategorySchema = yup.object({
    name: yup.string().required("Tên là trường bắt buộc"),
    image: yup.mixed(),
});

export default addEditCategorySchema;
