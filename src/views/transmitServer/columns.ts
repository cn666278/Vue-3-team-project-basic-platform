import { h } from "vue";
import { NAvatar, NTag,NButton } from "naive-ui";
import { formatDateTime } from "@/utils/common";
export const columns: any[] = [
  {
    title: "转发服务器名称",
    key: "name",
    render(row:  any) {
      return row.name+'('+row.count+')';
    },
  },
  {
    title: "转发地址",
    key: "serverAddress",
  },
  {
    title: "是否全部转发",
    key: "isAll",
    width:120,
    render(row: { isAll: any }) {
      return h(
        NTag,
        {
          type: row.isAll ? "success" : "error",
          size: "small",
        },
        {
          default: () => (row.isAll ? "是" : "否"),
        }
      );
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
  {
    title: "创建日期",
    key: "updateDate",
    width:200,
    render(row: { updateDate: any }) {
      return formatDateTime(row.updateDate);
    },
  },
];