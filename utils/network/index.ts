// import { showToast } from '@actions/app';
// import { ToastColorEnum } from '@globalTypes/IGlobal';
import NetInfo from "@react-native-community/netinfo";
// import GetLang from '@helpers/localization';
import translate from "@/helpers/localization";
import AxiosInstance from "./AxiosInstance";
import {
  MethodEnum,
  IApiParams,
  INetworkParams,
  Result as ApiResult,
} from "./Abstract";

import ExceptionMiddleware from "./ExceptionMiddleware";
import { isAxiosError } from "axios";

export default class Network {
  static newRequest<_Result, Response>(params: IApiParams & INetworkParams) {
    const {
      url,
      method,
      headers,
      data,
      // successMessaging = true,
      // errorMessaging = true,
    } = params;

    process.env.NODE_ENV !== "production" &&
      console.log({
        url,
        data,
        method,
        headers,
      });

    return new Promise<ApiResult<_Result, Response>>((resolve, reject) => {
      AxiosInstance({
        url,
        method,
        headers,
        data,
      })
        .then(async (res: any) => {
          // const errorCallBack = await ExceptionMiddleware({
          //   ...res,
          //   errorMessaging,
          // });

          // if (errorMessaging && res?.data?.statusCode !== 200)
          //   errorCallBack?.();

          // if (res?.data?.statusCode === 200) {
          //   console.log("res", res);
          //   // if (successMessaging) showToast(res.data.message, ToastColorEnum.Succes);

          //   return resolve(res?.data);
          // }

          // return reject(res?.data);

          return resolve(res?.data);
        })
        .catch(async (err) => {
          NetInfo.fetch().then((state) => {
            if (!state.isConnected) {
              console.log(translate("noInternet"));
              // showToast(translate('noInternet'), ToastColorEnum.Info);
            }
          });

          if (isAxiosError(err)) return reject(err.response?.data);
          else {
            return reject(err);
          }

          // if (!err.response?.status) {
          //   // showToast("", ToastColorEnum.Error);
          // } else {
          //   // const errorCallBack = await ExceptionMiddleware({
          //   //   ...err.response,
          //   //   errorMessaging,
          //   // });
          //   // if (errorMessaging) errorCallBack?.();
          // }

          // return reject(err);
        });
    });
  }

  static get<_Result = any, Response = ApiResult<_Result>>({
    ...requestParams
  }: IApiParams) {
    return this.newRequest<_Result, Response>({
      ...requestParams,
      url: `${requestParams.url}${requestParams.queryString || ""}`,
      method: MethodEnum.GET,
    });
  }

  // static delete<_Result = any, Response = ApiResult<_Result>>({
  //   version = "v1.0",
  //   ...requestParams
  // }: IApiParams) {
  //   return this.newRequest<_Result, Response>({
  //     ...requestParams,
  //     url: `${version}${requestParams.url}`,
  //     method: MethodEnum.DELETE,
  //   });
  // }

  // static patch<_Result = any, Response = ApiResult<_Result>>({
  //   version = "v1.0",
  //   ...requestParams
  // }: IApiParams) {
  //   return this.newRequest<_Result, Response>({
  //     ...requestParams,
  //     url: `${version}${requestParams.url}`,
  //     method: MethodEnum.PATCH,
  //   });
  // }

  // static put<_Result = any, Response = ApiResult<_Result>>({
  //   version = "v1.0",
  //   ...requestParams
  // }: IApiParams) {
  //   return this.newRequest<_Result, Response>({
  //     ...requestParams,
  //     url: `${version}${requestParams.url}`,
  //     method: MethodEnum.PUT,
  //   });
  // }

  static post<_Result = any, Response = ApiResult<_Result>>({
    // version = "v1.0",
    ...requestParams
  }: IApiParams) {
    return this.newRequest<_Result, Response>({
      ...requestParams,
      url: `${requestParams.url}`,
      method: MethodEnum.POST,
    });
  }
}
