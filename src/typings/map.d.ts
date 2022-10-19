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
    interface mapDataList {
        id: string;
        name: string;
        code: string;
        eCoordinateType: number;
        isDefault: boolean;
    }
    interface mapDeviceListInfoRequest {
        deviceIdList: string[];
        coordinateType: number;
    }
    interface mapDeviceListInfo {
        name?: string;
        deviceId?: string;
        deviceTypeName?: string;
        terminalNo: string;
        carNumber?: string;
        speed: number;
        altitude: number;
        direction: number;
        isDrive?: boolean;
        isOnline?: boolean;
        locationDate?: string;
        lat: string;
        lng: string;
    }
    interface deviceTrail {
        lat: string;
        lng: string;
        isPosition: boolean;
        acc: boolean;
        altitude: number;
        speed: number;
        direction: number;
        mileage: number;
        wiFiSignalStrength: number;
        gnssCount: number;
        deviceDate: string;
        serverDate: string;
        stopMessage: string;
    }
    interface deviceTrailRequest {
        terminalNo?: string;
        businessParam?: string;
        isPosition?: boolean;
        isSupplementary?: boolean;
        coordinateType: number;
        beginTime: string;
        endTime: string;
    }
}