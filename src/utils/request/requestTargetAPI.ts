import Request from "./request";
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
export const requests: Request[] = [
    new Request({
        baseURL: import.meta.env.VITE_BASE_URL,
        timeout: 1000 * 30,
    }),
    // new Request({
    //     baseURL: import.meta.env.VITE_BUSINESS_URL,
    //     timeout: 1000 * 30,
    // })
];
export function getTargetAPI(url: string): number {
    const checkApiTarget = (Api: string) => {
        return url === Api
    };
    if (baseTargetAPIList.some(checkApiTarget)) {
        return 0;
    } else if (businessTargetAPIList.some(checkApiTarget)) {
        return 1;
    } else {
        return 1
    }
}
