import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import type { RequestInterceptors, RequestConfig } from "./type";

class Request {
    // 在该class声明instance属性作为实例化用对象
    instance: AxiosInstance;
    // 拦截器对象
    interceptorsObj?: RequestInterceptors;
    constructor(config: RequestConfig) {
        // 实例请求
        this.instance = axios.create(config);
        this.interceptorsObj = config.interceptors;

        // 全局请求拦截器
        this.instance.interceptors.request.use(
            (res: AxiosRequestConfig) => {
                // 发送请求前拦截
                return res;
            },
            // 发送请求报错
            (error: any) => error
        );

        // 实例请求拦截器(局部, 可选的)
        this.instance.interceptors.request.use(
            this.interceptorsObj?.requestInterceptors,
            this.interceptorsObj?.requestInterceptorsCatch
        );
        // 实例响应拦截器(局部, 可选的)
        this.instance.interceptors.response.use(
            this.interceptorsObj?.responseInterceptors,
            this.interceptorsObj?.responseInterceptorsCatch
        );

        // 全局响拦截器
        this.instance.interceptors.response.use(
            (res: AxiosResponse) => {
                return res.data.Data;
            },
            (error: any) => error
        );
    }
    request<T>(config: RequestConfig): Promise<T> {
        return new Promise((resolve, reject) => {
            if (config.interceptors?.requestInterceptors) {
                config = config.interceptors.requestInterceptors(config);
            }
            this.instance.request<any, T>(config).then((res) => {
                if (config.interceptors?.responseInterceptors) {
                    res = config.interceptors.responseInterceptors<T>(res);
                }
                resolve(res);
            });
        });
    }
}

export default Request;
