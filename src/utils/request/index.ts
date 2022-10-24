import qs from "qs";
import Request from "./request";
import { getToken, removeToken } from "@/utils/auth/index";
interface requestObj {
    base: Request;
    business?: Request;
}
const request: requestObj = {
    base: new Request({
        baseURL: import.meta.env.VITE_BASE_URL,
        timeout: 1000 * 30,
    }),
    // business: new Request({
    //     baseURL: import.meta.env.VITE_BUSINESS_URL,
    //     timeout: 1000 * 30,
    // }),
};
// const request = new Request({
//     baseURL: import.meta.env.VITE_BASE_URL,
//     timeout: 1000 * 30,
// });
const baseTargetAPIList = [
    "/Admin",
    "/App",
    "/AppManage",
    "/Config",
    "/DeviceCommand",
    "/DeviceControl",
    "/DeviceVideo",
    "/File",
    "/Log",
    "/Login",
    "/RTVS",
    "/UnAuth",
    "/WeiXin",
];

interface configOption {
    closeMessage?: boolean;
}

export default <T>(
    url: string,
    jsonData: defaultType.requestDefaultType,
    option?: configOption
) => {
    let formData = new FormData();
    let requestAPI = "base";
    if (jsonData.files) {
        formData.append("action", jsonData.targetAPI);
        formData.append("token", getToken());
        formData.append("data", JSON.stringify(jsonData.data));
        jsonData.files.map((file) => {
            formData.append(file.name, file);
        });
    }
    if (
        baseTargetAPIList.some((Api) => {
            return url == Api;
        })
    ) {
        requestAPI = "base";
    } else {
        requestAPI = "business";
    }
    return request[requestAPI].request<defaultType.responseDefaultType<T>>({
        url: url,
        method: "post",
        interceptors: {
            responseInterceptors(config: any) {
                if (config.State == 1) {
                    if (config.Message != "") {
                        if (!option?.closeMessage) {
                            window.$message?.success(config.Message, {
                                duration: 3000,
                            });
                        }
                    }
                } else {
                    if (config.State == -88) {
                        removeToken();
                        location.reload();
                    }
                    window.$message?.error(config.Message, {
                        duration: 3000,
                    });
                }
                return config;
            },
            responseInterceptorsCatch(error: any) {
                console.log(error);
            },
        },
        data: jsonData.files
            ? formData
            : qs.stringify({
                  action: jsonData.targetAPI,
                  token: getToken(),
                  data:
                      typeof jsonData.data == "string"
                          ? jsonData.data
                          : JSON.stringify(jsonData.data),
              }),
    });
};
