import { axiosClient } from "./config/axios-client";

export const handleApiError = (error: any) => {
  try {
    const errorMessage = error?.Errors?.ErrorMessage || "An unexpected error occurred.";
    return { error: errorMessage, data: null, success: false };
  } catch {
    return { error: "An unexpected error occurred.", data: null, success: false };
  }
};

export const getStatics = async () => {
  try {
    const { data } = await axiosClient.get(`/admin/dashboard`);
    return { error: null, data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getUserAccess = async () => {
  try {
    const { data } = await axiosClient.get(`/admin/count-user`);
    return { error: null, data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getChart = async () => {
  try {
    const { data } = await axiosClient.get(`/admin/chart`);
    return { error: null, data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getBestSeller = async () => {
  try {
    const { data } = await axiosClient.get(`/homepage/best-seller`);
    return { error: null, data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getRevenuePerWeek = async () => {
  try {
    const { data } = await axiosClient.get(`/admin/revenue-per-week`);
    console.log("getRevenuePerWeek", data);
    return { error: null, data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getRevenuePerDay = async () => {
  try {
    const { data } = await axiosClient.get(`/admin/revenue-per-day`);
    console.log("getRevenuePerDay", data);
    return { error: null, data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
