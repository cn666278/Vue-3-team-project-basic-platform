import { formatDateTime } from "@/utils/common";
export const columns: any[] = [
  {
    title: "序号",
    key: "no", // no??
    width: 10,
  },
  {
    title: "头像",
    key: "img",
    width: 5,
  },
  {
    title: "昵称",
    key: "nick",
    width: 10,
  },
  {
    title: "手机号",
    key: "phone",
    width: 10,
  },
  {
    title: "绑定设备",
    key: "deviceList",
    width: 8,
  },
  {
    title: "注册时间",
    key: "createDate",
    width: 15,
    render(row: { createDate: any }) {
      return formatDateTime(row.createDate);
    },
  },
  {
    title: "有效期",
    key: "expirationDate",
    width: 15,
    render(row: { createDate: any }) {
      return formatDateTime(row.createDate);
    },
  }
];