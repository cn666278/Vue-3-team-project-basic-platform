import axios from "@/utils/request";
const url = '/Organizational';

/**
 * @function GetUserList 获取用户信息
 * @returns {String} token
 */
export async function getUserList(jsonData: user.userdata) {
    const result = await axios<defaultType.responseList<user.userList[]>>(url, {
        targetAPI: 'GetUserList',
        data: jsonData
    })
    return result
}

/**
 * @function AddUser 添加用户
 * @param jsonData 提交字段
 * @returns {String} token
 */
export async function addUser(jsonData: user.userdata) {
    const result = await axios<user.userdata>(url, {
        targetAPI: 'AddUser',
        data: jsonData
    })
    return result
}
/**
 * @function GetUserInfo 获取用户详情
 * @param jsonData 提交字段
 * @returns {String} token
 */
export async function getUserInfo(jsonData: string) {
    const result = await axios<user.userInfo>(url, {
        targetAPI: 'GetUserInfo',
        data: jsonData
    })
    return result
}
/**
 * @function UpdateUser 修改用户
 * @param jsonData 提交字段
 * @returns {String} token
 */
export async function updateUser(jsonData: user.userdata) {
    const result = await axios<user.userdata>(url, {
        targetAPI: 'UpdateUser',
        data: jsonData
    })
    return result
}

/**
 * @function UpdateUserPwd 修改用户密码
 * @param jsonData 提交字段
 * @returns {String} token
 */
export async function updateUserPwd(jsonData: user.userdata) {
    const result = await axios(url, {
        targetAPI: 'UpdateUserPwd',
        data: jsonData
    })
    return result
}
/**
 * @function SetUserIsEnable 设置用户启用状态
 * @param jsonData 提交字段
 * @returns {String} token
 */
export async function setUserIsEnable(jsonData: object) {
    const result = await axios(url, {
        targetAPI: 'SetUserIsEnable',
        data: jsonData
    })
    return result
}
/**
 * @function ImportUserForExcel 导入员工信息
 * @param jsonData 提交字段
 * @returns {String} token
 */
export async function importUserForExcel(jsonData: string) {
    const result = await axios<user.userInfo>(url, {
        targetAPI: 'ImportUserForExcel',
        data: jsonData
    })
    return result
}