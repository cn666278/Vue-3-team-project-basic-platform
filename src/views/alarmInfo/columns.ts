import { h } from "vue";
import { NAvatar, NTag,NButton } from "naive-ui";
import { formatDateTime } from "@/utils/common";
export const columns: any[] = [
  {
    title: "设备终端号",
    key: "terminalNo",
    width:150,
  },
  {
    title: "经纬度",
    key: "lng",
    width:180,
    render(row: any) {
      return row.lng + "," + row.lat;
    },
  },
  {
    title: "报警消息",
    key: "message",
    width:220,
    
  },
  {
    title: "报警时间",
    key: "deviceDate",
    width:200,
    render(row: { deviceDate: any }) {
      return formatDateTime(row.deviceDate);
    },
  },
];