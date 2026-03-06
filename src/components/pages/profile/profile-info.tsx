import React from "react";
import { useAuthStore } from "@/stores/auth-store";
import { type UserRole } from "@/types/auth";
import UserAvatar from "@/components/user-avatar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Pencil, Copy, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/utils/copy-to-clipboard";
import { toast } from "sonner";

interface ProfileInfoProps {}

const profileSchema = z.object({
  email: z.string().email("Email không hợp lệ").optional(),
});

// Helper: màu badge theo role
function getRoleBadgeClass(role: UserRole | undefined) {
  switch (role?.toLowerCase()) {
    case "ADMIN":
      return "bg-red-100 text-red-700 border border-red-200";
    case "MEMBER":
      return "bg-purple-100 text-purple-700 border border-purple-200";
    default:
      return "bg-blue-100 text-blue-700 border border-blue-200";
  }
}

const InfoRow: React.FC<{
  label: string;
  value: string;
  className?: string;
}> = ({ label, value, className }) => (
  <div
    className={cn("flex items-center gap-4 py-4 border-b border-gray-100 last:border-0", className)}
  >
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-gray-800 truncate">{value}</p>
    </div>
  </div>
);

const ProfileInfo: React.FC<ProfileInfoProps> = () => {
  const { user } = useAuthStore();
  const [isOpenEditEmail, setIsOpenEditEmail] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: { email: user?.email || "" },
  });

  const onSubmit = (data: z.infer<typeof profileSchema>) => {
    setIsLoading(true);

    try {
      // TODO: call API update email
      console.log("Updating email to:", data.email);
    } catch (error) {
      console.error("Error updating email:", error);
      toast.error("Cập nhật email thất bại!");
    } finally {
      reset();
      setIsLoading(false);
      setIsOpenEditEmail(false);
    }
  };

  const handleCopyEmail = async () => {
    if (!user?.email) return;
    const success = await copyToClipboard(user.email);
    if (success) {
      toast.success("Email đã được sao chép vào clipboard!");
    }
  };

  return (
    <div className="p-6">
      {/* Banner + Avatar */}
      <div className="relative mb-16">
        {/* Banner */}
        <div className="h-32 rounded-sm bg-gradient-to-r from-gray-300 to-gray-500" />

        {/* Avatar */}
        <div className="absolute -bottom-10 left-6">
          <UserAvatar
            username={user?.username || "User"}
            avatar={user?.avatar || ""}
            size={80}
            className="border-4 border-white shadow-md"
          />
        </div>
      </div>

      {/* Username + Role */}
      <div className="mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-xl font-bold text-gray-900">{user?.username}</h2>
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getRoleBadgeClass(user?.role)}`}
          >
            {user?.role}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-0.5">{user?.email}</p>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 mb-4" />

      {/* Info Rows */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Thông tin tài khoản
        </h3>
        <div className=" rounded-xl px-4">
          <InfoRow label="ID" value={user?.id || "ID not provided"} />
          <InfoRow label="Tên người dùng" value={user?.username || "Username not provided"} />
          <InfoRow label="Vai trò" value={user?.role || "Role not provided"} />
          {!isOpenEditEmail ? (
            <div className="flex flex-row items-center">
              <InfoRow
                label="Email"
                value={user?.email || "Email not provided"}
                className="flex-1"
              />
              <Button variant="ghost" onClick={handleCopyEmail}>
                <Copy className="w-4 h-4" />
              </Button>
              <Button variant="ghost" onClick={() => setIsOpenEditEmail(true)}>
                <Pencil className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="py-4">
              <Field data-invalid={!!errors.email} className="gap-1">
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="text"
                  placeholder="Nhập email mới"
                  className="pr-10"
                  {...register("email")}
                  autoFocus
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                )}
              </Field>
              <Button
                type="submit"
                disabled={isSubmitting || isLoading || !isDirty}
                className="mt-4"
              >
                {isLoading ? <LoaderCircle className="animate-spin" /> : "Lưu thay đổi"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setIsOpenEditEmail(false)}
                className="mt-4 ml-2"
                disabled={isSubmitting || isLoading}
              >
                Hủy
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
