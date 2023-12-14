import axios from "axios";
import Constants from "expo-constants";

export const API_URL = Constants.expoConfig?.extra?.apiUrl;

export interface ErrorResponseType {
  message: string;
  statusCode: number;
  type?: string;
  data?: any;
}

export function instanceOfErrorResponseType(
  object: any
): object is ErrorResponseType {
  return "message" in object && "statusCode" in object;
}

const client = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
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

  if (axios.isAxiosError(error)) {
    message = error.response?.data.message || "An unexpected error occurred.";
    statusCode = error.response?.data.statusCode
      ? error.response?.data.statusCode
      : error.response?.status
      ? error.response?.status
      : 500;
    data = error.response?.data.data ? error.response?.data.data : undefined;
    type = error.response?.data.type ? error.response?.data.type : undefined;
  } else if (error instanceof Error) {
    message = error.message;
  }

  const object: ErrorResponseType = {
    message,
    statusCode,
    data,
    type,
  };

  return object;
};

export default client;
