import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { type PasswordChangeForm } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Lock, Eye, EyeOff } from "lucide-react";
import { authApi } from "@/api/auth.api";
import { toast } from "sonner";

const passwordChangeSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Mật khẩu hiện tại phải có ít nhất 6 ký tự"),
    newPassword: z
      .string()
      .min(8, "Mật khẩu mới phải có ít nhất 8 ký tự")
      .regex(/[A-Z]/, "Phải chứa ít nhất 1 chữ hoa")
      .regex(/[0-9]/, "Phải chứa ít nhất 1 chữ số"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

const SecurityForm: React.FC = () => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordChangeForm>({
    resolver: zodResolver(passwordChangeSchema),
  });

  const onSubmit = async (data: PasswordChangeForm) => {
    console.log("Password change data:", data);

    try {
      await authApi.changePassword({
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Đổi mật khẩu thành công!");
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Đổi mật khẩu thất bại!");
    }

    reset();
  };

  return (
    <div className="p-6">
      {/* Section header */}
      <div className="flex flex-col justify-center gap-1 mb-6">
        <h2 className="text-lg font-bold text-gray-900">Đổi mật khẩu</h2>
        <p className="text-sm text-gray-500">
          Để bảo mật tài khoản, vui lòng đổi mật khẩu định kỳ.
        </p>
      </div>

      <div className="border-t border-gray-100 mb-6" />

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md">
        <FieldSet>
          <FieldGroup>
            {/* Current Password */}
            <Field data-invalid={!!errors.currentPassword} className="gap-1">
              <FieldLabel htmlFor="currentPassword">
                Mật khẩu hiện tại
              </FieldLabel>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <Input
                  id="currentPassword"
                  type={showCurrent ? "text" : "password"}
                  placeholder="Nhập mật khẩu hiện tại"
                  className="pl-9 pr-10"
                  {...register("currentPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrent ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.currentPassword.message}
                </p>
              )}
            </Field>

            {/* New Password */}
            <Field data-invalid={!!errors.newPassword} className="gap-1">
              <FieldLabel htmlFor="newPassword">Mật khẩu mới</FieldLabel>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <Input
                  id="newPassword"
                  type={showNew ? "text" : "password"}
                  placeholder="Nhập mật khẩu mới"
                  className="pl-9 pr-10"
                  {...register("newPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNew ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.newPassword.message}
                </p>
              )}
              {/* Password hints */}
              <ul className="mt-1.5 space-y-1">
                {[
                  "Ít nhất 8 ký tự",
                  "Ít nhất 1 chữ hoa (A-Z)",
                  "Ít nhất 1 chữ số (0-9)",
                ].map((hint) => (
                  <li
                    key={hint}
                    className="flex items-center gap-1.5 text-xs text-gray-400"
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-300 inline-block" />
                    {hint}
                  </li>
                ))}
              </ul>
            </Field>

            {/* Confirm Password */}
            <Field data-invalid={!!errors.confirmPassword} className="gap-1">
              <FieldLabel htmlFor="confirmPassword">
                Xác nhận mật khẩu mới
              </FieldLabel>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu mới"
                  className="pl-9 pr-10"
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </Field>

            {/* Submit */}
            <Field className="pt-2">
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Đang lưu..." : "Cập nhật mật khẩu"}
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  );
};

export default SecurityForm;
