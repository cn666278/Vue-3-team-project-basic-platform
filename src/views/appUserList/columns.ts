import { formatDateTime } from "@/utils/common";
import { h } from "vue";

export const columns: any[] = [
  {
    title: "序号",
    key: "no", // no??
    width: 100,
  },
  {
    title: "头像",
    key: "img",
    width: 50,
    render: (row: { img: any; }) => {
      return h('img',
        {
          src: row.img,
          // 使用css style来设置圆形头像
          style: 'width: 35px; hegiht: 35px; border-radius: 50%'
        },
        { defaut: () => '' } // 默认值
      )
    },
  },
  {
    title: "昵称",
    key: "nick",
    width: 100,
  },
  {
    title: "手机号",
    key: "phone",
    width: 80,
  },
  {
    title: "绑定设备",
    key: "deviceList",
    align: "center",
    // 接口中缺少设备数量参数，使用deviceList数组长度来代替
    render: (row: any) => {
      return row.deviceList.length
    },
    width: 80,
  },
  {
    title: "注册时间",
    key: "createDate",
    width: 150,
    // 格式化日期时间戳
    render(row: { createDate: any }) {
      return formatDateTime(row.createDate);
    },
  },
  {
    title: "有效期",
    key: "expirationDate",
    width: 150,
    render(row: { createDate: any }) {
      return formatDateTime(row.createDate);
    },
  }
];