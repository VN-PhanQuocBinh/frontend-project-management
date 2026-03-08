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

import { authApi } from "@/api/auth.api";

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
      console.log("Login data:", data);

      const response = await authApi.login({
        username: data.username,
        password: data.password,
      });

      console.log("Login response:", response);

      localStorage.setItem("access_token", response.token);

      // Save to store
      login(response.userData, response.token);

      toast.success("Đăng nhập thành công!", {
        description: `Chào mừng ${response.userData.username}!`,
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
              {/* <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-lg mb-4">
                <span className="text-2xl font-bold">T</span>
              </div> */}
              <div className="inline-flex items-center justify-center">
                <img src="src\assets\trucllo.png" className="h-14" />
              </div>
              <h1 className="text-2xl! font-bold text-gray-900 mb-2">Đăng nhập vào Trucllo</h1>
              <p className="text-gray-600">Chào mừng bạn quay trở lại!</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <FieldSet>
                <FieldGroup>
                  {/* Email Field */}
                  <Field data-invalid={!!errors.username} className="gap-1">
                    <FieldLabel htmlFor="username">Tài khoản</FieldLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="Nhập tên tài khoản của bạn"
                        className="pl-10"
                        {...register("username")}
                      />
                    </div>
                    {errors.username && (
                      <p className="text-sm text-red-600 mt-1">{errors.username.message}</p>
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
                        placeholder="Nhập mật khẩu của bạn"
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
