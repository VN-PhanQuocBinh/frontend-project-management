import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormValues } from "@/schemas/register.schema";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/auth-store";

export default function RegisterPage() {
  const { isLoading, register: authRegister } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log(data);

      authRegister(
        {
          id: "2",
          name: data.name,
          email: data.email,
          avatar: "",
        },
        "mock-jwt-token",
      );

      toast.success("Đăng ký thành công!", {
        description: `Chào mừng ${data.name}!`,
        duration: 4000,
      });
    } catch (error) {
      toast.error("Đăng ký thất bại", {
        description: "Vui lòng thử lại sau",
      });
    }
  };

  return (
    <div className="h-full overflow-auto">
      <Toaster position="top-center" richColors />
      <div className="min-h-screen flex items-center justify-center bg-linear-br from-blue-50 to-indigo-100 p-4">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Logo & Title */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-lg mb-4">
                <span className="text-2xl font-bold">T</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Đăng ký Trucllo</h1>
              <p className="text-gray-600">Tạo tài khoản mới để bắt đầu!</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <FieldSet>
                <FieldGroup>
                  {/* Name Field */}
                  <Field data-invalid={!!errors.name} className="gap-1">
                    <FieldLabel htmlFor="name">Tên</FieldLabel>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Nguyễn Văn A"
                        className="pl-10"
                        {...register("name")}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                    )}
                  </Field>

                  {/* Email Field */}
                  <Field data-invalid={!!errors.email} className="gap-1">
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@email.com"
                        className="pl-10"
                        {...register("email")}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                    )}
                  </Field>

                  {/* Password Field */}
                  <Field data-invalid={!!errors.password} className="gap-1">
                    <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        {...register("password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
                    )}
                  </Field>

                  {/* Confirm Password Field */}
                  <Field data-invalid={!!errors.confirmPassword} className="gap-1">
                    <FieldLabel htmlFor="confirmPassword">Xác nhận mật khẩu</FieldLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        {...register("confirmPassword")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>
                    )}
                  </Field>

                  {/* Submit Button */}
                  <Field>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isSubmitting || isLoading}
                      className="w-full"
                    >
                      {isSubmitting || isLoading ? "Đang đăng ký..." : "Đăng ký"}
                    </Button>
                  </Field>
                </FieldGroup>
              </FieldSet>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Đã có tài khoản?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                >
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-gray-600 mt-6">
            © 2026 Trucllo. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
