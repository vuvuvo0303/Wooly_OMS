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
  export const getAllUsers = async () => {
    try {
      const { data } = await axiosClient.get(`/admin/get-all-user`);
      return { error: null, data: data, success: true };
    } catch (error) {
      return handleApiError(error);
    }
  };