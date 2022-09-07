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
}
