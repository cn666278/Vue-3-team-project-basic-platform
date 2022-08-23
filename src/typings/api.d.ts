declare namespace defaultType {
  interface requestDefaultType {
    targetAPI: string;
    token?: string;
    data?: object | string;
    files?: File[]
  }
  interface responseDefaultType<T = any | null> {
    State: number;
    Message: string;
    HasData: boolean;
    Data: T;
  }
  interface requestList {
    name?: string;
    currentPage?: number;
    pageSize?: number;
  }
  interface responseList<T> {
    totalCount: number;
    totalPage: number;
    currentPage: number;
    pageSize: number;
    hasMore: boolean;
    data: T;
  }
}
declare namespace login {
  import type { Ref } from "vue";
  interface loginRequestType extends ref {
    userName: string | Ref<string>;
    passWord: string | Ref<string>;
  }
  interface loginResponseType extends defaultType.responseDefaultType {
    Data: Auth.Token;
  }
  interface enumType {
    id: number;
    text: string;
  }
}
declare namespace config {
  interface sysConfig {
    apiSite?: string;
    socketUrl?: string;
    mapPointCD?: number;
    filePath?: string;
    indexURL?: string;
    isBusinessLogin?: boolean;
    title?: string;
    paramA?: string;
    paramB?: string;
    paramC?: string;
    updateDate?: string;
  }
}
// 用户管理
declare namespace member {
  // 用户管理搜索的数据
  interface memberdata {
    roleId?: string;
    account?: string;
    nick?: number;
    phone?: string;
    name?: string;
    currentPage?: number;
    pageSize?: number;
  }
  // 用户管理得到的数据
  interface memberList {
    id: string;
    deviceList: any;
    account: string;
    nick: number;
    phone: string;
    roleName: string;
    isAdmin: boolean;
    isEnable: boolean;
    createDate: string;
  }
}
declare namespace admin {
  /**菜单列表返回数据类型 */
  interface menuList {
    id: string;
    title: string;
    pid: string;
    pTitle: string;
    sort: number;
    url: string;
    icon: string;
    needAuth: boolean;
    isEnable: boolean;
    createDate: string;
    isHidden: boolean;
  }
  
  /**接口列表请求数据类型 */
  interface competenceListRequest {
    controllerName?: string;
    actionName?: string;
    isCheck?: boolean;
    name?: string;
    currentPage: number;
    pageSize: number;
  }
  /**接口列表返回数据类型 */
  interface competenceList {
    id: string;
    name: string;
    controllerName: string;
    actionName: string;
    needCheck: boolean;
    isEnable: boolean;
    createDate: string;
  }
}
// 文件上传
declare namespace updateFile {
  interface uploadFileListRequest extends defaultType.requestList {
    eFileType?: number;
  }
  interface uploadFileList {
    id: string;
    fileType: string;
    fileName: string;
    fileExtension: string;
    fileUrl: string;
    memberName: string;
    isEnable: boolean;
    createDate: string;
  }
  interface uploadFilesRequest {
    eFileType?: number;
    memo?: string;
    // files?: File[];
  }
  interface uploadFiles {
    eFileType?: number;
    fileList: File[],
  }
}