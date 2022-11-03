import axios from "@/utils/request";
const url = '/Admin';

export interface requestBusinessSubList extends defaultType.requestList {
    isEnable?: boolean;
}
/**
 * @function GetBusinessSubList 获取业务订阅列表
 * @param jsonData 
 * @returns 
 */
export async function getBusinessSubList(jsonData: requestBusinessSubList) {
    const result = await axios<defaultType.responseList<admin.businessSubList[]>>(url, {
        targetAPI: 'GetBusinessSubList',
        data: jsonData,
    });
    return result
}

/**
 * @function GetBusinessSubInfo 获取业务订阅详情
 * @param jsonData 
 * @returns 
 */
export async function getBusinessSubInfo(jsonData: string) {
    const result = await axios<admin.businessSubInfo>(url, {
        targetAPI: 'GetBusinessSubInfo',
        data: jsonData,
    });
    return result
}

/**
 * @function AddBusinessSub 添加业务订阅
 * @param jsonData 
 * @returns 
 */
export async function addBusinessSub(jsonData: admin.businessSubInfo) {
    const result = await axios(url, {
        targetAPI: 'AddBusinessSub',
        data: jsonData,
    });
    return result
}

/**
 * @function UpdateBusinessSub 修改业务订阅
 * @param jsonData 
 * @returns 
 */
export async function updateBusinessSub(jsonData: admin.businessSubInfo) {
    const result = await axios(url, {
        targetAPI: 'UpdateBusinessSub',
        data: jsonData,
    });
    return result
}