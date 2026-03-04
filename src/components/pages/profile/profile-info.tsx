import React from "react";
import { type UserProfile } from "@/types/profile";
import { User, Mail, ShieldCheck, Hash } from "lucide-react";

interface ProfileInfoProps {
  user: UserProfile;
}

// Helper: lấy chữ viết tắt từ username
function getInitials(username: string) {
  return username
    .split(/[\s_-]/)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
}

// Helper: màu badge theo role
function getRoleBadgeClass(role: string) {
  switch (role.toLowerCase()) {
    case "admin":
      return "bg-red-100 text-red-700 border border-red-200";
    case "manager":
      return "bg-purple-100 text-purple-700 border border-purple-200";
    default:
      return "bg-blue-100 text-blue-700 border border-blue-200";
  }
}

const InfoRow: React.FC<{
  label: string;
  value: string;
}> = ({ label, value }) => (
  <div className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-gray-800 truncate">{value}</p>
    </div>
  </div>
);

const ProfileInfo: React.FC<ProfileInfoProps> = ({ user }) => {
  const initials = getInitials(user.username);

  return (
    <div className="p-6">
      {/* Banner + Avatar */}
      <div className="relative mb-16">
        {/* Banner */}
        <div className="h-32 rounded-sm bg-gradient-to-r from-yellow-300 to-yellow-500" />

        {/* Avatar */}
        <div className="absolute -bottom-10 left-6">
          <div className="w-20 h-20 rounded-full bg-orange-400 border-4 border-white shadow-md flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{initials}</span>
          </div>
        </div>
      </div>

      {/* Username + Role */}
      <div className="mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-xl font-bold text-gray-900">{user.username}</h2>
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getRoleBadgeClass(user.role)}`}
          >
            {user.role}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 mb-4" />

      {/* Info Rows */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Thông tin tài khoản
        </h3>
        <div className=" rounded-xl px-4">
          <InfoRow label="ID" value={user.id} />
          <InfoRow label="Tên người dùng" value={user.username} />
          <InfoRow label="Vai trò" value={user.role} />
          <InfoRow label="Email" value={user.email} />
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
