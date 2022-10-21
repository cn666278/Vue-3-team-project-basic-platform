declare namespace MapFenceRecord {
    // 搜索的数据
    interface MapFenceRecorddata {
        terminalNo?: string;
        beginTime?: string;
        endTime?: string;
        name?: string;
        currentPage?: number;
        pageSize?: number;
    }
    // 得到的数据
    interface MapFenceRecordList {
        carNumber: string;
        deviceId: string;
        terminalNo: string;
        mapFenceId: string;
        mapFenceCode: string;
        mapFenceName: string;
        ieFlag: int;
        lat: string;
        lng: string;
        deviceDate: string;
        serverDate: string;
    }

    /**围栏点 */
    interface MapPointList {
        lat: number;
        lng: number;
        sort: number;
    }
    
    /**电子围栏树形 */
    interface MapFenceTree {
        id: string;
        pId: string;
        name: string;
        codeName: string;
        etype: number;
        etypeName: string;
        color: string;
        coreLng: string;
        coreLat: string;
        layer: number;
        lineWidth: number;
        sort: number;
        coordinateType: string;
        mapPointList: MapPointList[];
        isShow: boolean;
        businessParam: string;
        isFill: boolean;
        isRecord: boolean;
        isEnable: boolean;
        createDate: string;
        children: MapFenceTree[];
    }
}
