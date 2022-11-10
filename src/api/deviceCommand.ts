import axios from "@/utils/request";
const url = '/DeviceCommand';

/**
 * @function JT808Command8103 JT808终端参数指令
 * @param jsonData 
 * @returns 
 */
 export async function jT808Command8103(jsonData: any) {
    const result = await axios(url, {
        targetAPI: 'JT808Command8103',
        data: jsonData
    });
    return result
}

export interface requestDeviceCommandList extends defaultType.requestList {
    groupMD5Id?: string;
    isSend?: boolean;
    isReply?: boolean;
}
/**
 * @function GetDeviceCommandList 获取设备指令列表
 * @param jsonData 
 * @returns 
 */
 export async function getDeviceCommandList(jsonData: requestDeviceCommandList) {
    const result = await axios<defaultType.responseList<deviceCommand.deviceCommandList[]>>(url, {
        targetAPI: 'GetDeviceCommandList',
        data: jsonData
    });
    return result
}