import { axiosInstance } from "@/lib/axios-client";

export const updateUsername = async (userId: string, username: string) => {
  const response = await axiosInstance.patch(`/users/${userId}`, { username });
  return response.data;
};
