import qs from "qs";
import Request from "./request";
import { getToken, removeToken } from '@/utils/auth/index';
const request = new Request({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 1000 * 20,
});

export default <T>(
    url: string,
    jsonData: defaultType.requestDefaultType,
) => {
    return request.request<defaultType.responseDefaultType<T>>({
        url: url,
        method: "post",
        interceptors: {
            responseInterceptors(config: any) {
                if(config.State == 1) {
                    if(config.Message != '') {
                        window.$message?.success(config.Message, {
                            duration: 3000,
                        });
                    }
                } else {
                    if(config.State == -88) {
                        removeToken();
                        location.reload();
                    }
                    window.$message?.error(config.Message, {
                        duration: 3000,
                    });
                }
                return config
            },
            responseInterceptorsCatch(error) {
                console.log(error);
            },
        },
        data: qs.stringify({
            action: jsonData.targetAPI,
            token: getToken(),
            data:
                typeof jsonData.data == "string"
                    ? jsonData.data
                    : JSON.stringify(jsonData.data),
        }),
    });
};
