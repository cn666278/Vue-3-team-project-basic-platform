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

/**
 * @function GetMapInfo 获取地图详情
 * @param id 
 * @returns 
 */
export async function getMapInfo(id: string) {
    const result = await axios<map.mapInfo>(url, {
        targetAPI: 'GetMapInfo',
        data: id,
    })
    return result
}

/**
 * @function AddMap 添加地图信息
 * @param jsonData 
 * @returns 
 */
export async function addMap(jsonData: map.mapInfo) {
    const result = await axios(url, {
        targetAPI: 'AddMap',
        data: jsonData
    }, {
        closeMessage: true,
    });
    return result
}

/**
 * @function UpdateMap 修改地图信息
 * @param jsonData 
 * @returns 
 */
export async function updateMap(jsonData: map.mapInfo) {
    const result = await axios(url, {
        targetAPI: 'UpdateMap',
        data: jsonData
    }, {
        closeMessage: true,
    });
    return result
}