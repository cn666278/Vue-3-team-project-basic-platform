import { unref } from "vue";
import type { RouteLocationNormalizedLoaded } from "vue-router";
import { isObject } from "../is";
/**
 * @function getTitle 设置页面title
 * @param title
 */
export const getTitle = (title: string): void => {
    document.title = title;
};

/**
 * @function mergeArray 数组去重合并
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
/**时间转时间字符串格式 */
export function timeStringFormat(time: string | number) {
    let date = new Date(time);
    let y = date.getFullYear();
    let m: string | number = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    let d: string | number = date.getDate();
    d = d < 10 ? '0' + d : d;
    let h: string | number = date.getHours();
    h = h < 10 ? '0' + h : h;
    let minute: string | number = date.getMinutes();
    let second: string | number = date.getSeconds();
    minute = minute < 10 ? '0' + minute : minute;
    second = second < 10 ? '0' + second : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
}
/**
 * @function formatDateTime 时间格式转化
 * @param inputTime
 * @param formatStr
 * @returns
 */
export function formatDateTime(
    inputTime: Date | string,
    formatStr?: string
): string {
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

/**
 * @function transformTozTreeFormat 将数组转换成树形结构
 * @param sNodes
 * @returns
 */
export function transformTozTreeFormat(sNodes: any[]) {
    //将普通的数组转换为父子结构
    let i, l;
    let r = [];
    let tmpMap: any = {};
    for (i = 0, l = sNodes.length; i < l; i++) {
        tmpMap[sNodes[i].id] = sNodes[i];
    }
    for (i = 0, l = sNodes.length; i < l; i++) {
        let p = tmpMap[sNodes[i].pid];
        if (p && sNodes[i].id != sNodes[i].pid) {
            let children = nodeChildren(p);
            if (!children) {
                children = nodeChildren(p, []);
            }
            children.push(sNodes[i]);
        } else {
            r.push(sNodes[i]);
        }
    }
    return r;
}
/**转树形单独使用 */
function nodeChildren(node: any, newChildren?: any[]) {
    if (typeof newChildren !== "undefined") {
        node.children = newChildren;
    }
    return node.children;
}
/**动态参数 */
export function getDynamicProps<T, U>(props: T): Partial<U> {
    const ret: Recordable = {};
    Object.keys(props).map((key) => {
        ret[key] = unref((props as Recordable)[key]);
    });
    return ret as Partial<U>;
}
/**动态table组件用的 */
export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
    let key: string;
    for (key in target) {
        src[key] = isObject(src[key])
            ? deepMerge(src[key], target[key])
            : (src[key] = target[key]);
    }
    return src;
}
/**动态获取assets文件 */
export function getAssetsFile(url: string, fileName: string) {
    return new URL(`../../assets/${url}/${fileName}`, import.meta.url).href;
}
/**计算方向 */
export function calculateDirection(direction: number | undefined) {
    if(direction) {
        let list = [
            '正北',
            '东北偏北',
            '东北',
            '东北偏东',
            '正东',
            '东南偏东',
            '东南',
            '东南偏南',
            '正南',
            '西南偏南',
            '西南',
            '西南偏西',
            '正西',
            '西北偏西',
            '西北',
            '西北偏北',
        ];
        let c = 360 / 16;
        let f = (direction + 1) / (c + 1);
        let a = list[Math.round(f)];
        return a;
    }
}
/**获取前N天的0点时间 */
export function someDaysAgoZero(val = 1) {
    let now = new Date();
    let date = new Date(now.getTime() - val * 24 * 3600 * 1000);
    let year = date.getFullYear();
    let month: string | number = date.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    let day: string | number = date.getDate();
    day = day < 10 ? '0' + day : day;
    let hour: string | number = date.getHours();
    hour = hour < 10 ? '0' + hour : hour;
    let minute: string | number = date.getMinutes();
    minute = minute < 10 ? '0' + minute : minute;
    let second: string | number = date.getSeconds();
    second = second < 10 ? '0' + second : second;
    let timeData = year + '-' + month + '-' + day + ' ' + '00' + ':' + '00' + ':' + '00';
    return timeData;
}
/**获取前N天的结束时间 */
export function someDaysAgoEnd(num = 1) {
    // 获取指定天数后一天时间
    let date = null;
    let now = new Date();
    if (num <= 1) {
        date = now.setHours(0, 0, 0, 0) - 1;
    } else {
        date = new Date(now.setHours(0, 0, 0, 0)).getTime() - (num - 1) * 24 * 3600 * 1000;
    }
    let time = timeStringFormat(date);
    return time;
}
/**获取当前开始时间 */
export function getBeginTime() {
    let now = new Date();
    let date = new Date(now.getTime() - 1 * 3600 * 1000);
    let year = date.getFullYear();
    let month: string | number = date.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    let day: string | number = date.getDate();
    day = day < 10 ? '0' + day : day;
    let hour: string | number = date.getHours();
    hour = hour < 10 ? '0' + hour : hour;
    let minute: string | number = date.getMinutes();
    minute = minute < 10 ? '0' + minute : minute;
    let second: string | number = date.getSeconds();
    second = second < 10 ? '0' + second : second;
    let timeData = year + '-' + month + '-' + day + ' ' + '00' + ':' + '00' + ':' + '00';
    return timeData;
}
/**获取当前开始时间 */
export function getEndTime() {
    let now = new Date();
    let date = new Date(now.getTime() - 1 * 3600 * 1000);
    let year = date.getFullYear();
    let month: string | number = date.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    let day: string | number = date.getDate();
    day = day < 10 ? '0' + day : day;
    let hour: string | number = date.getHours();
    hour = hour < 10 ? '0' + hour : hour;
    let minute: string | number = date.getMinutes();
    minute = minute < 10 ? '0' + minute : minute;
    let second: string | number = date.getSeconds();
    second = second < 10 ? '0' + second : second;
    let timeData = year + '-' + month + '-' + day + ' ' + '23' + ':' + '59' + ':' + '59';
    return timeData;
}