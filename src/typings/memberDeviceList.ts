interface SelectDataInit {
    phone?: string;
    name?: string;
    terminalNo?: string;
    currentPage?: number;
    pageSize?: number;
}
interface memberDeviceList {
    id: string;
    memberId: string;
    memberNick: string;
    memberImg: string;
    memberPhone: string;
    terminalNo: string;
    createDate: string;
    expirationDate: string;
}
export class InitData {
    selectData: SelectDataInit = {
        phone: "",
        terminalNo: "",
        currentPage: 1,
        pageSize: 10
    }
    list: memberDeviceList[] = []
}