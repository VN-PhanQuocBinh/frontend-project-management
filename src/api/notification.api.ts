import axiosClient from "./axios-client";

export const getNotificationById = async (notificationId: string) => {
  const response = await axiosClient.get(`/notifications/user/${notificationId}`);
  return response;
};

// export const updateNotification = async (notificationId: string, data: Partial<Notification>) => {
//   const response = await axiosClient.patch(`/${notificationId}/read`, data);
//   return response.data;
// };

export const markNotificationsRead = async (userId: string) => {
  const response = await axiosClient.patch(`/notifications/${userId}/read`);
  return response.data;
};
