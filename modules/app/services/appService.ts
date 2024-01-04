import { dispatcher } from "@/helpers/redux";
import { IAccountInfoDTO } from "../types/IAccountInfoDTO";
import { addSecureStoreDataAsync } from "@/helpers/storage";
import { storeEnum } from "@/helpers/storage/Abstract";
import { SignIn } from "../redux/appSlice";
// import { identifyDevice } from "vexo-analytics";

export async function signIn(loginDto: IAccountInfoDTO) {
  // Save AuthToken in secure-store
  await addSecureStoreDataAsync(storeEnum.AuthToken, loginDto.accessToken);

  // Inizialize vexo
  // await identifyDevice(loginDto.vexoToken);

  dispatcher(SignIn(loginDto));
}
