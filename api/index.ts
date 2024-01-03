import axios from "axios";
import Constants from "expo-constants";
import { ErrorResponse } from "./api_responses.types";
import { Platform } from "react-native";

export const API_URL = Constants.expoConfig?.extra?.apiUrl;

const client = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "x-device-type": Platform.OS,
  },
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(handleError(error));
  }
);

const handleError = (error: unknown) => {
  var message = "An unexpected error occurred.";
  var statusCode = 500;
  var data = undefined;
  var type = undefined;
  var fields = undefined;

  if (axios.isAxiosError(error)) {
    message = error.response?.data.message || "An unexpected error occurred.";
    statusCode = error.response?.data.statusCode
      ? error.response?.data.statusCode
      : error.response?.status
        ? error.response?.status
        : 500;
    data = error.response?.data.data ? error.response?.data.data : undefined;
    type = error.response?.data.type ? error.response?.data.type : undefined;
    fields = error.response?.data.fields
      ? error.response?.data.fields
      : undefined;
  } else if (error instanceof Error) {
    message = error.message;
  }

  const object: ErrorResponse = {
    message,
    statusCode,
    data,
    type,
    fields,
  };

  return object;
};

export default client;
