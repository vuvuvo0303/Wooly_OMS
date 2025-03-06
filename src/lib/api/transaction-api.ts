import { Transaction } from "@/types/transaction";
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

export const getTransactionComplete = async () => {
  try {
    const { data } = await axiosClient.get("/transaction");

    // Filter for status "Completed"
    const filteredData = data.data.filter((transaction: Transaction) => transaction.status === "Completed");

    return { error: null, data: filteredData, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getTransactionPending = async () => {
  try {
    const { data } = await axiosClient.get("/transaction");
    const filteredData = data.data.filter((transaction: Transaction) => transaction.status === "Pending");
    return { error: null, data: filteredData, success: true };
  } catch (error) {
    console.log(error);
    return handleApiError(error);
  }
};
