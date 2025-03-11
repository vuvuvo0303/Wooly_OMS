import { toast } from "react-toastify";
import { axiosClient } from "./config/axios-client";

export const handleApiError = (error: any) => {
    try {
        const errorMessage =
            error.response?.data || "An unexpected error occurred.";
        const data = null;
        return { error: errorMessage, data };
    } catch (err) {
        throw new Error("An unexpected error occurred.");
    }
};

export const getCategories = async () => {
    try {
        const { data } = await axiosClient.get(`/category/get-all-category`);

        // Lọc chỉ lấy các danh mục có isDelete = false
        const filteredData = data.filter(
            (category: any) => !category.isDeleted
        );

        return { error: null, data: filteredData, success: true };
    } catch (error) {
        return handleApiError(error);
    }
};

export const createCategory = async (formData: { name: string }) => {
    try {
        const { data } = await axiosClient.post(
            `/category/add-category?name=${encodeURIComponent(formData.name)}`
        );
        toast.success("Thêm mới loại sản phẩm thành công");
        return { error: null, data: data, success: true };
    } catch (error) {
        return handleApiError(error);
    }
};
export const deleteCategory = async (categoryId: number) => {
    if (!categoryId) {
        console.error("Lỗi: ID danh mục không hợp lệ");
        return { success: false, message: "ID danh mục không hợp lệ" };
    }

    try {
        const response = await axiosClient.delete(
            `/category/delete-category/${categoryId}`
        );
        return response.data;
    } catch (error) {
        console.error("Lỗi khi xóa danh mục:", error);
        return { success: false, message: "Lỗi khi xóa danh mục" };
    }
};

export const updateCategory = async (
    categoryID: number,
    formData: { name: string }
) => {
    try {
        const { data } = await axiosClient.put(
            `/category/update-category/${categoryID}?name=${encodeURIComponent(
                formData.name
            )}`
        );
        toast.success("Cập nhật danh mục thành công");
        return { error: null, data, success: true };
    } catch (error) {
        return handleApiError(error);
    }
};

export const orderHistoryAPI = async () => {
    try {
        const response = await axiosClient.get(`/admin/get-all-orders`);

        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
};
