import axios from '@/utils/request';
const url = '/File'

/**
 * @function GetUploadFileList 获取附件列表
 * @param jsonData 查询列表字段
 * @returns 
 */
 export async function getUploadFileList(jsonData: updateFile.uploadFileListRequest) {
    const result = await axios<defaultType.responseList<updateFile.uploadFileList[]>>(url, {
        targetAPI: 'GetUploadFileList',
        data: jsonData
    })
    return result
}

/**
 * @function UploadFiles 批量上传附件
 * @param jsonData 上传文件类型与备注
 * @returns 
 */
export async function uploadFiles(jsonData: updateFile.uploadFilesRequest, files: File[]) {
    const result = await axios<updateFile.uploadFiles>(url, {
        targetAPI: 'UploadFiles',
        data: jsonData,
        files: files,
    })
    return result;
}