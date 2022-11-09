import Request from "./request";
export interface requests {
    base: Request;
    // business: Request;
}
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
const businessTargetAPIList = ["/BusinessBase", "/Camera", "/ProCommon"];
export const requests: requests = {
    base: new Request({
        baseURL: import.meta.env.VITE_BASE_URL,
        timeout: 1000 * 30,
    }),
    // business: new Request({
    //     baseURL: import.meta.env.VITE_BUSINESS_URL,
    //     timeout: 1000 * 30,
    // })
};
export function getTargetAPI(url: string): 'base' | 'business' {
    const checkApiTarget = (Api: string) => {
        return url === Api
    };
    if (baseTargetAPIList.some(checkApiTarget)) {
        return "base";
    } else if (businessTargetAPIList.some(checkApiTarget)) {
        return 'business'
    } else {
        return 'business'
    }
}
