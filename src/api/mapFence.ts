import axios from "@/utils/request";
const url = '/Admin';
/**
 * @function GetMapFenceRecordList 获取电子围栏进出记录
 * @returns {String} token
 */
 export async function getMapFenceRecordList(jsonData: MapFenceRecord.MapFenceRecorddata) {
    const result = await axios<MapFenceRecord.MapFenceRecordList[]>(url, {
        targetAPI: 'GetMapFenceRecordList',
        data: jsonData
    })
    return result
}