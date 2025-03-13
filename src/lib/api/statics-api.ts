import { axiosClient } from "./config/axios-client";

export const handleApiError = (error: any) => {
  try {
    const errorMessage = error.Errors?.ErrorMessage || "An unexpected error occurred.";
    const data = null;
    return { error: errorMessage, data };
  } catch (err) {
    throw new Error("An unexpected error occurred.");
  }
};

export const getStatics = async () => {
  try {
    const { data } = await axiosClient.get(`/admin/dashboard`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
export const getUserAccess = async () => {
  try {
    const { data } = await axiosClient.get(`/admin/count-user`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
export const getchart = async () => {
  try {
    const { data } = await axiosClient.get(`/admin/chart`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
export const getBestSeller = async () => {
  try {
    const { data } = await axiosClient.get(`/homepage/best-seller`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
