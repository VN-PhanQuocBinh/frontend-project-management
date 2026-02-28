import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username là bắt buộc"),
  password: z.string().min(1, "Mật khẩu là bắt buộc").min(4, "Mật khẩu phải có ít nhất 4 ký tự"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
