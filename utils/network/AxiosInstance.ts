/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios from "axios";
import { getReduxStore } from "../redux/store";

const options = {
  baseURL: "http://10.167.12.91:8000",
};

const axiosInstance = axios.create(options);

axiosInstance.interceptors.request.use((config) => {
  const token = getReduxStore().AppReducer?.tokenData?.token || "";

  config?.headers?.set("Authorization", `Bearer ${token}`);

  return config;
});

export default axiosInstance;
