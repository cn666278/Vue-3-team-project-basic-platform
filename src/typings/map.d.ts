declare namespace map {
    interface mapList {
        id: string;
        name: string;
        code: string;
        memo: string;
        coordinateType: number;
        coordinateTypeName: string;
        paramList: paramData[],
        isDefault: boolean;
        isEnable: boolean;
        createDate: string;
    }
    interface mapInfo {
        id?: string;
        name: string;
        code: string;
        coordinateType: number;
        memo: string;
        paramList: paramData[],
        isDefault: boolean;
        isEnable: boolean;
    }
    interface paramData {
        name: string;
        val: string;
        sort: string;
    }
}