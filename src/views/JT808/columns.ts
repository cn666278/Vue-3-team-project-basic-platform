import { h } from "vue";
import { NAvatar, NTag,NButton } from "naive-ui";
import { formatDateTime } from "@/utils/common";
export const columns: any[] = [
  {
    title: "设备号",
    key: "terminalNo",
    width:220,
  },
  {
    title: "消息类型",
    key: "msgLoggingType",
    width:130
  },
  {
    title: "协议类型",
    key: "protocol",
    width:120,
    
  },
  {
    title: "消息内容",
    key: "hex",
    width:350
  },
  {
    title: "远程端点",
    key: "remoteEndPoint",
    width:250
  },
  {
    title: "服务器时间",
    key: "serverDate",
    width:200,
    render(row: { serverDate: any }) {
      return formatDateTime(row.serverDate);
    },
  },
];