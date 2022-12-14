import type { AxiosRequestConfig, AxiosResponse } from "axios";

export interface RequestInterceptors {
    // 请求前拦截
    requestInterceptors?: (config: AxiosRequestConfig) => AxiosRequestConfig
    requestInterceptorsCatch?: (error: any) => any
    // 响应后拦截
    // responseInterceptors?: <T = AxiosResponse>(config: T) => T
    responseInterceptors?: <T = defaultType.responseDefaultType>(config: T) => T
    responseInterceptorsCatch?: (error: any) => any
}

export interface RequestConfig extends AxiosRequestConfig {
    interceptors?: RequestInterceptors
}