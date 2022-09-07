import axios from "@/utils/request";
const url = '/Log';
/**
 * @function GetExceptionList 获取异常日志列表
 * @returns {String} token
 */
 export async function getExceptionList(jsonData: Exception.Exceptiondata) {
    const result = await axios<Exception.ExceptionList[]>(url, {
        targetAPI: 'GetExceptionList',
        data: jsonData
    })
    return result
}
/**
 * @function GetWebLogList 获取Web接口日志列表
 * @returns {String} token
 */
 export async function getWebLogList(jsonData: WebLog.WebLogdata) {
    const result = await axios<WebLog.WebLogList[]>(url, {
        targetAPI: 'GetWebLogList',
        data: jsonData
    })
    return result
}
/**
 * @function GetCompetenceControllerList 获取控制器
 * @returns {String} token
 */
 export async function getCompetenceControllerList() {
    const result = await axios('/Admin', {
        targetAPI: 'GetCompetenceControllerList',
    })
    return result
}
/**
 * @function GetDeviceMsgLogList 获取上下行数据
 * @returns {String} token
 */
 export async function getDeviceMsgLogList(jsonData: deviceMsgLog.deviceMsgLogdata) {
    const result = await axios<deviceMsgLog.deviceMsgLogList[]>(url, {
        targetAPI: 'GetDeviceMsgLogList',
        data: jsonData
    })
    return result
}

/**
 * @function GetJTJsonWriter 解析JT808
 * @param jsonData 提交字段
 * @returns {String} token
 */
 export async function getJTJsonWriter(jsonData:  deviceMsgLog.deviceMsgLogdata) {
    const result = await axios<deviceMsgLog.deviceMsgLogdata>('/UnAuth', {
        targetAPI: 'GetJTJsonWriter',
        data: jsonData
    })
    return result
}
/**
 * @function DownloadDeviceMsgLogs 修改菜单信息
 * @param jsonData 提交字段
 * @returns {String} token
 */
 export async function downloadDeviceMsgLogs(jsonData:  deviceMsgLog.deviceMsgLogdata) {
    const result = await axios<deviceMsgLog.DownloaddeviceMsgLogList>(url, {
        targetAPI: 'DownloadDeviceMsgLogs',
        data: jsonData
    })
    return result
}
/**
 * @function GetEnumType 获取枚举数组--键值格式
 * @param jsonData 提交字段
 * @returns {String} token
 */
 export async function getEnumType(jsonData:  string) {
    const result = await axios<member.memberInfo>('Login', {
        targetAPI: 'GetEnumType',
        data: jsonData
    })
    return result
}