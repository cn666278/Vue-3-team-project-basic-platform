import { h } from "vue";
import { NAvatar, NTag,NButton } from "naive-ui";
import { formatDateTime } from "@/utils/common";
export const columns: any[] = [
  {
    title: "用户名",
    key: "account",
  },
  {
    title: "名称",
    key: "nick",
  },
  {
    title: "角色",
    key: "roleName",
  },
  {
    title: "手机号",
    key: "phone",
  },
  {
    title: "创建日期",
    key: "createDate",
    render(row: { createDate: any }) {
      return formatDateTime(row.createDate);
    },
  },
  {
    title: "是否后台",
    key: "isAdmin",
    render(row: { isAdmin: any }) {
      return h(
        NTag,
        {
          type: row.isAdmin ? "success" : "error",
          size: "small",
        },
        {
          default: () => (row.isAdmin ? "是" : "否"),
        }
      );
    },
  },
  {
    title: "是否启用",
    key: "isEnable",
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
  // {
  //   title: "操作",
  //   key: "action",
  //   render (row: any) {
  //     return h(
  //       NButton,
  //       {
  //         size: 'small',
  //         type:'error',
  //         strong:true,
  //         secondary:true,
  //         onClick: () => {
  //           deltableData(row)
  //         }
  //       },
  //       { default: () => '删除' }
  //     )
  //   }
  // },
];