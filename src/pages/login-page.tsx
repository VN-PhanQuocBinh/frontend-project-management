import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "@/schemas/login.schema";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth-store";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock response from API
      const mockUser = {
        id: "1",
        name: "Phan Quốc Bình",
        email: data.email,
        avatar: "",
      };

      const mockToken = "mock-jwt-token";

      // Save to store
      login(mockUser, mockToken);

      toast.success("Đăng nhập thành công!", {
        description: `Chào mừng ${mockUser.name}!`,
        duration: 4000,
      });

      // Redirect to home
      navigate("/");
    } catch (error) {
      toast.error("Đăng nhập thất bại", {
        description: "Vui lòng kiểm tra lại thông tin đăng nhập",
      });
    }
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Logo & Title */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-lg mb-4">
                <span className="text-2xl font-bold">T</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Đăng nhập vào Trucllo</h1>
              <p className="text-gray-600">Chào mừng bạn quay trở lại!</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <FieldSet>
                <FieldGroup>
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
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
                      <Link
                        to="/forgot-password"
                        className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        Quên mật khẩu?
                      </Link>
                    </div>
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

                  {/* Submit Button */}
                  <Field>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isSubmitting || isLoading}
                      className="w-full"
                    >
                      {isSubmitting || isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </Button>
                  </Field>
                </FieldGroup>
              </FieldSet>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?{" "}
                <Link
                  to="/register"
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                >
                  Đăng ký ngay
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
    </>
  );
}
