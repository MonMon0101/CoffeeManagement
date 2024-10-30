import * as yup from "yup";

const scoreSchema = yup.object({
  mid_term_score: yup.number().min(0, "Thấp nhất 0 điểm").max(10, "Tối đa 10 điểm"),
  final_term_score: yup.number().min(0, "Thấp nhất 0 điểm").max(10, "Tối đa 10 điểm"),
});

export default scoreSchema;