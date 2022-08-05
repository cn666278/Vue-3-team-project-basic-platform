import axios from "@/utils/request";
const url = '/Admin';

/**
 * @function GetMemberList 获取用户信息
 * @returns {String} token
 */
 export async function getMemberList(jsonData: member.memberdata) {
    const result = await axios< member.memberdata>(url, {
        targetAPI: 'GetMemberList',
        data: jsonData
    })
    return result
}

/**
 * @function AddMember 设置系统配置
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