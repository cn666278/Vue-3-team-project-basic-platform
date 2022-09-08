import axios from "@/utils/request";
const url = '/Admin';
/**
 * @function GetAlarmMessageList 获取异常日志列表
 * @returns {String} token
 */
 export async function getAlarmMessageList(jsonData: AlarmMessage.AlarmMessagedata) {
    const result = await axios<AlarmMessage.AlarmMessageList[]>(url, {
        targetAPI: 'GetAlarmMessageList',
        data: jsonData
    })
    return result
}

