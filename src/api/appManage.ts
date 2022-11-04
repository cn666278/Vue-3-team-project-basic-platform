import axios from "@/utils/request"; //导入一个axios的方法
const url = '/AppManage'; //创建一个静态的url常量

export interface memberDevice extends defaultType.requestList {
    // defaultType.requestList 中的属性： 
    // name?: string;  currentPage?: number;  pageSize?: number;
    phone?: string;
    terminalNo?: string;
}

// 注释，方便看是什么接口

/** 
 * @function GetMemberDeviceList 获取移动端绑定记录
 * @param jsonData 成员设备 memberDevice
 * @returns {String} result
 */
export async function getMemberDeviceList(jsonData: memberDevice) { // jsonData is a variable, can be any name(must call in data below)
    const result = await axios<defaultType.responseList<appManage.memberDeviceList[]>>(url, {
        targetAPI: 'GetMemberDeviceList', // 跟着API名称写
        data: jsonData
    })

    return result
}




