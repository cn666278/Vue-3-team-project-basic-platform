import type { AxiosRequestConfig, AxiosResponse } from "axios";

export interface RequestInterceptors {
    // 请求前拦截
    requestInterceptors?: (config: AxiosRequestConfig) => AxiosRequestConfig
    requestInterceptorsCatch?: (error: any) => any
    // 响应后拦截
    responseInterceptors?: (config: AxiosResponse) => AxiosResponse
    responseInterceptorsCatch?: (error: any) => any
}

export interface RequestConfig extends AxiosRequestConfig {
    interceptors?: RequestInterceptors
}