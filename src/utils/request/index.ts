import qs from "qs";
import Request from "./request";
import { requests, getTargetAPI } from "@/utils/request/requestTargetAPI";
import { getToken, removeToken } from "@/utils/auth/index";
const request = requests;
// const request = new Request({
//     baseURL: import.meta.env.VITE_BASE_URL,
//     timeout: 1000 * 30,
// });

interface configOption {
    closeMessage?: boolean;
}

export default <T>(
    url: string,
    jsonData: defaultType.requestDefaultType,
    option?: configOption
) => {
    let formData = new FormData();
    if (jsonData.files) {
        formData.append("action", jsonData.targetAPI);
        formData.append("token", getToken());
        formData.append("data", JSON.stringify(jsonData.data));
        jsonData.files.map((file) => {
            formData.append(file.name, file);
        });
    }
    return request[getTargetAPI(url)].request<defaultType.responseDefaultType<T>>({
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
