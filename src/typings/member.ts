interface SelectDataInit{
    roleId?: string;
    account?: string;
    nick?: number;
    phone?: string;
    name?: string;
    currentPage?: number;
    pageSize?: number;
}
interface listparam {
    totalCount: number;
    totalPage: number;
    currentPage: number;
    pageSize: number;
    hasMore: boolean;
}
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
export class InitData{
    selectData:SelectDataInit={
        account:undefined,
        currentPage:1,
        pageSize:10
    }
    list:memberList[]=[]
}