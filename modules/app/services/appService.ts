import { dispatcher } from "@/helpers/redux";
import { IAccountInfoDTO } from "../types/IAccountInfoDTO";
import {
  addSecureStoreDataAsync,
  removeSecureStoreDataAsync,
} from "@/helpers/storage";
import { storeEnum } from "@/helpers/storage/Abstract";
import { SignIn, SignOut } from "../redux/appSlice";
import axiosInstance from "@/utils/network/AxiosInstance";
import { QueryClient } from "@tanstack/react-query";
// import { identifyDevice } from "vexo-analytics";

export async function signIn(loginDto: IAccountInfoDTO) {
  // Save AuthToken in secure-store
  await addSecureStoreDataAsync(storeEnum.AuthToken, loginDto.accessToken);

  // Inizialize vexo
  // await identifyDevice(loginDto.vexoToken);

  dispatcher(SignIn(loginDto));
}

export async function signOut(qc: QueryClient) {
  await removeSecureStoreDataAsync(storeEnum.AuthToken);

  qc.clear();

  axiosInstance.defaults.headers.common.Authorization = "";

  dispatcher(SignOut());
}
