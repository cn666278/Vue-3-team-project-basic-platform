import axios from '@/utils/request';
const url = '/Admin';

/**
 * @function GetMapList 获取地图列表
 * @param jsonData 查询列表字段
 * @returns 
 */
 export async function getMapList(jsonData: defaultType.requestList) {
    const result = await axios<defaultType.responseList<map.mapList[]>>(url, {
        targetAPI: 'GetMapList',
        data: jsonData
    })
    return result
}