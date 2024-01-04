import Network from "@/utils/network";
import * as AuthRoutes from "./authRoutes";
import { IAccountInfoDTO } from "../types/IAccountInfoDTO";

export function login(LoginDTO: any) {
  return Network.post<IAccountInfoDTO>({
    url: AuthRoutes.logIn,
    data: LoginDTO,
    // successMessaging: false,
  });
}
