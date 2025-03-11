import { axiosClient } from "./config/axios-client";
export const handleApiError = (error: any) => {
    try {
      const errorMessage = error.response?.data || "An unexpected error occurred.";
      const data = null;
      return { error: errorMessage, data };
    } catch (err) {
      throw new Error("An unexpected error occurred.");
    }
  };
  
export const getLatestOrders = async () => {
  try {
    const response = await axiosClient.get("/order/latest-order");
    return { data: response.data, error: null };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getAllOrders = async () => {
  try {
    const response = await axiosClient.get("/admin/get-all-orders");
    return { data: response.data, error: null };
  } catch (error) {
    return handleApiError(error);
  }
};
