declare namespace deviceMsgLog {
  // 搜索的数据
  interface deviceMsgLogdata {
    terminalNo?: string;
    protocol?: int;
    type?: string;
    beginTime?: string;
    endTime?: string;
    name?: string;
    currentPage?: number;
    pageSize?: number;
  }
  // 得到的数据
  interface deviceMsgLogList {
    terminalNo: string;
    msgLoggingType: string;
    protocol: string;
    hex: string;
    serverDate: string;
    remoteEndPoint: string;
  }
}
