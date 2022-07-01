import qs from "qs";
import Request from "./request";
import type { RequestInterceptors } from "./type";
const request = new Request({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 1000 * 20,
});

export default <T = defaultType.responseDefaultType>(
    url: string,
    jsonData: defaultType.requestDefaultType,
    interceptors?: RequestInterceptors
) => {
    return request.request<T>({
        url: url,
        method: "post",
        interceptors,
        data: qs.stringify({
            action: jsonData.targetAPI,
            token: jsonData.token,
            data:
                typeof jsonData.data == "string"
                    ? jsonData.data
                    : JSON.stringify(jsonData.data),
        }),
    });
};
