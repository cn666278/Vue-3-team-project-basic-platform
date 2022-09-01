import axios from "@/utils/request";
const url = '/Admin';

/**
 * @function GetMemberList 获取用户信息
 * @returns {String} token
 */
 export async function getMemberList(jsonData: member.memberdata) {
    const result = await axios<defaultType.responseList<member.memberList[]>>(url, {
        targetAPI: 'GetMemberList',
        data: jsonData
    })
    return result
}

/**
 * @function AddMember 添加用户
 * @param jsonData 提交字段
 * @returns {String} token
 */
 export async function addMember(jsonData:  member.memberdata) {
    const result = await axios<member.memberdata>(url, {
        targetAPI: 'AddMember',
        data: jsonData
    })
    return result
}
/**
 * @function GetMemberInfo 获取用户详情
 * @param jsonData 提交字段
 * @returns {String} token
 */
 export async function getMemberInfo(jsonData:  string) {
    const result = await axios<member.memberInfo>(url, {
        targetAPI: 'GetMemberInfo',
        data: jsonData
    })
    return result
}
/**
 * @function UpdateMember 修改用户
 * @param jsonData 提交字段
 * @returns {String} token
 */
 export async function updateMember(jsonData:  member.memberdata) {
    const result = await axios<member.memberdata>(url, {
        targetAPI: 'UpdateMember',
        data: jsonData
    })
    return result
}

/**
 * @function UpdateMemberPwd 修改用户密码
 * @param jsonData 提交字段
 * @returns {String} token
 */
 export async function updateMemberPwd(jsonData:  member.memberdata) {
    const result = await axios(url, {
        targetAPI: 'UpdateMemberPwd',
        data: jsonData
    })
    return result
}
/**
 * @function SetMemberIsEnable 设置用户启用状态
 * @param jsonData 提交字段
 * @returns {String} token
 */
 export async function setMemberIsEnable(jsonData: object) {
    const result = await axios(url, {
        targetAPI: 'SetMemberIsEnable',
        data: jsonData
    })
    return result
}