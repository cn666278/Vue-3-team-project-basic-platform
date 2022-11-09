interface SelectDataInit {
    name?: string;
    currentPage?: number;
    pageSize?: number;
}
interface memberDeviceList {
    id: string;
    nick: string;
    phone: string;
    img: string;
    createDate: string;
}
export class InitData {
    selectData: SelectDataInit = {
        name: "",
        currentPage: 1,
        pageSize: 10
    }
    list: memberDeviceList[] = []
}