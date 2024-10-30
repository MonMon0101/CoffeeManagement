import * as yup from "yup";

const classSchema = yup.object({
  name: yup.string().max(255, "Nhiều nhất 255 kí tự").required("Vui lòng không bỏ trống"),
});

export default classSchema;
