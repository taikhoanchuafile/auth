import { z, ZodIssueCode } from "zod";
export const loginSchema = z.object({
  email: z.email("Email không hợp lệ!"),
  password: z.string().min(1, "Mật khẩu không được để trống!"),
});
export type LoginValidate = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, "Họ tên không được để trống!"),
    email: z.email("Email không hợp lệ!").trim(),
    password: z.string().trim().min(6, "Mật khẩu phải có ít nhất 6 ký tự!"),
    confirmPassword: z.string().trim(),
  })
  .superRefine((value, ctx) => {
    if (value.password !== value.confirmPassword) {
      //gắn thông báo cho field confirmPassword
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: "Xác nhận mật khẩu không khóp",
        path: ["confirmPassword"],
      });
    }
  });
export type RegisterValidate = z.infer<typeof registerSchema>;
