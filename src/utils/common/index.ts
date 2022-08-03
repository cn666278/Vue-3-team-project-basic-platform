import type { RouteLocationNormalizedLoaded } from "vue-router";
/**
 * 设置页面title
 * @param title
 */
export const getTitle = (title: string): void => {
    document.title = title;
};

/**
 * 数组去重合并
 * @param arr1
 * @param arr2
 * @returns
 */
export function mergeArray<T extends RouteLocationNormalizedLoaded>(
    arr1: T[],
    arr2: T[],
    key: string
): T[] {
    for (let i = 0; i < arr1.length; i++) {
        const forArr1: { [key: string]: any } = arr1[i];
        for (let j = 0; j < arr2.length; j++) {
            const forArr2: { [key: string]: any } = arr2[j];
            if (forArr1[key] == forArr2[key]) {
                arr2.splice(j, 1);
            }
        }
    }
    arr1 = arr1.concat(arr2);
    return arr1;
}

/**
 * 时间格式转化
 * @param inputTime
 * @param formatStr
 * @returns
 */
export function formatDateTime(inputTime: Date, formatStr?: string):string {
    let date = new Date(inputTime);
    let y: string | number = date.getFullYear();
    let m: string | number = date.getMonth() + 1;
    m = m < 10 ? "0" + m : m;
    let d: string | number = date.getDate();
    d = d < 10 ? "0" + d : d;
    let h: string | number = date.getHours();
    h = h < 10 ? "0" + h : h;
    let minute: string | number = date.getMinutes();
    let second: string | number = date.getSeconds();
    minute = minute < 10 ? "0" + minute : minute;
    second = second < 10 ? "0" + second : second;
    if (formatStr == undefined) {
        return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
    } else {
        formatStr = formatStr.replace(/yyyy|YYYY/, y.toString());
        formatStr = formatStr.replace(/m|M/, m.toString());
        formatStr = formatStr.replace(/d|D/, d.toString());
        formatStr = formatStr.replace(/h|H/, h.toString());
        formatStr = formatStr.replace(/mm|MM/, minute.toString());
        formatStr = formatStr.replace(/ss|SS/, second.toString());
        return formatStr;
    }
}
