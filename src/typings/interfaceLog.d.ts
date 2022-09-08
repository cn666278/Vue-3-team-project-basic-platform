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
  interface DownloaddeviceMsgLogList {
    url: string;
    id: string;
  }
}
declare namespace WebLog {
  // 搜索的数据
  interface WebLogdata {
    controller?: string;
    resultState?: int;
    actionName?: string;
    nick?: string;
    beginTime?: string;
    endTime?: string;
    name?: string;
    currentPage?: number;
    pageSize?: number;
  }
  // 得到的数据
  interface WebLogList {
    nick: string;
    message: string;
    token: string;
    remoteIP: string;
    createDate: string;
    controller: string;
    actionName: string;
    type: string;
    param: string;
    result: string;
    resultState: int;
    time: string;
  }
}
declare namespace Exception {
  // 搜索的数据
  interface Exceptiondata {
    source?: string;
    exception?: string;
    beginTime?: string;
    endTime?: string;
    name?: string;
    currentPage?: number;
    pageSize?: number;
  }
  // 得到的数据
  interface ExceptionList {
    source: string;
    exception: string;
    createDate: string;
  }
}
