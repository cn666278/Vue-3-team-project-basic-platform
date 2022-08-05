declare namespace defaultType {
  interface requestDefaultType {
    targetAPI: string;
    token?: string;
    data?: object | string;
  }

  interface responseDefaultType<T = any | null> {
    State: number;
    Message: string;
    HasData: boolean;
    Data: T;
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
  interface memberdata {
    roleId?: string;
    account?: string;
    nick?: number;
    phone?: string;
    name?: string;
    currentPage?: number;
    pageSize?: number;
  }
}
