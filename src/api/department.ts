import axios from "@/utils/request";
const url = "/Organizational";

// 部门查询参数
interface departmentType {
    name?: string,
    currentPage: number,
    pageSize: number
}
// 部门列表参数
interface departmentList {
    id?: string,
    name?: string,
    pId?: string,
    pName?: string,
    createDate?: string,
}

/**
 * @function AddDepartment 添加部门信息
 * @returns
 */
export async function AddDepartment(jsonData: departmentList) {
    const result = await axios(url, {
        targetAPI: 'AddDepartment',
        data: jsonData
    })
    return result
}

/**
 * @function UpdateDepartment 编辑部门信息
 * @returns
 */
export async function UpdateDepartment(jsonData: departmentList) {
    const result = await axios(url, {
        targetAPI: 'UpdateDepartment',
        data: jsonData
    })
    return result
}

/**
 * @function DeleteDepartment 删除部门
 * @returns
 */
export async function DeleteDepartment(jsonData: string) {
    const result = await axios(url, {
        targetAPI: 'DeleteDepartment',
        data: jsonData
    })
    return result
}

/**
 * @function GetDepartmentInfo 获取部门详情
 * @returns
 */
export async function GetDepartmentInfo(jsonData: string) {
    const result = await axios<departmentList>(url, {
        targetAPI: 'GetDepartmentInfo',
        data: jsonData
    })
    return result
}

/**
 * @function GetDepartmentList 获取部门列表
 * @returns
 */
export async function GetDepartmentList(jsonData: departmentType) {
    const result = await axios<defaultType.responseList<departmentList[]>>(url, {
        targetAPI: 'GetDepartmentList',
        data: jsonData
    })
    return result
}

