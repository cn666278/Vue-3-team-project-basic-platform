declare namespace defaultType {
    interface requestDefaultType {
        targetAPI: string;
        token?: string;
        data?: object | string;
        files?: File[]
    }
    interface responseDefaultType<T = any | null> {
        State: number;
        Message: string;
        HasData: boolean;
        Data: T;
    }
    interface requestList {
        name?: string;
        currentPage?: number;
        pageSize?: number;
    }
    interface responseList<T> {
        totalCount: number;
        totalPage: number;
        currentPage: number;
        pageSize: number;
        hasMore: boolean;
        data: T;
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
    interface enumType {
        id: number | null | string;
        text: string;
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
    interface deviceConfig {
        checkCD?: string;
        onlineCD?: string;
        driveCD?: number;
        trailFilter?: string;
        locationMapfenceCode?: string;
        speed?: number;
        ftpServerIp?: string;
        ftpPort?: string;
        ftpUser?: string;
        ftpPassWord?: string;
        ftpPath?: string;
    }
    interface FtpUploadConfig {
        ftpServerIp: string;
        ftpPort: number;
        ftpUser: string;
        ftpPassWord: string;
        ftpPath: string;
    }
}
// 用户管理
declare namespace member {
    // 用户管理搜索的数据
    interface memberdata {
        roleId?: string;
        account?: string;
        nick?: number;
        phone?: string;
        name?: string;
        currentPage?: number;
        pageSize?: number;
    }
    // 用户管理得到的数据
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
    interface memberInfo {
        id: string;
        account: string;
        nick: number;
        phone: string;
        roleName: string;
        isAdmin: boolean;
        isEnable: boolean;
        createDate?: string;
        img?: string;
        loginDate?: string;
        roleIdList?: array;
    }
}
// 设备管理
declare namespace deviceType {
    // 设备管理搜索的数据
    interface deviceTypedata {
        name?: string;
        currentPage?: number;
        pageSize?: number;
    }
    // 设备管理得到的数据
    interface deviceTypeList {
        id: string | null;
        name: string;
        manufacturer?: number;
        deviceModel?: string;
        version?: string;
        memo?: string;
        isEnable?: boolean;
        createDate?: string;
    }
    // 获取角色管理分配设备
    interface roleDeviceList {
        id: string;
        name: string;
    }
    // 角色管理分配设备数据
    interface roleDeviceData {
        roleId: string;
        deviceTypeIdList: Array;
    }

}
declare namespace AlarmMessage {
    // 搜索的数据
    interface AlarmMessagedata {
        alarmType?: int;
        terminalNo?: string;
        beginTime?: string;
        endTime?: string;
        name?: string;
        currentPage?: number;
        pageSize?: number;
    }
    // 得到的数据
    interface AlarmMessageList {
        message: string;
        deviceId: string;
        terminalNo: string;
        eType: int;
        lat: string;
        lng: string;
        createDate: string;
    }
}

declare namespace admin {
    /**菜单列表返回数据类型 */
    interface menuList {
        id: string;
        title: string;
        pid: string;
        pTitle: string;
        sort: number;
        url: string;
        icon: string;
        needAuth: boolean;
        isEnable: boolean;
        createDate: string;
        isHidden: boolean;
    }

    /**接口列表请求数据类型 */
    interface competenceListRequest {
        controllerName?: string;
        actionName?: string;
        isCheck?: boolean;
        name?: string;
        currentPage: number;
        pageSize: number;
    }
    /**接口列表返回数据类型 */
    interface competenceList {
        id: string;
        name: string;
        controllerName: string;
        actionName: string;
        needCheck: boolean;
        isEnable: boolean;
        createDate: string;
    }
    /**设备业务分组视频树形 */
    interface deviceVideoTree {
        id: string;
        pid: string;
        name: string;
        count: number;
        onlineCount: number;
        deviceList: deviceList[];
    }
    /**业务分组视频设备 */
    interface deviceList {
        deviceId: string;
        terminalNo: string;
        name: string;
        image: string;
        isOnline: boolean;
        channelList: number[];
    }
}
/**文件上传 */
declare namespace updateFile {
    interface uploadFileListRequest extends defaultType.requestList {
        eFileType?: number;
    }
    interface uploadFileList {
        id: string;
        fileType: string;
        fileName: string;
        fileExtension: string;
        fileUrl: string;
        memberName: string;
        isEnable: boolean;
        createDate: string;
    }
    interface uploadFilesRequest {
        eFileType?: number;
        memo?: string;
        // files?: File[];
    }
    interface uploadFiles {
        eFileType?: number;
        fileList: Array<{
            id: string;
            url: string;
        }>,
    }
}
/**免权接口类型 */
declare namespace unAuth {
    interface deviceList {
        deviceId: string;
        terminalNo: string;
        carNumber: string;
        image: string;
        status: number;
        sort: number;
    }
    interface groupList {
        id: string;
        pid: string;
        name: string;
        count: number;
        onlineCount: number;
        deviceList: deviceList[]
    }
    interface mapTreeList {
        count: number;
        driveCount: number;
        stopCount: number;
        offLineCount: number;
        groupList: groupList[]
    }
}

// 业务分组
declare namespace BusinessGroup {
    // 搜索的数据
    interface BusinessGroupData {
        name?: string;
        currentPage?: number;
        pageSize?: number;
    }
    // 得到的数据
    interface BusinessGroupList {
        id: string;
        name: string;
        image: string;
        pid: string;
        pName: string;
        needCheck: boolean;
        paramString: string;
        paramInt: number;
        paramDecimal: string;
        sort: number;
        isEnable: boolean;
        updateDate: string;
        // createDate: string;
    }
    interface BusinessGroupRoleData {
        businessGroupId: string | undefined;
        roleIdList: Array;
    }
    interface BusinessGroupRoleList {
        roleId: string;
        businessGroupId: string;
        createDate: string;
    }
}

// 里程查看
declare namespace deviceMileagee {
    interface deviceMileageeData {
        terminalNo?: string;
        businessParam?: string;
        beginTime?: string;
        endTime?: string;
        name?: string;
        currentPage?: number;
        pageSize?: number;
    }

    interface deviceMileageeList {
        id: string;
        deviceId: string;
        terminalNo: string;
        businessParam: string;
        mileage: number;
        totalMileage: number;
        trailCount: number;
        recordDate: string;
        createDate: string;
    }
}
// 数据统计
declare namespace dataStatistics {
    interface dataStatisticsList {
        dataStatistics: number;
        deviceOnlineCountToDay: number;
        deviceOnlineCountNow: number;
        mileageYesterDay: number;
        deviceTrailMonth: Array;
        deviceMileageMonth: Array;
        deviceMileageMonthTop: Array;
        deviceTrailSevenDay: Array;
        deviceMileageSevenDay: Array;
    }
}