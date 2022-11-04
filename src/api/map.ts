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

/**
 * @function GetMapList 获取地图列表(免授权)
 * @param jsonData 
 * @returns 
 */
export async function getMapDataList() {
    const result = await axios<map.mapDataList[]>('/UnAuth', {
        targetAPI: 'GetMapList',
    });
    return result
}

/**
 * @function GetMapParamInfo 获取地图自定义参数
 * @param id 
 * @returns 
 */
export async function getMapParamInfo(id: string) {
    const result = await axios('/UnAuth', {
        targetAPI: 'GetMapParamInfo',
        data: id,
    });
    return result
}

/**
 * @function GetMapDeviceListInfo 获取地图勾选的设备详情--地图左侧点击
 * @param {map.mapDeviceListInfoRequest} jsonData 
 * @returns 
 */
export async function getMapDeviceListInfo(jsonData: map.mapDeviceListInfoRequest) {
    const result = await axios<map.mapDeviceListInfo>('/UnAuth', {
        targetAPI: 'GetMapDeviceListInfo',
        data: jsonData,
    });
    return result
}

/**
 * @function GetDeviceTrail 获取设备轨迹
 * @param jsonData 
 * @returns 
 */
export async function getDeviceTrail(jsonData: map.deviceTrailRequest) {
    const result = await axios<map.deviceTrail[]>(url, {
        targetAPI: 'GetDeviceTrail',
        data: jsonData,
    });
    return result
}