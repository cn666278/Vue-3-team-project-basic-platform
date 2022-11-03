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

/**
 * @function GetMapFenceTree 获取电子围栏树形
 * @param jsonData 
 * @returns 
 */
export async function getMapFenceTree(jsonData: { isEnable: boolean }) {
    const result = await axios<MapFenceRecord.MapFenceTree[]>(url, {
        targetAPI: 'GetMapFenceTree',
        data: jsonData,
    });
    return result;
}