import * as React from "react";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProfileInfo from "./profile-info";
import SecurityForm from "./security-form";
import { type UserProfile } from "@/types/profile";

interface ProfileTabsProps {
  user: UserProfile;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      {/* Tab navigation - line variant giống header ảnh */}
      <div className="border-b border-gray-200 px-6 pt-6">
        <TabsList
          variant="line"
          className="flex h-auto gap-0 bg-transparent p-0 justify-start rounded-none"
        >
          <TabsTrigger
            value="profile"
            className="rounded-none px-4 pb-3 pt-1 text-sm font-medium data-[state=active]:text-gray-800"
          >
            Hồ sơ và chế độ hiển thị
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="rounded-none px-4 pb-3 pt-1 text-sm font-medium data-[state=active]:text-gray-800"
          >
            Bảo mật
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="profile" className="mt-0">
        <ProfileInfo user={user} />
      </TabsContent>
      <TabsContent value="security" className="mt-0">
        <SecurityForm />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
