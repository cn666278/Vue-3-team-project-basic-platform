import { h } from "vue";
import { NAvatar, NTag, NButton } from "naive-ui";
import { formatDateTime } from "@/utils/common";
export const columns: any[] = [
  {
    title: "序号",
    key: "no", // no??
    width: 30,
  },
  {
    title: "设备号",
    key: "terminalNo",
    width: 40,
  },
  {
    title: "ID",
    key: "id",
    width: 30,
  },
  {
    title: "用户昵称",
    key: "memberNick",
    width: 50,

  },
  {
    title: "用户手机号",
    key: "memberPhone",
    width: 40,
  },
  {
    title: "绑定日期",
    key: "createDate",
    width: 60,
    render(row: { createDate: any }) {
      return formatDateTime(row.createDate);
    },
  },
  {
    title: "有效期",
    key: "expirationDate",
    width: 60,
    render(row: { createDate: any }) {
      return formatDateTime(row.createDate);
    },
  }
];