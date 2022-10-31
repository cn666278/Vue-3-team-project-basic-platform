import axios from "@/utils/request";
const url = "/Organizational";

// 部门查询参数
interface departmentType {
    pId?: string,
    dpId?: string,
    positionId?: string,
    departmentId?: string,
    positionName?: string,
    departmentName?: string,
    children?: Array<string>,
}
// 部门关联职位
interface departmentList {
    dpId?: string,
    departmentId?: string,
    pId?: string,
    positionId?: string,
    sort?: number,
}

/**
 * @function DepartmentBindPosition 部门关联职位
 * @returns
 */
export async function DepartmentBindPosition(jsonData: departmentList) {
    const result = await axios(url, {
        targetAPI: 'DepartmentBindPosition',
        data: jsonData
    })
    return result
}

/**
 * @function GetDepartmentPositionByDepartmentId 通过部门Id获取部门职位列表
 * @returns
 */
export async function GetDepartmentPositionByDepartmentId(jsonData: string) {
    const result = await axios<defaultType.responseList<departmentType[]>>(url, {
        targetAPI: 'GetDepartmentPositionByDepartmentId',
        data: jsonData
    })
    return result
}

/**
 * @function DeleteDepartmentPosition 删除部门职位关联数据
 * @returns
 */
 export async function DeleteDepartmentPosition(jsonData: string) {
    const result = await axios(url, {
        targetAPI: 'DeleteDepartmentPosition',
        data: jsonData
    })
    return result
}

