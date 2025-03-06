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
    const { data } = await axiosClient.get("/product/get-all-product");
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const uploadImage = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file); // Thêm file vào FormData

    const { data } = await axiosClient.post("/image/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Đảm bảo header đúng cho upload file
      },
    });

    return { error: null, data: data.imageUrl, success: true }; // Giả định API trả về imageUrl
  } catch (error) {
    return handleApiError(error);
  }
};

// Hàm tạo sản phẩm, tích hợp upload hình ảnh
export const createProduct = async (productData: Product, imageFile?: File) => {
  try {
    let imageUrl = "";

    // Nếu có file hình ảnh, upload trước và lấy URL
    if (imageFile) {
      const uploadResult = await uploadImage(imageFile);
      if (!uploadResult.success) {
        return { error: uploadResult.error, data: null, success: false };
      }
      imageUrl = uploadResult.data; // Lấy URL hình ảnh
    }

    // Thêm imageUrl vào productData
    const updatedProductData = {
      ...productData,
      imageUrl: imageUrl || productData.imageUrl, // Sử dụng imageUrl từ upload hoặc từ productData nếu không có file
    };

    const { data } = await axiosClient.post("/product/add-product", updatedProductData);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};