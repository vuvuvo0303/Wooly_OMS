import { User } from "@/types/user";
import { axiosClient } from "./config/axios-client";

export const handleApiError = (error: any) => {
  console.log("Error", error);
  try {
    const errorMessage = error.response?.data || "An unexpected error occurred.";
    const data = null;
    return { error: errorMessage, data };
  } catch (error) {
    throw new Error("An unexpected error occurred.");
  }
};

export const login = async (email: string, password: string) => {
  try {
    const { data } = await axiosClient.post(`/auth/login`, {
      email: email,
      password: password,
    });
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
export const checkToken = async () => {
  try {
    const { data }: { data?: User } = await axiosClient.get(`/account/profile`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
