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
    // let _arr:T[] = new Array();
    // for (let i = 0; i < arr1.length; i++) {
    //     _arr.push(arr1[i]);
    // }
    // for (let i = 0; i < arr2.length; i++) {
    //     let flag = true;
    //     for (let j = 0; j < arr1.length; j++) {
    //         if (arr2[i] == arr1[j]) {
    //             flag = false;
    //             break;
    //         }
    //     }
    //     if (flag) {
    //         _arr.push(arr2[i]);
    //     }
    // }
    // return _arr;
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
