// 设备转发
declare namespace transmitServer {
  // 搜索的数据
  interface transmitServerdata {
    serverAddress?: string;
    name?: string;
    currentPage?: number;
    pageSize?: number;
  }
  // 得到的数据
  interface transmitServerList {
    id: string;
    name: string;
    deviceAgreement: string;
    serverAddress: string;
    isAll: boolean;
    isEnable: boolean;
    count: int;
    updateDate: string;
  }
}
