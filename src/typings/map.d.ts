declare namespace map {
    interface mapList {
        id: string;
        name: string;
        code: string;
        memo: string;
        coordinateType: number;
        coordinateTypeName: string;
        paramList: {
            name: string;
            val: string;
            sort: string;
        }[],
        isDefault: boolean;
        isEnable: boolean;
        createDate: string;
    }
}