import axios from "@/utils/request";
const url = '/DeviceControl';

/**
 * @function SealCard 电子锁施封--传设备号
 * @param jsonData 设备号
 * @returns 
 */
export async function sealCard(jsonData: string) {
    const result = await axios(url, {
        targetAPI: 'SealCard',
        data: jsonData
    })
    return result
}

/**
 * @function SealCard 电子锁解封--传设备号
 * @param jsonData 设备号
 * @returns 
 */
export async function unSealCard(jsonData: string) {
    const result = await axios(url, {
        targetAPI: 'UnSealCard',
        data: jsonData
    })
    return result
}

/**
 * @function LanternOpen 定位灯-亮灯
 * @param jsonData 设备号
 * @returns 
 */
export async function lanternOpen(jsonData: string) {
    const result = await axios(url, {
        targetAPI: 'LanternOpen',
        data: jsonData
    })
    return result
}

/**
 * @function LanternClose 定位灯-灭灯
 * @param jsonData 设备号
 * @returns 
 */
export async function lanternClose(jsonData: string) {
    const result = await axios(url, {
        targetAPI: 'LanternClose',
        data: jsonData
    })
    return result
}