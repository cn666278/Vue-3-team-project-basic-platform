import axios from "@/utils/request"; //导入一个axios的方法
const url = '/AppManage'; //创建一个静态的url常量

/**
 * defaultType.requestList 中的属性： 
 * name?: string;  currentPage?: number;  pageSize?: number;
 */
export interface memberDevice extends defaultType.requestList {
    phone?: string;
    terminalNo?: string;
}
export interface commodityList extends defaultType.requestList {
    isEnable?: boolean;
}
export interface carOrderList extends defaultType.requestList {
    memberName?: string;
}

export interface userList extends defaultType.requestList { }

export interface storeList extends defaultType.requestList { }

export interface deviceForExcel {
    fileId: string; // 附件id
    salesStoreId: string;   // 门店id
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

/** 
 * @function GetMemberDeviceList 获取App用户列表
 * @param jsonData 用户列表 userList
 * @returns {String} result
 */
export async function getAppUserList(jsonData: userList) {
    const result = await axios<defaultType.responseList<appManage.appUserList[]>>(url, {
        targetAPI: 'GetAppUserList',
        data: jsonData
    })
    return result
}

/**
 * @function GetDeviceCommodityList 获取设备商品目录
 * @param jsonData 设备商品目录 commodityList
 * @returns {String} result
 */
export async function getDeviceCommodityList(jsonData: commodityList) {
    const result = await axios<defaultType.responseList<appManage.deviceCommodityList[]>>(url, {
        targetAPI: 'GetDeviceCommodityList',
        data: jsonData
    })
    return result
}
/**
 * @function GetDeviceCommodityInfo 获取设备商品详情
 * @param jsonData  
 * @returns {String} result
 */
export async function getDeviceCommodityInfo(jsonData: string) {
    const result = await axios<appManage.deviceCommodityInfo[]>(url, {
        targetAPI: 'GetDeviceCommodityInfo',
        data: jsonData
    })
    return result
}

/**
 * @function AddDeviceCommodity 添加设备商品
 * @param jsonData  
 * @returns {String} result
 */
export async function addDeviceCommodity(jsonData: appManage.deviceCommodityInfo) {
    const result = await axios(url, {
        targetAPI: 'AddDeviceCommodity',
        data: jsonData
    })
    return result
}

/**
 * @function UpdateDeviceCommodity 修改设备商品 
 * @param jsonData 
 * @returns {String} result
 */
export async function updateDeviceCommodity(jsonData: appManage.deviceCommodityInfo) {
    const result = await axios(url, {
        targetAPI: 'UpdateDeviceCommodity',
        data: jsonData
    })
    return result
}

/**
 * @function GetAppCarOrderList 获取车辆订单列表 
 * @param jsonData 
 * @returns {String} result
 */
export async function getAppCarOrderList(jsonData: carOrderList) {
    const result = await axios<defaultType.responseList<appManage.appCarOrderList[]>>(url, {
        targetAPI: 'GetAppCarOrderList',
        data: jsonData
    })
    return result
}

/**
 * @function GetAppCarOrderInfo 获取车辆订单详情
 * @param jsonData  
 * @returns {String} result
 */
export async function getAppCarOrderInfo(jsonData: string) {
    const result = await axios<appManage.appCarOrderInfo[]>(url, {
        targetAPI: 'GetAppCarOrderInfo',
        data: jsonData
    })
    return result
}

// ??? TODO ???
/**
 * @function AppCarOrderRefund 车辆订单退款 
 * @param jsonData 
 * @returns {String} result
 */
export async function appCarOrderRefund(jsonData: appManage.appCarOrderInfo) {
    const result = await axios(url, {
        targetAPI: 'AppCarOrderRefund',
        data: jsonData
    })
    return result
}

/** 
 * @function GetSalesStoreList 获取门店列表
 * @param jsonData 门店列表 storeList
 * @returns {String} result
 */
export async function getSalesStoreList(jsonData: storeList) {
    const result = await axios<defaultType.responseList<appManage.salesStoreList[]>>(url, {
        targetAPI: 'GetSalesStoreList',
        data: jsonData
    })
    return result
}

/**
 * @function GetSalesStoreInfo 获取门店详情
 * @param jsonData  
 * @returns {String} result
 */
export async function getSalesStoreInfo(jsonData: string) {
    const result = await axios<appManage.salesStoreInfo[]>(url, {
        targetAPI: 'GetSalesStoreInfo',
        data: jsonData
    })
    return result
}

/**
 * @function AddSalesStore 添加门店
 * @param jsonData  
 * @returns {String} result
 */
export async function addSalesStore(jsonData: appManage.salesStoreInfo) {
    const result = await axios(url, {
        targetAPI: 'AddSalesStore',
        data: jsonData
    })
    return result
}

/**
 * @function UpdateSalesStore 修改门店
 * @param jsonData  
 * @returns {String} result
 */
export async function updateSalesStore(jsonData: appManage.salesStoreInfo) {
    const result = await axios(url, {
        targetAPI: 'UpdateSalesStore',
        data: jsonData
    })
    return result
}

// TODO ???
/**
 * @function ImportDeviceForExcel 门店设备下发
 * @param jsonData  
 * @returns {String} result
 */
export async function importDeviceForExcel(jsonData: deviceForExcel) {
    const result = await axios(url, {
        targetAPI: 'ImportDeviceForExcel',
        data: jsonData
    })
    return result
}


