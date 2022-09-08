import { h } from "vue";
import { NAvatar, NTag,NButton } from "naive-ui";
import { formatDateTime } from "@/utils/common";
export const columns: any[] = [
  {
    title: "名称",
    key: "name",
    width:220,
  },
  {
    title: "厂家",
    key: "manufacturer",
    width:130
  },
  {
    title: "设备型号",
    key: "deviceModel",
    width:120,
    
  },
  {
    title: "版本号",
    key: "version",
    width:150
  },
  {
    title: "备注说明",
    key: "memo",
    width:250
  },
  {
    title: "创建日期",
    key: "createDate",
    width:200,
    render(row: { createDate: any }) {
      return formatDateTime(row.createDate);
    },
  },
  {
    title: "是否启用",
    key: "isEnable",
    width:80,
    render(row: { isEnable: any }) {
      return h(
        NTag,
        {
          type: row.isEnable ? "success" : "error",
          size: "small",
        },
        {
          default: () => (row.isEnable ? "启用" : "禁用"),
        }
      );
    },
  },
];