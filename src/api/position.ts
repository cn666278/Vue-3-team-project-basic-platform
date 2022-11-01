import axios from "@/utils/request";
const url = "/Organizational";

// 职位查询参数
interface positionType {
    name?: string,
    currentPage: number,
    pageSize: number
}
// 职位列表参数
interface positionList {
    id?: string,
    name?: string,
    sort?: number,
}

/**
 * @function AddPosition 添加职位信息
 * @returns
 */
export async function AddPosition(jsonData: positionList) {
    const result = await axios(url, {
        targetAPI: 'AddPosition',
        data: jsonData
    })
    return result
}

/**
 * @function UpdatePosition 编辑职位信息
 * @returns
 */
export async function UpdatePosition(jsonData: positionList) {
    const result = await axios(url, {
        targetAPI: 'UpdatePosition',
        data: jsonData
    })
    return result
}

/**
 * @function DeletePosition 删除职位
 * @returns
 */
export async function DeletePosition(jsonData: string) {
    const result = await axios(url, {
        targetAPI: 'DeletePosition',
        data: jsonData
    })
    return result
}

/**
 * @function GetPositionInfo 获取职位详情
 * @returns
 */
export async function GetPositionInfo(jsonData: string) {
    const result = await axios<positionList>(url, {
        targetAPI: 'GetPositionInfo',
        data: jsonData
    })
    return result
}

/**
 * @function GetPositionList 获取职位列表
 * @returns
 */
export async function GetPositionList(jsonData: positionType) {
    const result = await axios<defaultType.responseList<positionList[]>>(url, {
        targetAPI: 'GetPositionList',
        data: jsonData
    })
    return result
}

