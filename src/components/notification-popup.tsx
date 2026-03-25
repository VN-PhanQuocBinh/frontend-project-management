import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip } from "./ui/tooltip";
import { subscribeNotification } from "@/hooks/useNotification";
import { getNotificationById, markNotificationsRead } from "@/api/notification.api";
import type { Notification } from "@/types/notification";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  Clock,
  CheckCircle2,
  ClipboardList,
  FolderOpen,
  User,
  Inbox,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { vi } from "date-fns/locale";

interface NotificationPopupProps {
  children: React.ReactNode;
}

const NotificationPopup = ({ children }: NotificationPopupProps) => {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const authStorage = localStorage.getItem("auth-storage");
  const id = authStorage ? JSON.parse(authStorage).state?.user?.id : undefined;

  React.useEffect(() => {
    const fetchNotifications = async () => {
      if (!id) return;
      try {
        const data = await getNotificationById(id);
        console.log("Raw data:", JSON.stringify(data));
        setNotifications(Array.isArray(data) ? data : data?.data ?? []);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();

    const ctrl = subscribeNotification((type: string, data: any) => {
      console.log("Notification received:", type, data);
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      ctrl.close();
    };
  }, [id]);

  // Mark all notifications as read when popup opens

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-violet-500",
      "bg-blue-500",
      "bg-emerald-500",
      "bg-amber-500",
      "bg-rose-500",
      "bg-cyan-500",
      "bg-indigo-500",
      "bg-pink-500",
      "bg-teal-500",
    ];
    const index = name
      ? name.charCodeAt(0) % colors.length
      : 0;
    return colors[index];
  };

  const unreadCount = notifications.length;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip content="Thông báo">
        <PopoverTrigger asChild>
          <div className="relative">
            {children}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>
        </PopoverTrigger>
      </Tooltip>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[420px] p-0 rounded-xl border border-gray-200 bg-white shadow-2xl shadow-black/10 overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm">
                <Bell className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">
                  Thông báo
                </h2>
                <p className="text-xs text-blue-100 mt-0.5">
                  {unreadCount > 0
                    ? `${unreadCount} thông báo mới`
                    : "Không có thông báo mới"}
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <span className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-white">
                {unreadCount}
              </span>
            )}
          </div>
        </div>

        {/* Notification List */}
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
              <Inbox className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500 font-semibold text-sm">
              Chưa có thông báo nào
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Các thông báo mới sẽ hiển thị ở đây
            </p>
          </div>
        ) : (
          <div className="max-h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <div className="group relative px-4 py-3.5 hover:bg-blue-50/60 transition-all duration-200 cursor-pointer">
                  {/* Unread indicator dot */}
                  <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500 opacity-80" />

                  <div className="flex gap-3">
                    {/* Avatar */}
                    <Avatar className="w-10 h-10 shrink-0 ring-2 ring-white shadow-sm">
                      <AvatarFallback
                        className={`${getAvatarColor(
                          notification.username
                        )} text-white text-xs font-bold`}
                      >
                        {getInitials(notification.username)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Username */}
                      <div className="flex items-center gap-1.5 mb-1">
                        <User className="w-3 h-3 text-gray-400 shrink-0" />
                        <span className="text-sm font-bold text-gray-900 truncate">
                          {notification.username || "Hệ thống"}
                        </span>
                      </div>

                      {/* Task Title */}
                      {notification.taskTitle && (
                        <div className="flex items-start gap-1.5 mb-1">
                          <ClipboardList className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md truncate max-w-full">
                            {notification.taskTitle}
                          </span>
                        </div>
                      )}

                      {/* Project Name */}
                      {notification.projectName && (
                        <div className="flex items-start gap-1.5 mb-1.5">
                          <FolderOpen className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md truncate max-w-full">
                            {notification.projectName}
                          </span>
                        </div>
                      )}

                      {/* Content message */}
                      <p className="text-[13px] text-gray-600 leading-relaxed">
                        {notification.content}
                      </p>

                      {/* Footer: time */}
                      {notification.createdDate && (
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>
                              {formatDistanceToNow(
                                new Date(notification.createdDate),
                                {
                                  addSuffix: true,
                                  locale: vi,
                                }
                              )}
                            </span>
                          </div>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs text-gray-400">
                            {format(
                              new Date(notification.createdDate),
                              "HH:mm dd/MM/yyyy",
                              { locale: vi }
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {index < notifications.length - 1 && (
                  <Separator className="mx-4 w-auto" />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t border-gray-100 px-4 py-3 bg-gray-50/60">
            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>
                Hiển thị tất cả {notifications.length} thông báo
              </span>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationPopup;
