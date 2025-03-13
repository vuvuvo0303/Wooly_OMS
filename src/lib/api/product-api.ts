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
export const deleteProduct = async (productID: number) => {
  try {
    const response = await axiosClient.delete(`/product/delete-product/${productID}`);
    return { success: true, data: response.data }; // Đảm bảo trả về success: true
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, message: "Failed to delete product" };
  }
};
export const getProductById = async (productID: number) => {
  try {
    const { data } = await axiosClient.get(`/product/get-product-by/${productID}`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
export const updateProduct = async (productID: number, productData: Product) => {
  try {
    const { data } = await axiosClient.put(`/product/update-product/${productID}`, productData);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
export const uploadProductImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload-image", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Upload ảnh thất bại");
  }

  const data = await response.json();
  return data.imageUrl;
};
