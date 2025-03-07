import { Product } from "@/types/product";
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

export const getAllProducts = async () => {
  try {
    const { data } = await axiosClient.get("/admin/get-all-product");
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
export const createProduct = async (productData: Product) => {
  try {
    const { data } = await axiosClient.post("/product/add-product", productData);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
