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
    deviceList: deviceList[];
    createDate: string;
}
// ?? using import from api.d.ts ???
interface deviceList {
    name: string;
    expirationDate: string;
}
export class InitData {
    selectData: SelectDataInit = {
        name: "",
        currentPage: 1,
        pageSize: 10
    }
    list: memberDeviceList[] = []
}