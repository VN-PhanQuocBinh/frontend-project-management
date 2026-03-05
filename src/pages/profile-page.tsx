import React from "react";
import ProfileTabs from "@/components/pages/profile/profile-tab";
import { type UserProfile } from "@/types/profile";

const mockUser: UserProfile = {
  id: "12345",
  username: "john_doe",
  role: "Admin",
  email: "john_doe@example.com",
};

const ProfilePage: React.FC = () => {
  return (
    <div className="h-max p-4 bg-gray-100">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Tài khoản của tôi</h2>
          <p className="text-gray-500 mt-1">Quản lý thông tin cá nhân và bảo mật tài khoản</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-sm overflow-hidden ">
          <ProfileTabs user={mockUser} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
