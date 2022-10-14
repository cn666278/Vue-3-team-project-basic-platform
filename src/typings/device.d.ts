// 设备转发
declare namespace device {
    // 搜索的数据
    interface deviceData {
        deviceTypeName?: string;
        businessGroupId?: string;
        deviceTypeId?: string;
        deviceTypeCode?: string;
        isEnable?: boolean;
        state?: int;
        name?: string;
        currentPage?: number;
        pageSize?: number;
    }
    // 得到的数据
    interface deviceList {
        id: string;
        name: string;
        carNumber: string;
        businessGroupId: string;
        businessGroupName: string;
        terminalNo: string;
        deviceTypeName: string;
        statusName: string;
        phone: string;
        isEnable: boolean;
        onlineDate: string;
        locationDate: string;
        isOnline: boolean;
        isDrive: boolean;
        powerVal: int;
        createDate: string;
    }
}

// 设备转发
declare namespace deviceTransmit {
    // 搜索的数据
    interface deviceTransmitdata {
        deviceId?: string;
        transmitServerId?: string;
        terminalNo?: string;
        serverAddress?: string;
        name?: string;
        currentPage?: number;
        pageSize?: number;
    }
    // 得到的数据
    interface deviceTransmitList {
        id: string;
        deviceId: string;
        transmitServerId: string;
        transmitServerName: string;
        deviceAgreement: string;
        terminalNo: string;
        serverAddress: string;
        createDate: string;
    }
    // 删除数据
    interface delList {
        idList: array;
    }
}
// 车辆调度-设备管理
declare namespace device {
    // 搜索的数据
    interface deviceData {
        deviceTypeName?: string;
        businessGroupId?: string;
        deviceTypeId?: string;
        isEnable?: string;
        state?: string;
        name?: string;
        currentPage?: number;
        pageSize?: number;
    }
    // 得到的数据
    interface deviceList {
        id: string;
        businessGroupId: string;
        businessGroupName: string;
        carNumber: string;
        deviceTypeName: string;
        isDrive: boolean;
        isEnable: boolean;
        isOnline: boolean;
        locationDate: string;
        name: string;
        onlineDate: string;
        phone: string;
        powerVal: string;
        statusName: string;
        createDate: string;
        
    }
    // 删除数据
    interface delList {
        idList: array;
    }
}
