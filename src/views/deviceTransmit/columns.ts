import { h } from "vue";
import { NAvatar, NTag,NButton } from "naive-ui";
import { formatDateTime } from "@/utils/common";
export const columns: any[] = [
  {
    type: 'selection',
  },
  {
    title: "设备名称",
    key: "transmitServerName",
    width:220,
  },
  {
    title: "协议名称",
    key: "deviceAgreement",
    width:130
  },
  {
    title: "设备号",
    key: "terminalNo",
    width:120,
    
  },
  {
    title: "IP:端口",
    key: "serverAddress",
    width:150
  },
  
  {
    title: "创建日期",
    key: "createDate",
    width:200,
    render(row: { createDate: any }) {
      return formatDateTime(row.createDate);
    },
  },
];