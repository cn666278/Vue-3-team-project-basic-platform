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

/**
 * @function formatDateTime 时间格式转化
 * @param inputTime
 * @param formatStr
 * @returns
 */
export function formatDateTime(inputTime: Date, formatStr?: string): string {
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
function nodeChildren(node: any, newChildren?: any[]) {
  if (typeof newChildren !== "undefined") {
    node.children = newChildren;
  }
  return node.children;
}
export function getDynamicProps<T, U>(props: T): Partial<U> {
  const ret: Recordable = {};
  Object.keys(props).map((key) => {
    ret[key] = unref((props as Recordable)[key]);
  });
  return ret as Partial<U>;
}
export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
  let key: string;
  for (key in target) {
    src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key]);
  }
  return src;
}