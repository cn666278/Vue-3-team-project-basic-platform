import qs from 'qs';
import Request from './request';
const request = new Request({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 1000 * 20,
})
export default <T>(url:string, jsonData: defaultType.requestDefaultType) => {
    return  request.request<T>({
        url: url,
        method: 'post',
        data: qs.stringify({
            action: jsonData.targetAPI,
            token: jsonData.token,
            data: typeof jsonData.data == 'string' ? jsonData.data : JSON.stringify(jsonData.data),
        })
    })
}